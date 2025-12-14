#[allow(lint(self_transfer))]
module vsyo::vsyo;

use std::string::String;
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::event;
use sui::sui::SUI;

const EMarketNotResolved: u64 = 1;
const EDeadlinePassed: u64 = 2;
const EDeadlineNotReached: u64 = 3;
const EInsufficientAmount: u64 = 4;
const ENotWinner: u64 = 5;
const EInvalidOutcome: u64 = 6;
const EMarketAlreadyResolved: u64 = 7;

public struct AdminCap has key, store {
    id: UID,
}

public struct Market has key, store {
    id: UID,
    description: String,
    target_price: u64,
    asset_symbol: String,
    pyth_price_feed_id: vector<u8>,
    deadline: u64,
    yes_pool: Balance<SUI>,
    no_pool: Balance<SUI>,
    total_yes_shares: u64,
    total_no_shares: u64,
    protocol_fee_rate: u64,
    protocol_fees: Balance<SUI>,
    resolved: bool,
    outcome: Option<bool>,
    final_price: Option<u64>,
}

public struct Position has key, store {
    id: UID,
    market_id: ID,
    is_yes: bool,
    shares: u64,
    cost_basis: u64,
}

public struct MarketCreated has copy, drop {
    market_id: ID,
    description: String,
    target_price: u64,
    deadline: u64,
}

public struct PositionBought has copy, drop {
    market_id: ID,
    user: address,
    is_yes: bool,
    shares: u64,
    cost: u64,
}

public struct MarketResolved has copy, drop {
    market_id: ID,
    outcome: bool,
    final_price: u64,
}

public struct WinningsClaimed has copy, drop {
    market_id: ID,
    user: address,
    amount: u64,
}

fun init(ctx: &mut TxContext) {
    transfer::transfer(
        AdminCap {
            id: object::new(ctx),
        },
        ctx.sender(),
    )
}

public fun create_market(
    _: &AdminCap,
    description: String,
    target_price: u64,
    asset_symbol: String,
    pyth_price_feed_id: vector<u8>,
    deadline: u64,
    initial_liquidity: Coin<SUI>,
    protocol_fee_rate: u64,
    ctx: &mut TxContext,
) {
    let initial_amount = coin::value(&initial_liquidity);
    assert!(initial_amount > 0, EInsufficientAmount);

    let mut market = Market {
        id: object::new(ctx),
        description,
        target_price,
        asset_symbol,
        pyth_price_feed_id,
        deadline,
        yes_pool: balance::zero(),
        no_pool: balance::zero(),
        total_yes_shares: 0,
        total_no_shares: 0,
        protocol_fee_rate,
        protocol_fees: balance::zero(),
        resolved: false,
        outcome: option::none(),
        final_price: option::none(),
    };

    let mut initial_balance = coin::into_balance(initial_liquidity);
    let split_amount = initial_amount / 2;

    balance::join(&mut market.yes_pool, balance::split(&mut initial_balance, split_amount));
    balance::join(&mut market.no_pool, initial_balance);

    market.total_yes_shares = split_amount;
    market.total_no_shares = split_amount;

    event::emit(MarketCreated {
        market_id: object::uid_to_inner(&market.id),
        description: market.description,
        target_price: market.target_price,
        deadline: market.deadline,
    });
    transfer::share_object(market)
}

public fun resolve_market(
    _: &AdminCap,
    market: &mut Market,
    final_price: u64,
    clock: &sui::clock::Clock,
) {
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(sui::clock::timestamp_ms(clock) >= market.deadline, EDeadlineNotReached);

    let outcome = final_price >= market.target_price;
    market.resolved = true;
    market.outcome = option::some(outcome);
    market.final_price = option::some(final_price);

    event::emit(MarketResolved {
        market_id: object::uid_to_inner(&market.id),
        outcome,
        final_price,
    })
}

public fun buy_yes(
    market: &mut Market,
    payment: Coin<SUI>,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    buy_position(market, payment, true, clock, ctx)
}

public fun buy_no(
    market: &mut Market,
    payment: Coin<SUI>,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    buy_position(market, payment, false, clock, ctx)
}

#[allow(unused_variable)]
fun buy_position(
    market: &mut Market,
    payment: Coin<SUI>,
    is_yes: bool,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(sui::clock::timestamp_ms(clock) < market.deadline, EDeadlinePassed);

    let amount = coin::value(&payment);
    assert!(amount > 0, EInsufficientAmount);

    let fee_amount = (amount * market.protocol_fee_rate) / 10000;
    let net_amount = amount - fee_amount;

    let mut payment_balance = coin::into_balance(payment);

    balance::join(&mut market.protocol_fees, balance::split(&mut payment_balance, fee_amount));

    let (shares, pool, total_shares) = if (is_yes) {
        let shares = if (market.total_yes_shares == 0) {
            net_amount
        } else {
            (net_amount * market.total_yes_shares) / balance::value(&market.yes_pool)
        };
        balance::join(&mut market.yes_pool, payment_balance);
        market.total_yes_shares = market.total_yes_shares + shares;
        (shares, &market.yes_pool, market.total_yes_shares)
    } else {
        let shares = if (market.total_no_shares == 0) {
            net_amount
        } else {
            (net_amount * market.total_no_shares) / balance::value(&market.no_pool)
        };
        balance::join(&mut market.no_pool, payment_balance);
        market.total_no_shares = market.total_no_shares + shares;
        (shares, &market.no_pool, market.total_no_shares)
    };

    let position = Position {
        id: object::new(ctx),
        market_id: object::uid_to_inner(&market.id),
        is_yes,
        shares,
        cost_basis: amount,
    };

    event::emit(PositionBought {
        market_id: object::uid_to_inner(&market.id),
        user: ctx.sender(),
        is_yes,
        shares,
        cost: amount,
    });

    transfer::transfer(position, ctx.sender());
}

#[allow(unused_variable)]
public fun claim_winnings(market: &mut Market, position: Position, ctx: &mut TxContext) {
    assert!(market.resolved, EMarketNotResolved);
    assert!(position.market_id == object::uid_to_inner(&market.id), EInvalidOutcome);

    let outcome = *option::borrow(&market.outcome);
    assert!(position.is_yes == outcome, ENotWinner);

    let (winning_pool_value, losing_pool_value, total_winning_shares) = if (outcome) {
        (balance::value(&market.yes_pool), balance::value(&market.no_pool), market.total_yes_shares)
    } else {
        (balance::value(&market.no_pool), balance::value(&market.yes_pool), market.total_no_shares)
    };

    let total_pool = winning_pool_value + losing_pool_value;
    let winnings = (position.shares * total_pool) / total_winning_shares;

    let mut payout_balance = if (outcome) {
        balance::split(&mut market.yes_pool, winnings)
    } else {
        balance::split(&mut market.no_pool, winnings)
    };

    if (losing_pool_value > 0) {
        let losing_pool_ref = if (outcome) {
            &mut market.no_pool
        } else {
            &mut market.yes_pool
        };
        let losing_share = (position.shares * losing_pool_value) / total_winning_shares;
        if (losing_share > 0 && balance::value(losing_pool_ref) >= losing_share) {
            balance::join(&mut payout_balance, balance::split(losing_pool_ref, losing_share));
        };
    };

    let payout_amount = balance::value(&payout_balance);
    transfer::public_transfer(coin::from_balance(payout_balance, ctx), ctx.sender());

    event::emit(WinningsClaimed {
        market_id: position.market_id,
        user: ctx.sender(),
        amount: payout_amount,
    });

    let Position { id, market_id: _, is_yes: _, shares: _, cost_basis: _ } = position;
    object::delete(id);
}

public fun get_yes_price(market: &Market): u64 {
    let yes_value = balance::value(&market.yes_pool);
    let no_value = balance::value(&market.no_pool);
    let total = yes_value + no_value;

    if (total == 0) {
        5000
    } else {
        (yes_value * 10000) / total
    }
}

public fun get_no_price(market: &Market): u64 {
    10000 - get_yes_price(market)
}

public fun get_market_info(market: &Market): (String, u64, u64, bool, Option<bool>) {
    (market.description, market.target_price, market.deadline, market.resolved, market.outcome)
}

public fun get_market_pools(market: &Market): (u64, u64, u64, u64) {
    (
        balance::value(&market.yes_pool),
        balance::value(&market.no_pool),
        market.total_yes_shares,
        market.total_no_shares,
    )
}

#[test_only]

public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
