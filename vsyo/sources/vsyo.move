#[allow(lint(self_transfer))]
module vsyo::vsyo;

use std::string::String;
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::event;
use usdc::usdc::USDC;

const EMarketNotResolved: u64 = 1;
const EDeadlinePassed: u64 = 2;
const EDeadlineNotReached: u64 = 3;
const EInsufficientAmount: u64 = 4;
const ENotWinner: u64 = 5;
const EInvalidOutcome: u64 = 6;
const EMarketAlreadyResolved: u64 = 7;
const EInsufficientShares: u64 = 8;
const EInsufficientLiquidity: u64 = 9;

public struct AdminCap has key, store {
    id: UID,
}

public struct Market has key, store {
    id: UID,
    description: String,
    market_type: String,
    deadline: u64,
    // Fixed price shares
    yes_shares_sold: u64,
    no_shares_sold: u64,
    total_funds: Balance<USDC>,
    resolved: bool,
    outcome: Option<bool>,
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
    market_type: String,
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
}

public struct PositionSold has copy, drop {
    market_id: ID,
    user: address,
    is_yes: bool,
    shares: u64,
    payout: u64,
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
    market_type: String,
    deadline: u64,
    initial_liquidity: Coin<USDC>,
    ctx: &mut TxContext,
) {
    let liquidity = coin::value(&initial_liquidity);
    assert!(liquidity > 0, EInsufficientAmount);

    let market = Market {
        id: object::new(ctx),
        description,
        market_type,
        deadline,
        yes_shares_sold: 0,
        no_shares_sold: 0,
        total_funds: coin::into_balance(initial_liquidity),
        resolved: false,
        outcome: option::none(),
    };

    event::emit(MarketCreated {
        market_id: object::uid_to_inner(&market.id),
        description: market.description,
        market_type: market.market_type,
        deadline: market.deadline,
    });
    transfer::share_object(market)
}

public fun resolve_market(
    _: &AdminCap,
    market: &mut Market,
    outcome: bool,
    clock: &sui::clock::Clock,
) {
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(sui::clock::timestamp_ms(clock) >= market.deadline, EDeadlineNotReached);

    market.resolved = true;
    market.outcome = option::some(outcome);

    event::emit(MarketResolved {
        market_id: object::uid_to_inner(&market.id),
        outcome,
    })
}

public fun buy_yes(
    market: &mut Market,
    payment: Coin<USDC>,
    shares: u64,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    buy_position(market, payment, true, shares, clock, ctx)
}

public fun buy_no(
    market: &mut Market,
    payment: Coin<USDC>,
    shares: u64,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    buy_position(market, payment, false, shares, clock, ctx)
}

fun buy_position(
    market: &mut Market,
    payment: Coin<USDC>,
    is_yes: bool,
    shares_to_buy: u64,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(sui::clock::timestamp_ms(clock) < market.deadline, EDeadlinePassed);
    assert!(shares_to_buy > 0, EInsufficientAmount);

    // Fixed price: 1 cent per share (1 USDC = 100 cents)
    let cost = shares_to_buy; // 1 cent per share, so cost in cents = shares_to_buy

    let amount = coin::value(&payment);
    assert!(amount >= cost, EInsufficientAmount);

    // --- Liquidity check: ensure after buy, funds >= total shares ---
    let total_shares = market.yes_shares_sold + market.no_shares_sold + shares_to_buy;
    let future_funds = balance::value(&market.total_funds) + cost;
    assert!(future_funds >= total_shares, EInsufficientLiquidity);
    // --- End liquidity check ---

    let mut payment_balance = coin::into_balance(payment);

    // Take cost into total funds
    balance::join(&mut market.total_funds, balance::split(&mut payment_balance, cost));

    // Refund excess
    if (balance::value(&payment_balance) > 0) {
        transfer::public_transfer(coin::from_balance(payment_balance, ctx), ctx.sender());
    } else {
        balance::destroy_zero(payment_balance);
    };

    // Update shares sold
    if (is_yes) {
        market.yes_shares_sold = market.yes_shares_sold + shares_to_buy;
    } else {
        market.no_shares_sold = market.no_shares_sold + shares_to_buy;
    };

    let position = Position {
        id: object::new(ctx),
        market_id: object::uid_to_inner(&market.id),
        is_yes,
        shares: shares_to_buy,
        cost_basis: cost,
    };

    event::emit(PositionBought {
        market_id: object::uid_to_inner(&market.id),
        user: ctx.sender(),
        is_yes,
        shares: shares_to_buy,
        cost,
    });

    transfer::transfer(position, ctx.sender());
}

/// Sell entire position back to the market at current price
public fun sell_position(
    market: &mut Market,
    position: Position,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(sui::clock::timestamp_ms(clock) < market.deadline, EDeadlinePassed);
    assert!(position.market_id == object::uid_to_inner(&market.id), EInvalidOutcome);

    let shares = position.shares;
    let is_yes = position.is_yes;

    // Fixed price: 1 cent per share
    let payout = shares;

    // Check market has enough liquidity
    assert!(balance::value(&market.total_funds) >= payout, EInsufficientLiquidity);

    // Burn shares - decrease sold count
    if (is_yes) {
        market.yes_shares_sold = market.yes_shares_sold - shares;
    } else {
        market.no_shares_sold = market.no_shares_sold - shares;
    };

    // Pay the seller
    let payout_balance = balance::split(&mut market.total_funds, payout);
    transfer::public_transfer(coin::from_balance(payout_balance, ctx), ctx.sender());

    event::emit(PositionSold {
        market_id: position.market_id,
        user: ctx.sender(),
        is_yes,
        shares,
        payout,
    });

    // Destroy the position
    let Position { id, market_id: _, is_yes: _, shares: _, cost_basis: _ } = position;
    object::delete(id);
}

/// Sell partial shares - keeps the position with remaining shares
public fun sell_partial(
    market: &mut Market,
    position: &mut Position,
    shares_to_sell: u64,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext,
) {
    assert!(!market.resolved, EMarketAlreadyResolved);
    assert!(sui::clock::timestamp_ms(clock) < market.deadline, EDeadlinePassed);
    assert!(position.market_id == object::uid_to_inner(&market.id), EInvalidOutcome);
    assert!(shares_to_sell > 0 && shares_to_sell <= position.shares, EInsufficientShares);

    let is_yes = position.is_yes;

    // Fixed price: 1 cent per share
    let payout = shares_to_sell;

    // Check market has enough liquidity
    assert!(balance::value(&market.total_funds) >= payout, EInsufficientLiquidity);

    // Burn shares - decrease sold count
    if (is_yes) {
        market.yes_shares_sold = market.yes_shares_sold - shares_to_sell;
    } else {
        market.no_shares_sold = market.no_shares_sold - shares_to_sell;
    };

    // Update position
    position.shares = position.shares - shares_to_sell;

    // Pay the seller
    let payout_balance = balance::split(&mut market.total_funds, payout);
    transfer::public_transfer(coin::from_balance(payout_balance, ctx), ctx.sender());

    event::emit(PositionSold {
        market_id: position.market_id,
        user: ctx.sender(),
        is_yes,
        shares: shares_to_sell,
        payout,
    });
}

public fun claim_winnings(market: &mut Market, position: Position, ctx: &mut TxContext) {
    assert!(market.resolved, EMarketNotResolved);
    assert!(position.market_id == object::uid_to_inner(&market.id), EInvalidOutcome);

    // Ensure outcome is Some before dereferencing
    assert!(option::is_some(&market.outcome), EMarketNotResolved);
    let outcome = *option::borrow(&market.outcome);
    assert!(position.is_yes == outcome, ENotWinner);

    // Winners split the total pool proportionally
    let total_winning_shares = if (outcome) {
        market.yes_shares_sold
    } else {
        market.no_shares_sold
    };

    // Fixed price: 1 cent per share
    let winnings = position.shares;

    let payout_balance = balance::split(&mut market.total_funds, winnings);
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

/// Price in basis points (0-10000)
/// YES price = YES_shares_sold / (YES_shares_sold + NO_shares_sold)
/// More YES sold = higher YES price (market thinks YES is more likely)
public fun get_yes_price(market: &Market): u64 {
    let total_sold = market.yes_shares_sold + market.no_shares_sold;

    if (total_sold == 0) {
        5000 // 50% starting price
    } else {
        (market.yes_shares_sold * 10000) / total_sold
    }
}

public fun get_no_price(market: &Market): u64 {
    10000 - get_yes_price(market)
}

public fun get_market_info(market: &Market): (String, u64, bool, Option<bool>) {
    (market.description, market.deadline, market.resolved, market.outcome)
}

public fun get_market_shares(market: &Market): (u64, u64) {
    (market.yes_shares_sold, market.no_shares_sold)
}

public fun get_position_info(position: &Position): (ID, bool, u64, u64) {
    (position.market_id, position.is_yes, position.shares, position.cost_basis)
}

public fun get_total_funds(market: &Market): u64 {
    balance::value(&market.total_funds)
}

#[test_only]

public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
