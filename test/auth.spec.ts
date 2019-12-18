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
  CancelAllResponse
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
    const postOnly = 1;
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
      .post("/tradingApi", {
        command,
        nonce,
        amount,
        rate,
        currencyPair,
        clientOrderId,
        postOnly
      })
      .reply(200, response);

    const data = await client.sell({
      currencyPair,
      rate,
      amount,
      clientOrderId,
      postOnly
    });
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
});
