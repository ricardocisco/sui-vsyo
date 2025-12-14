#[test_only]
module vsyo::vsyo_tests;

use std::string;
use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::test_scenario::{Self as ts, Scenario};
use vsyo::vsyo::{Self, AdminCap, Market, Position};

// Endereços de teste
const ADMIN: address = @0xaff4aa6b23ab90242864b295b8e92986c3e575aa4e1efd18927b6539572dd391;
const USER1: address = @0x533a11135d2c30e1cd44f295fa1f44aa1f68812ed07bc717159dc37f6ac5fa0b;
const USER2: address = @0xff84b7e424ee28b3c2b4251a8236197dfd79094fcc262e11ef051ce4a526002c;
const USER3: address = @0xbb285447e36648cf9c8ad349eeccc6496d82663e3f924bb33b640c0f9bb64808;

// Constantes de teste
const INITIAL_LIQUIDITY: u64 = 1_000_000_000; // 1 SUI
const BET_AMOUNT: u64 = 100_000_000; // 0.1 SUI

/// Cria cenário de teste inicial
fun setup_test(): Scenario {
    let mut scenario = ts::begin(ADMIN);

    // Inicializa o módulo
    {
        vsyo::init_for_testing(ts::ctx(&mut scenario));
    };

    scenario
}

/// Helper: Cria mercado de teste
fun create_test_market(scenario: &mut Scenario): ID {
    ts::next_tx(scenario, ADMIN);
    {
        let admin_cap = ts::take_from_sender<AdminCap>(scenario);
        let initial_liquidity = coin::mint_for_testing<SUI>(INITIAL_LIQUIDITY, ts::ctx(scenario));

        vsyo::create_market(
            &admin_cap,
            string::utf8(b"BTC > $100k in 15min?"),
            100_000_00000000, // $100k com 8 decimais
            string::utf8(b"BTC"),
            x"0123456789abcdef", // Mock Pyth ID
            1734220800000, // 15 minutos no futuro (mock)
            initial_liquidity,
            100, // 1% fee
            ts::ctx(scenario),
        );

        ts::return_to_sender(scenario, admin_cap);
    };

    // Pega o ID do mercado criado
    ts::next_tx(scenario, ADMIN);
    let market = ts::take_shared<Market>(scenario);
    let _market_id = object::id(&market);
    ts::return_shared(market);

    _market_id
}

/// Helper: Cria clock para testes
fun create_test_clock(scenario: &mut Scenario) {
    ts::next_tx(scenario, ADMIN);
    {
        let clock = clock::create_for_testing(ts::ctx(scenario));
        clock::share_for_testing(clock);
    };
}

// ==================== TESTES ====================

#[test]
fun test_create_market() {
    let mut scenario = setup_test();

    // Cria mercado
    let _market_id = create_test_market(&mut scenario);

    // Verifica que mercado foi criado
    ts::next_tx(&mut scenario, ADMIN);
    {
        let market = ts::take_shared<Market>(&scenario);

        let (desc, target, deadline, resolved, outcome) = vsyo::get_market_info(&market);

        assert!(desc == string::utf8(b"BTC > $100k in 15min?"), 0);
        assert!(target == 100_000_00000000, 1);
        assert!(!resolved, 2);
        assert!(outcome.is_none(), 3);

        ts::return_shared(market);
    };

    ts::end(scenario);
}

#[test]
fun test_buy_yes_position() {
    let mut scenario = setup_test();
    create_test_clock(&mut scenario);
    let _market_id = create_test_market(&mut scenario);

    // USER1 compra posição YES
    ts::next_tx(&mut scenario, USER1);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_yes(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Verifica que posição foi criada
    ts::next_tx(&mut scenario, USER1);
    {
        let position = ts::take_from_sender<Position>(&scenario);

        // Verifica propriedades da posição (você precisaria adicionar getters no contrato)
        // Por enquanto, só verifica que existe

        ts::return_to_sender(&scenario, position);
    };

    ts::end(scenario);
}

#[test]
fun test_buy_no_position() {
    let mut scenario = setup_test();
    create_test_clock(&mut scenario);
    let _market_id = create_test_market(&mut scenario);

    // USER2 compra posição NO
    ts::next_tx(&mut scenario, USER2);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_no(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Verifica que posição foi criada
    ts::next_tx(&mut scenario, USER2);
    {
        let position = ts::take_from_sender<Position>(&scenario);
        ts::return_to_sender(&scenario, position);
    };

    ts::end(scenario);
}

#[test]
fun test_multiple_users_betting() {
    let mut scenario = setup_test();
    create_test_clock(&mut scenario);
    let _market_id = create_test_market(&mut scenario);

    // USER1 compra YES
    ts::next_tx(&mut scenario, USER1);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_yes(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // USER2 compra NO
    ts::next_tx(&mut scenario, USER2);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_no(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // USER3 compra YES também
    ts::next_tx(&mut scenario, USER3);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT * 2, ts::ctx(&mut scenario));

        vsyo::buy_yes(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Verifica pools
    ts::next_tx(&mut scenario, ADMIN);
    {
        let market = ts::take_shared<Market>(&scenario);
        let (yes_pool, no_pool, yes_shares, no_shares) = vsyo::get_market_pools(&market);

        // Deveria ter mais no YES pool do que NO
        assert!(yes_pool > no_pool, 0);

        ts::return_shared(market);
    };

    ts::end(scenario);
}

#[test]
fun test_resolve_market_yes_wins() {
    let mut scenario = setup_test();
    create_test_clock(&mut scenario);
    let _market_id = create_test_market(&mut scenario);

    // USER1 compra YES
    ts::next_tx(&mut scenario, USER1);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_yes(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Avança o tempo
    ts::next_tx(&mut scenario, ADMIN);
    {
        let mut clock = ts::take_shared<Clock>(&scenario);
        clock::increment_for_testing(&mut clock, 1734220800001); // Passa do deadline
        ts::return_shared(clock);
    };

    // Admin resolve o mercado (YES vence)
    ts::next_tx(&mut scenario, ADMIN);
    {
        let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);

        vsyo::resolve_market(
            &admin_cap,
            &mut market,
            100_001_00000000, // Preço acima do target (YES vence)
            &clock,
        );

        ts::return_to_sender(&scenario, admin_cap);
        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Verifica que mercado foi resolvido
    ts::next_tx(&mut scenario, ADMIN);
    {
        let market = ts::take_shared<Market>(&scenario);
        let (_, _, _, resolved, outcome) = vsyo::get_market_info(&market);

        assert!(resolved, 0);
        assert!(outcome.is_some(), 1);
        assert!(*outcome.borrow() == true, 2); // YES venceu

        ts::return_shared(market);
    };

    ts::end(scenario);
}

#[test]
fun test_claim_winnings() {
    let mut scenario = setup_test();
    create_test_clock(&mut scenario);
    let _market_id = create_test_market(&mut scenario);

    // USER1 compra YES
    ts::next_tx(&mut scenario, USER1);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_yes(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // USER2 compra NO (vai perder)
    ts::next_tx(&mut scenario, USER2);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_no(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Avança o tempo e resolve (YES vence)
    ts::next_tx(&mut scenario, ADMIN);
    {
        let mut clock = ts::take_shared<Clock>(&scenario);
        clock::increment_for_testing(&mut clock, 1734220800001);
        ts::return_shared(clock);
    };

    ts::next_tx(&mut scenario, ADMIN);
    {
        let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);

        vsyo::resolve_market(&admin_cap, &mut market, 100_001_00000000, &clock);

        ts::return_to_sender(&scenario, admin_cap);
        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // USER1 resgata ganhos (vencedor)
    ts::next_tx(&mut scenario, USER1);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let position = ts::take_from_sender<Position>(&scenario);

        vsyo::claim_winnings(&mut market, position, ts::ctx(&mut scenario));

        ts::return_shared(market);
    };

    // Verifica que USER1 recebeu SUI de volta
    ts::next_tx(&mut scenario, USER1);
    {
        // USER1 deveria ter recebido um Coin<SUI> com os ganhos
        // (O teste framework cria automaticamente)
        assert!(ts::has_most_recent_for_sender<Coin<SUI>>(&scenario), 0);
    };

    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = vsyo::ENotWinner)]
fun test_claim_winnings_loser_fails() {
    let mut scenario = setup_test();
    create_test_clock(&mut scenario);
    let _market_id = create_test_market(&mut scenario);

    // USER2 compra NO (vai perder)
    ts::next_tx(&mut scenario, USER2);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(BET_AMOUNT, ts::ctx(&mut scenario));

        vsyo::buy_no(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Resolve (YES vence, então NO perde)
    ts::next_tx(&mut scenario, ADMIN);
    {
        let mut clock = ts::take_shared<Clock>(&scenario);
        clock::increment_for_testing(&mut clock, 1734220800001);
        ts::return_shared(clock);
    };

    ts::next_tx(&mut scenario, ADMIN);
    {
        let admin_cap = ts::take_from_sender<AdminCap>(&scenario);
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);

        vsyo::resolve_market(&admin_cap, &mut market, 100_001_00000000, &clock);

        ts::return_to_sender(&scenario, admin_cap);
        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // USER2 tenta resgatar (deve falhar)
    ts::next_tx(&mut scenario, USER2);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let position = ts::take_from_sender<Position>(&scenario);

        vsyo::claim_winnings(&mut market, position, ts::ctx(&mut scenario));
        // Deve abortar aqui com ENotWinner

        ts::return_shared(market);
    };

    ts::end(scenario);
}

#[test]
fun test_odds_calculation() {
    let mut scenario = setup_test();
    create_test_clock(&mut scenario);
    let _market_id = create_test_market(&mut scenario);

    // Verifica odds iniciais (50/50)
    ts::next_tx(&mut scenario, ADMIN);
    {
        let market = ts::take_shared<Market>(&scenario);
        let yes_price = vsyo::get_yes_price(&market);
        let no_price = vsyo::get_no_price(&market);

        // Deveria estar perto de 5000 (50%)
        assert!(yes_price >= 4900 && yes_price <= 5100, 0);
        assert!(no_price >= 4900 && no_price <= 5100, 1);

        ts::return_shared(market);
    };

    // USER1 compra muito YES
    ts::next_tx(&mut scenario, USER1);
    {
        let mut market = ts::take_shared<Market>(&scenario);
        let clock = ts::take_shared<Clock>(&scenario);
        let payment = coin::mint_for_testing<SUI>(500_000_000, ts::ctx(&mut scenario)); // 0.5 SUI

        vsyo::buy_yes(&mut market, payment, &clock, ts::ctx(&mut scenario));

        ts::return_shared(market);
        ts::return_shared(clock);
    };

    // Verifica que odds mudaram (YES mais caro, NO mais barato)
    ts::next_tx(&mut scenario, ADMIN);
    {
        let market = ts::take_shared<Market>(&scenario);
        let yes_price = vsyo::get_yes_price(&market);
        let no_price = vsyo::get_no_price(&market);

        // YES deveria estar mais caro que 50%
        assert!(yes_price > 5000, 0);
        // NO deveria estar mais barato que 50%
        assert!(no_price < 5000, 1);
        // Soma deve ser 100%
        assert!(yes_price + no_price == 10000, 2);

        ts::return_shared(market);
    };

    ts::end(scenario);
}
