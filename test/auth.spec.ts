import * as assert from "assert";
import * as nock from "nock";
import {
  AuthenticatedClient,
  Headers,
  ApiUri,
  Balances,
  CompleteBalances,
  Adresses,
  NewAddress,
  DepositsWithdrawals,
  Orders,
  TradesPrivate,
  OrderTrade,
  OrderStatus,
  OrderResult,
  CancelResponse,
  CancelAllResponse,
  MoveResponse,
  WithdrawResponse,
  FeesInfo,
  AccountBalances,
  TradableBalances,
  TransferResponse,
  MarginSummary,
  MarginOrderResult
} from "../index";

const key = "poloniex-api-key";
const secret = "poloniex-api-secret";
const client = new AuthenticatedClient({ key, secret });
const nonce = 1;
client.nonce = () => nonce;

suite("AuthenticatedClient", () => {
  test("constructor", () => {
    const apiUri = "https://new-poloniex-api-url.com";
    const timeout = 9000;
    const currencyPair = "BTC_ETH";
    const client = new AuthenticatedClient({
      apiUri,
      timeout,
      currencyPair,
      key,
      secret
    });
    assert.deepStrictEqual(client.currencyPair, currencyPair);
    assert.deepStrictEqual(client.key, key);
    assert.deepStrictEqual(client.secret, secret);
    assert.deepStrictEqual(client._rpoptions, {
      baseUrl: apiUri,
      json: true,
      timeout,
      headers: Headers
    });
  });

  test(".getBalances()", async () => {
    const balances: Balances = {
      BTC: "1.23456789",
      DASH: "0.00000000"
    };
    const command = "returnBalances";
    nock(ApiUri)
      .post("/tradingApi", { command, nonce })
      .reply(200, balances);

    const data = await client.getBalances();
    assert.deepStrictEqual(data, balances);
  });

  test(".getCompleteBalances()", async () => {
    const balances: CompleteBalances = {
      BTC: {
        available: "0.00000000",
        onOrders: "0.00000000",
        btcValue: "0.00000000"
      },
      USDT: {
        available: "0.00000000",
        onOrders: "0.00000000",
        btcValue: "0.00000000"
      }
    };
    const command = "returnCompleteBalances";
    const account = "all";

    nock(ApiUri)
      .post("/tradingApi", { command, account, nonce })
      .reply(200, balances);

    const data = await client.getCompleteBalances({ account });
    assert.deepStrictEqual(data, balances);
  });

  test(".getDepositAddresses()", async () => {
    const addresses: Adresses = {
      BTC: "12ov76RsWq5PS8mUxpzGiA7aU2NSJ4WQJV",
      USDC: "0x2a3279534a8fc3aab174628d5df28253bde6a95e",
      USDT: "1HDr6rDk4n8kzgbon4rXs1qtBtC9XUNAZ5"
    };
    const command = "returnDepositAddresses";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce })
      .reply(200, addresses);

    const data = await client.getDepositAddresses();
    assert.deepStrictEqual(data, addresses);
  });

  test(".getNewAddress()", async () => {
    const currency = "ETH";
    const address: NewAddress = {
      success: 1,
      response: "0x2a3279534a8fc3aab174628d5df28253bde6a95e"
    };
    const command = "generateNewAddress";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, currency })
      .reply(200, address);

    const data = await client.getNewAddress({ currency });
    assert.deepStrictEqual(data, address);
  });

  test(".getDepositsWithdrawals()", async () => {
    const start = 1529425667;
    const end = 1560961667;
    const command = "returnDepositsWithdrawals";
    const response: DepositsWithdrawals = {
      adjustments: [
        {
          currency: "STR",
          amount: "2.38291827",
          timestamp: 1538419390,
          status: "COMPLETE",
          category: "adjustment",
          adjustmentTitle: "Stellar Inflation",
          adjustmentDesc:
            "Your Stellar inflation reward for the week of Jun 11, 2019.",
          adjustmentHelp:
            "https://poloniex.freshdesk.com/support/solutions/articles/1000278072-stellar-inflation-what-is-it-and-other-frequently-asked-questions"
        }
      ],
      deposits: [
        {
          currency: "BTC",
          amount: "1.49998357",
          confirmations: 1,
          timestamp: 1537304458,
          status: "COMPLETE",
          depositNumber: 7397519,
          category: "deposit",
          fiatAccountId: null,
          scope: null,
          address: "131rdg5Rzn6BFufnnQaHhVa5ZtRU1J2EZR",
          txid:
            "b05bdec7430a56b5a5ed34af4a31a54859dda9b7c88a5586bc5d6540cdfbfc7a"
        }
      ],
      withdrawals: [
        {
          withdrawalNumber: 64529364,
          currency: "DASH",
          address: "DASH-address",
          amount: "43.00000001",
          fee: "0.00100000",
          timestamp: 1542658352,
          status: "COMPLETE: tx-id",
          ipAddress: "192.168.0.1",
          canCancel: 0,
          canResendEmail: 0,
          paymentID: null
        }
      ]
    };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, start, end })
      .reply(200, response);

    const data = await client.getDepositsWithdrawals({ start, end });
    assert.deepStrictEqual(data, response);
  });

  test(".getOpenOrders()", async () => {
    const currencyPair = "BTC_USDC";
    const command = "returnOpenOrders";
    const response: Orders = [
      {
        orderNumber: "514514894224",
        type: "sell",
        rate: "0.00001000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00100000",
        date: "2018-10-23 17:38:53",
        margin: 1
      },
      {
        orderNumber: "514515104014",
        type: "buy",
        rate: "0.00002000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00200000",
        date: "2018-10-23 17:39:46",
        margin: 1
      }
    ];

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, currencyPair })
      .reply(200, response);

    const data = await client.getOpenOrders({ currencyPair });
    assert.deepStrictEqual(data, response);
  });

  test(".getHistoryTrades()", async () => {
    const currencyPair = "all";
    const start = 1410158341;
    const end = 1410499372;
    const limit = 10;
    const command = "returnTradeHistory";
    const response: TradesPrivate = {
      BTC_BCH: [
        {
          globalTradeID: 394131412,
          tradeID: "5455033",
          date: "2018-10-16 18:05:17",
          rate: "0.06935244",
          amount: "1.40308443",
          total: "0.09730732",
          fee: "0.00100000",
          orderNumber: "104768235081",
          type: "sell",
          category: "exchange"
        },
        {
          globalTradeID: 394126818,
          tradeID: "5455007",
          date: "2018-10-16 16:55:34",
          rate: "0.06935244",
          amount: "0.00155709",
          total: "0.00010798",
          fee: "0.00200000",
          orderNumber: "104768179137",
          type: "sell",
          category: "exchange"
        }
      ],
      BTC_STR: [
        {
          globalTradeID: 394127362,
          tradeID: "13536351",
          date: "2018-10-16 17:03:43",
          rate: "0.00003432",
          amount: "3696.05342780",
          total: "0.12684855",
          fee: "0.00200000",
          orderNumber: "96238912841",
          type: "buy",
          category: "exchange"
        },
        {
          globalTradeID: 394127361,
          tradeID: "13536350",
          date: "2018-10-16 17:03:43",
          rate: "0.00003432",
          amount: "3600.53748129",
          total: "0.12357044",
          fee: "0.00200000",
          orderNumber: "96238912841",
          type: "buy",
          category: "exchange"
        }
      ]
    };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, currencyPair, start, end, limit })
      .reply(200, response);

    const data = await client.getHistoryTrades({
      currencyPair,
      start,
      end,
      limit
    });
    assert.deepStrictEqual(data, response);
  });

  test(".getOrderTrades()", async () => {
    const orderNumber = 9623891284;
    const command = "returnOrderTrades";
    const response: OrderTrade[] = [
      {
        globalTradeID: 394127362,
        tradeID: 13536351,
        currencyPair: "BTC_STR",
        type: "buy",
        rate: "0.00003432",
        amount: "3696.05342780",
        total: "0.12684855",
        fee: "0.00200000",
        date: "2018-10-16 17:03:43"
      },
      {
        globalTradeID: 394127361,
        tradeID: 13536350,
        currencyPair: "BTC_STR",
        type: "buy",
        rate: "0.00003432",
        amount: "3600.53748129",
        total: "0.12357044",
        fee: "0.00200000",
        date: "2018-10-16 17:03:43"
      }
    ];

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, orderNumber })
      .reply(200, response);

    const data = await client.getOrderTrades({ orderNumber });
    assert.deepStrictEqual(data, response);
  });

  test(".getOrderStatus()", async () => {
    const orderNumber = 96238912841;
    const command = "returnOrderStatus";
    const response: OrderStatus = {
      result: {
        "6071071": {
          status: "Open",
          rate: "0.40000000",
          amount: "1.00000000",
          currencyPair: "BTC_ETH",
          date: "2018-10-17 17:04:50",
          total: "0.40000000",
          type: "buy",
          startingAmount: "1.00000"
        }
      },
      success: 1
    };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, orderNumber })
      .reply(200, response);

    const data = await client.getOrderStatus({ orderNumber });
    assert.deepStrictEqual(data, response);
  });

  test(".buy()", async () => {
    const currencyPair = "BTC_ETH";
    const rate = 0.01;
    const amount = 1;
    const response: OrderResult = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "0.1",
          date: "2018-10-25 23:03:21",
          rate: "0.01",
          total: "0.001",
          tradeID: "251834",
          type: "buy"
        }
      ],
      fee: "0.01000000",
      currencyPair: "BTC_ETH"
    };
    const command = "buy";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, amount, rate, currencyPair })
      .reply(200, response);

    const data = await client.buy({ currencyPair, rate, amount });
    assert.deepStrictEqual(data, response);
  });

  test(".sell()", async () => {
    const currencyPair = "BTC_ETH";
    const rate = 0.01;
    const amount = 1;
    const clientOrderId = 12345;
    const postOnly: 0 | 1 = 1;
    const params = { currencyPair, rate, amount, clientOrderId, postOnly };
    const response: OrderResult = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "1.0",
          date: "2018-10-25 23:03:21",
          rate: "0.01",
          total: "0.0006",
          tradeID: "251834",
          type: "sell"
        }
      ],
      fee: "0.01000000",
      currencyPair: "BTC_ETH",
      clientOrderId: "12345"
    };
    const command = "sell";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, ...params })
      .reply(200, response);

    const data = await client.sell(params);
    assert.deepStrictEqual(data, response);
  });

  test(".cancelOrder()", async () => {
    const orderNumber = 96238912841;
    const command = "cancelOrder";
    const response: CancelResponse = {
      success: 1,
      amount: "1.00000000",
      message: "Order #96238912841 canceled.",
      fee: "0.00000000",
      currencyPair: "USDT_EOS"
    };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, orderNumber })
      .reply(200, response);

    const data = await client.cancelOrder({ orderNumber });
    assert.deepStrictEqual(data, response);
  });

  test(".cancelOrder() (by `clientOrderId`)", async () => {
    const clientOrderId = 12345;
    const command = "cancelOrder";
    const response: CancelResponse = {
      success: 1,
      amount: "1.00000000",
      message: "Order #96238912841 canceled.",
      fee: "0.00000000",
      currencyPair: "USDT_EOS",
      clientOrderId: "123456"
    };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, clientOrderId })
      .reply(200, response);

    const data = await client.cancelOrder({ clientOrderId });
    assert.deepStrictEqual(data, response);
  });

  test(".cancelAllOrders()", async () => {
    const currencyPair = "BTC_USDC";
    const command = "cancelAllOrders";
    const response: CancelAllResponse = {
      success: 1,
      message: "Orders canceled",
      orderNumbers: [503749, 888321, 7315825, 7316824]
    };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, currencyPair })
      .reply(200, response);

    const data = await client.cancelAllOrders({ currencyPair });
    assert.deepStrictEqual(data, response);
  });

  test(".moveOrder()", async () => {
    const orderNumber = 514851026755;
    const rate = 0.00015;
    const clientOrderId = 12345;
    const response: MoveResponse = {
      success: 1,
      orderNumber: "514851232549",
      resultingTrades: { BTC_ETH: [] },
      fee: "0.00150000",
      currencyPair: "BTC_ETH",
      clientOrderId: "12345"
    };
    const command = "moveOrder";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, orderNumber, rate, clientOrderId })
      .reply(200, response);

    const data = await client.moveOrder({ orderNumber, rate, clientOrderId });
    assert.deepStrictEqual(data, response);
  });

  test(".withdraw()", async () => {
    const response: WithdrawResponse = { response: "Withdrew 0.000152 ETH." };
    const currency = "ETH";
    const amount = 0.000152;
    const address = "0x84a90e21d9d02e30ddcea56d618aa75ba90331ff";
    const command = "withdraw";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, currency, amount, address })
      .reply(200, response);

    const data = await client.withdraw({ currency, amount, address });
    assert.deepStrictEqual(data, response);
  });

  test(".getFeeInfo()", async () => {
    const response: FeesInfo = {
      makerFee: "0.00000000",
      takerFee: "0.00000000",
      marginMakerFee: "0.00150000",
      marginTakerFee: "0.00250000",
      thirtyDayVolume: "0.00000000",
      nextTier: 25000
    };
    const command = "returnFeeInfo";
    nock(ApiUri)
      .post("/tradingApi", { command, nonce })
      .reply(200, response);

    const data = await client.getFeeInfo();
    assert.deepStrictEqual(data, response);
  });

  test(".getAccountBalances()", async () => {
    const balances: AccountBalances = {
      exchange: {
        BTC: "0.10000000",
        EOS: "5.18012931",
        ETC: "3.39980734",
        SC: "120.00000000",
        USDC: "23.79999938",
        ZEC: "0.02380926"
      },
      margin: { BTC: "0.50000000" },
      lending: {
        BTC: "0.14804126",
        ETH: "2.69148073",
        LTC: "1.75862721",
        XMR: "5.25780982"
      }
    };
    const command = "returnAvailableAccountBalances";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce })
      .reply(200, balances);

    const data = await client.getAccountBalances();
    assert.deepStrictEqual(data, balances);
  });

  test(".getTradableBalances()", async () => {
    const balances: TradableBalances = {
      BTC_BTS: { BTC: "1.25000000", BTS: "81930.25407233" },
      BTC_CLAM: { BTC: "1.25000000", CLAM: "4266.69596390" },
      BTC_DASH: { BTC: "1.25000000", DASH: "51.93926104" },
      BTC_DOGE: { BTC: "1.25000000", DOGE: "2155172.41379310" },
      BTC_LTC: { BTC: "1.25000000", LTC: "154.46087826" },
      BTC_MAID: { BTC: "1.25000000", MAID: "38236.28007965" },
      BTC_STR: { BTC: "1.25000000", STR: "34014.47559076" },
      BTC_XMR: { BTC: "1.25000000", XMR: "76.27023112" },
      BTC_XRP: { BTC: "1.25000000", XRP: "17385.96302541" },
      BTC_ETH: { BTC: "1.25000000", ETH: "39.96803109" },
      BTC_FCT: { BTC: "1.25000000", FCT: "1720.79314097" }
    };
    const command = "returnTradableBalances";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce })
      .reply(200, balances);

    const data = await client.getTradableBalances();
    assert.deepStrictEqual(data, balances);
  });

  test(".transferBalance()", async () => {
    const response: TransferResponse = {
      success: 1,
      message: "Transferred 0.50000000 BTC from lending to exchange account."
    };
    const command = "transferBalance";
    const currency = "BTC";
    const amount = 0.5;
    const fromAccount: "lending" = "lending";
    const toAccount: "exchange" = "exchange";
    const params = { currency, amount, fromAccount, toAccount };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, ...params })
      .reply(200, response);

    const data = await client.transferBalance(params);
    assert.deepStrictEqual(data, response);
  });

  test(".getMarginSummary()", async () => {
    const response: MarginSummary = {
      totalValue: "0.09999999",
      pl: "0.00000000",
      lendingFees: "0.00000000",
      netValue: "0.09999999",
      totalBorrowedValue: "0.02534580",
      currentMargin: "3.94542646"
    };
    const command = "returnMarginAccountSummary";

    nock(ApiUri)
      .post("/tradingApi", { command, nonce })
      .reply(200, response);

    const data = await client.getMarginSummary();
    assert.deepStrictEqual(data, response);
  });

  test(".marginBuy()", async () => {
    const currencyPair = "BTC_EOS";
    const clientOrderId = 123;
    const rate = 0.0035;
    const amount = 20;
    const response: MarginOrderResult = {
      orderNumber: "123321",
      resultingTrades: [],
      clientOrderId: "123",
      message: "Margin order placed.",
      fee: "0.00150000",
      currencyPair: "BTC_EOS"
    };
    const command = "marginBuy";
    const params = { currencyPair, rate, amount, clientOrderId };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, ...params })
      .reply(200, response);

    const data = await client.marginBuy(params);
    assert.deepStrictEqual(data, response);
  });

  test(".marginSell()", async () => {
    const currencyPair = "BTC_EOS";
    const clientOrderId = 123;
    const rate = 0.0035;
    const amount = 20;
    const lendingRate = 0.001;
    const response: MarginOrderResult = {
      orderNumber: "123321",
      resultingTrades: [],
      clientOrderId: "123",
      message: "Margin order placed.",
      fee: "0.00150000",
      currencyPair: "BTC_EOS"
    };
    const command = "marginSell";
    const params = { currencyPair, rate, amount, clientOrderId, lendingRate };

    nock(ApiUri)
      .post("/tradingApi", { command, nonce, ...params })
      .reply(200, response);

    const data = await client.marginSell(params);
    assert.deepStrictEqual(data, response);
  });
});
