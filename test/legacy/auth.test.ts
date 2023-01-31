import { deepStrictEqual, fail } from "node:assert";
import { isDeepStrictEqual } from "node:util";
import { MockAgent, getGlobalDispatcher, setGlobalDispatcher } from "undici";
import {
  AuthenticatedClient,
  DefaultPair,
  ApiUri,
  Balances,
  CompleteBalances,
  Adresses,
  NewAddress,
  DepositsWithdrawals,
  Orders,
  TradesPrivate,
  TransferOptions,
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
  MarginOrderResult,
  MarginPositionResult,
  ClosePositionResult,
  OfferResult,
  OfferOptions,
  CancelLoanResponse,
  LoanOffers,
  ActiveLoans,
  LendingHistoryItem,
  AutoRenewResult,
  SwapResult,
} from "../../src/legacy/index.js";

suite("AuthenticatedClient", () => {
  const api_url = new URL(ApiUri);
  const key = "poloniex-api-key";
  const secret = "poloniex-api-secret";
  const client = new AuthenticatedClient({ key, secret });
  const nonce = 1;
  client.nonce = (): number => nonce;

  const body =
    (form: Record<string, unknown>) =>
    (string: string): boolean =>
      isDeepStrictEqual(
        new URLSearchParams(string),
        new URLSearchParams({ ...form, nonce: `${nonce}` })
      );

  const globalDispatcher = getGlobalDispatcher();
  const mockAgent = new MockAgent();
  const mockPool = mockAgent.get(api_url.origin);

  suiteSetup(() => {
    setGlobalDispatcher(mockAgent);
    mockAgent.disableNetConnect();
  });

  suiteTeardown(() => {
    mockAgent.enableNetConnect();
    setGlobalDispatcher(globalDispatcher);
  });

  test("constructor (default `currencyPair`)", () => {
    deepStrictEqual(client.currencyPair, DefaultPair);
  });

  test("constructor", () => {
    const currencyPair = "BTC_ETH";
    const otherClient = new AuthenticatedClient({
      currencyPair,
      key,
      secret,
    });
    deepStrictEqual(otherClient.currencyPair, currencyPair);
  });

  test(".post()", async () => {
    const response = { success: 1 };
    const path = "/";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST" })
      .reply(200, response);

    const data = await client.post();
    deepStrictEqual(data, response);
  });

  test(".post() (with error in the response)", async () => {
    const error = "Some error message";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnBalances" };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, { error });

    try {
      await client.post("/tradingApi", { body: new URLSearchParams(form) });
      fail("Should throw an error");
    } catch (err) {
      deepStrictEqual(err, new Error(error));
    }
  });

  test(".post() (with no success in the response)", async () => {
    const success = 0;
    const result = { error: "Some error message" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnBalances" };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, { success, result });

    try {
      await client.post("/tradingApi", { body: new URLSearchParams(form) });
      fail("Should throw an error");
    } catch (err) {
      deepStrictEqual(err, new Error(result.error));
    }
  });

  test(".post() (with no success in the response and no result)", async () => {
    const success = false;
    const message = "Some message";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnBalances" };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(404, { success, message });

    try {
      await client.post("/tradingApi", { body: new URLSearchParams(form) });
      fail("Should throw an error");
    } catch (err) {
      deepStrictEqual(err, new Error(message));
    }
  });

  test(".getBalances()", async () => {
    const balances: Balances = {
      BTC: "1.23456789",
      DASH: "0.00000000",
    };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnBalances" };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, balances);

    const data = await client.getBalances();
    deepStrictEqual(data, balances);
  });

  test(".getCompleteBalances()", async () => {
    const balances: CompleteBalances = {
      BTC: {
        available: "0.00000000",
        onOrders: "0.00000000",
        btcValue: "0.00000000",
      },
      USDT: {
        available: "0.00000000",
        onOrders: "0.00000000",
        btcValue: "0.00000000",
      },
    };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const account = "all";
    const form = { command: "returnCompleteBalances", account };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, balances);

    const data = await client.getCompleteBalances({ account });
    deepStrictEqual(data, balances);
  });

  test(".getCompleteBalances() (with no arguments)", async () => {
    const balances: CompleteBalances = {
      BTC: {
        available: "0.00000000",
        onOrders: "0.00000000",
        btcValue: "0.00000000",
      },
      USDT: {
        available: "0.00000000",
        onOrders: "0.00000000",
        btcValue: "0.00000000",
      },
    };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnCompleteBalances" };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, balances);

    const data = await client.getCompleteBalances();
    deepStrictEqual(data, balances);
  });

  test(".getDepositAddresses()", async () => {
    const addresses: Adresses = {
      BTC: "12ov76RsWq5PS8mUxpzGiA7aU2NSJ4WQJV",
      USDC: "0x2a3279534a8fc3aab174628d5df28253bde6a95e",
      USDT: "1HDr6rDk4n8kzgbon4rXs1qtBtC9XUNAZ5",
    };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnDepositAddresses" };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, addresses);

    const data = await client.getDepositAddresses();
    deepStrictEqual(data, addresses);
  });

  test(".getNewAddress()", async () => {
    const address: NewAddress = {
      success: 1,
      response: "0x2a3279534a8fc3aab174628d5df28253bde6a95e",
    };
    const currency = "ETH";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "generateNewAddress", currency };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, address);

    const data = await client.getNewAddress({ currency });
    deepStrictEqual(data, address);
  });

  test(".getDepositsWithdrawals()", async () => {
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
            "https://poloniex.freshdesk.com/support/solutions/articles/1000278072-stellar-inflation-what-is-it-and-other-frequently-asked-questions",
        },
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
          txid: "b05bdec7430a56b5a5ed34af4a31a54859dda9b7c88a5586bc5d6540cdfbfc7a",
        },
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
          paymentID: null,
        },
      ],
    };
    const start = 1529425667;
    const end = 1560961667;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnDepositsWithdrawals", start, end };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getDepositsWithdrawals({ start, end });
    deepStrictEqual(data, response);
  });

  test(".getOpenOrders()", async () => {
    const response: Orders = [
      {
        orderNumber: "514514894224",
        type: "sell",
        rate: "0.00001000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00100000",
        date: "2018-10-23 17:38:53",
        margin: 1,
      },
      {
        orderNumber: "514515104014",
        type: "buy",
        rate: "0.00002000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00200000",
        date: "2018-10-23 17:39:46",
        margin: 1,
      },
    ];
    const currencyPair = "BTC_USDC";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnOpenOrders", currencyPair };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getOpenOrders({ currencyPair });
    deepStrictEqual(data, response);
  });

  test(".getOpenOrders() (with no `currencyPair`)", async () => {
    const response: Orders = [
      {
        orderNumber: "514514894224",
        type: "sell",
        rate: "0.00001000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00100000",
        date: "2018-10-23 17:38:53",
        margin: 1,
      },
      {
        orderNumber: "514515104014",
        type: "buy",
        rate: "0.00002000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00200000",
        date: "2018-10-23 17:39:46",
        margin: 1,
      },
    ];
    const currencyPair = DefaultPair;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnOpenOrders", currencyPair };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getOpenOrders({});
    deepStrictEqual(data, response);
  });

  test(".getOpenOrders() (with no arguments)", async () => {
    const response: Orders = [
      {
        orderNumber: "514514894224",
        type: "sell",
        rate: "0.00001000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00100000",
        date: "2018-10-23 17:38:53",
        margin: 1,
      },
      {
        orderNumber: "514515104014",
        type: "buy",
        rate: "0.00002000",
        startingAmount: "100.00000000",
        amount: "100.00000000",
        total: "0.00200000",
        date: "2018-10-23 17:39:46",
        margin: 1,
      },
    ];
    const currencyPair = DefaultPair;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command: "returnOpenOrders", currencyPair };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getOpenOrders();
    deepStrictEqual(data, response);
  });

  test(".getHistoryTrades()", async () => {
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
          category: "exchange",
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
          category: "exchange",
        },
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
          category: "exchange",
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
          category: "exchange",
        },
      ],
    };
    const command = "returnTradeHistory";
    const start = 1410158341;
    const end = 1410499372;
    const limit = 10;
    const currencyPair = "all";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, currencyPair, start, end, limit };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getHistoryTrades({
      currencyPair,
      start,
      end,
      limit,
    });
    deepStrictEqual(data, response);
  });

  test(".getHistoryTrades() (with no `currencyPair`)", async () => {
    const response: TradesPrivate = [
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
        category: "exchange",
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
        category: "exchange",
      },
    ];
    const command = "returnTradeHistory";
    const start = 1410158341;
    const end = 1410499372;
    const limit = 10;
    const currencyPair = DefaultPair;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, currencyPair, start, end, limit };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getHistoryTrades({ start, end, limit });
    deepStrictEqual(data, response);
  });

  test(".getHistoryTrades() (with no arguments)", async () => {
    const response: TradesPrivate = [
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
        category: "exchange",
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
        category: "exchange",
      },
    ];
    const command = "returnTradeHistory";
    const currencyPair = DefaultPair;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, currencyPair };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getHistoryTrades();
    deepStrictEqual(data, response);
  });

  test(".getOrderTrades()", async () => {
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
        date: "2018-10-16 17:03:43",
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
        date: "2018-10-16 17:03:43",
      },
    ];
    const command = "returnOrderTrades";
    const orderNumber = 9623891284;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, orderNumber };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getOrderTrades({ orderNumber });
    deepStrictEqual(data, response);
  });

  test(".getOrderStatus()", async () => {
    const response: OrderStatus = {
      result: {
        6071071: {
          status: "Open",
          rate: "0.40000000",
          amount: "1.00000000",
          currencyPair: "BTC_ETH",
          date: "2018-10-17 17:04:50",
          total: "0.40000000",
          type: "buy",
          startingAmount: "1.00000",
        },
      },
      success: 1,
    };
    const command = "returnOrderStatus";
    const orderNumber = 96238912841;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, orderNumber };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getOrderStatus({ orderNumber });
    deepStrictEqual(data, response);
  });

  test(".buy()", async () => {
    const response: OrderResult = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "0.1",
          date: "2018-10-25 23:03:21",
          rate: "0.01",
          total: "0.001",
          tradeID: "251834",
          type: "buy",
        },
      ],
      fee: "0.01000000",
      tokenFee: 0,
      tokenFeeCurrency: null,
      currencyPair: "BTC_ETH",
    };
    const currencyPair = "BTC_ETH";
    const rate = 0.01;
    const amount = 1;
    const command = "buy";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, currencyPair, rate, amount };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.buy({ currencyPair, rate, amount });
    deepStrictEqual(data, response);
  });

  test(".buy() (with no `currencyPair`)", async () => {
    const currencyPair = DefaultPair;
    const response: OrderResult = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "0.1",
          date: "2018-10-25 23:03:21",
          rate: "0.01",
          total: "0.001",
          tradeID: "251834",
          type: "buy",
        },
      ],
      fee: "0.01000000",
      tokenFee: 0,
      tokenFeeCurrency: null,
      currencyPair,
    };
    const rate = 0.01;
    const amount = 1;
    const command = "buy";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, currencyPair, rate, amount };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.buy({ rate, amount });
    deepStrictEqual(data, response);
  });

  test(".sell()", async () => {
    const response: OrderResult = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "1.0",
          date: "2018-10-25 23:03:21",
          rate: "0.01",
          total: "0.0006",
          tradeID: "251834",
          type: "sell",
        },
      ],
      fee: "0.01000000",
      currencyPair: "BTC_ETH",
      clientOrderId: "12345",
      tokenFee: 0,
      tokenFeeCurrency: null,
    };
    const currencyPair = "BTC_ETH";
    const rate = 0.01;
    const amount = 1;
    const clientOrderId = 12345;
    const postOnly: 0 | 1 = 1;
    const command = "sell";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const params = { currencyPair, rate, amount, clientOrderId, postOnly };
    const form = { command, ...params };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.sell(params);
    deepStrictEqual(data, response);
  });

  test(".sell() (with no `currencyPair`)", async () => {
    const currencyPair = DefaultPair;
    const response: OrderResult = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "1.0",
          date: "2018-10-25 23:03:21",
          rate: "0.01",
          total: "0.0006",
          tradeID: "251834",
          type: "sell",
        },
      ],
      fee: "0.01000000",
      currencyPair,
      tokenFee: 0,
      tokenFeeCurrency: null,
      clientOrderId: "12345",
    };
    const rate = 0.01;
    const amount = 1;
    const clientOrderId = 12345;
    const postOnly: 0 | 1 = 1;
    const command = "sell";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const params = { rate, amount, clientOrderId, postOnly };
    const form = { command, currencyPair, ...params };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.sell(params);
    deepStrictEqual(data, response);
  });

  test(".cancelOrder()", async () => {
    const response: CancelResponse = {
      success: 1,
      amount: "1.00000000",
      message: "Order #96238912841 canceled.",
      fee: "0.00000000",
      currencyPair: "USDT_EOS",
    };
    const command = "cancelOrder";
    const orderNumber = 96238912841;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, orderNumber };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.cancelOrder({ orderNumber });
    deepStrictEqual(data, response);
  });

  test(".cancelOrder() (by `clientOrderId`)", async () => {
    const response: CancelResponse = {
      success: 1,
      amount: "1.00000000",
      message: "Order #96238912841 canceled.",
      fee: "0.00000000",
      currencyPair: "USDT_EOS",
      clientOrderId: "123456",
    };
    const command = "cancelOrder";
    const clientOrderId = 12345;
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, clientOrderId };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.cancelOrder({ clientOrderId });
    deepStrictEqual(data, response);
  });

  test(".cancelAllOrders()", async () => {
    const response: CancelAllResponse = {
      success: 1,
      message: "Orders canceled",
      orderNumbers: [503749, 888321, 7315825, 7316824],
    };
    const command = "cancelAllOrders";
    const currencyPair = "BTC_USDC";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command, currencyPair };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.cancelAllOrders({ currencyPair });
    deepStrictEqual(data, response);
  });

  test(".cancelAllOrders() (with no arguments)", async () => {
    const response: CancelAllResponse = {
      success: 1,
      message: "Orders canceled",
      orderNumbers: [503749, 888321, 7315825, 7316824],
    };
    const command = "cancelAllOrders";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    const form = { command };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.cancelAllOrders();
    deepStrictEqual(data, response);
  });

  test(".moveOrder()", async () => {
    const response: MoveResponse = {
      success: 1,
      orderNumber: "514851232549",
      resultingTrades: { BTC_ETH: [] },
      fee: "0.00150000",
      currencyPair: "BTC_ETH",
      clientOrderId: "12345",
    };
    const orderNumber = 514851026755;
    const rate = 0.00015;
    // eslint-disable-next-line init-declarations
    let clientOrderId: undefined;
    const params = { orderNumber, rate, clientOrderId };
    const command = "moveOrder";
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clientOrderId: _clientOrderId, ...form } = { command, ...params };
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.moveOrder(params);
    deepStrictEqual(data, response);
  });

  test(".withdraw()", async () => {
    const response: WithdrawResponse = { response: "Withdrew 0.000152 ETH." };
    const currency = "ETH";
    const amount = 0.000152;
    const address = "0x84a90e21d9d02e30ddcea56d618aa75ba90331ff";
    const params = { currency, amount, address };
    const form = { command: "withdraw", ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.withdraw(params);
    deepStrictEqual(data, response);
  });

  test(".getFeeInfo()", async () => {
    const response: FeesInfo = {
      makerFee: "0.00000000",
      takerFee: "0.00000000",
      marginMakerFee: "0.00150000",
      marginTakerFee: "0.00250000",
      thirtyDayVolume: "0.00000000",
      nextTier: 25000,
    };
    const form = { command: "returnFeeInfo" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getFeeInfo();
    deepStrictEqual(data, response);
  });

  test(".getAccountBalances()", async () => {
    const balances: AccountBalances = {
      exchange: {
        BTC: "0.10000000",
        EOS: "5.18012931",
        ETC: "3.39980734",
        SC: "120.00000000",
        USDC: "23.79999938",
        ZEC: "0.02380926",
      },
      margin: { BTC: "0.50000000" },
      lending: {
        BTC: "0.14804126",
        ETH: "2.69148073",
        LTC: "1.75862721",
        XMR: "5.25780982",
      },
    };
    const form = { command: "returnAvailableAccountBalances" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, balances);

    const data = await client.getAccountBalances();
    deepStrictEqual(data, balances);
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
      BTC_FCT: { BTC: "1.25000000", FCT: "1720.79314097" },
    };
    const form = { command: "returnTradableBalances" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, balances);

    const data = await client.getTradableBalances();
    deepStrictEqual(data, balances);
  });

  test(".transferBalance()", async () => {
    const response: TransferResponse = {
      success: 1,
      message: "Transferred 0.50000000 BTC from lending to exchange account.",
    };
    const currency = "BTC";
    const amount = 0.5;
    const fromAccount = "lending";
    const toAccount = "exchange";
    const params: TransferOptions = {
      currency,
      amount,
      fromAccount,
      toAccount,
    };
    const form = { command: "transferBalance", ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.transferBalance(params);
    deepStrictEqual(data, response);
  });

  test(".getMarginSummary()", async () => {
    const response: MarginSummary = {
      totalValue: "0.09999999",
      pl: "0.00000000",
      lendingFees: "0.00000000",
      netValue: "0.09999999",
      totalBorrowedValue: "0.02534580",
      currentMargin: "3.94542646",
    };
    const form = { command: "returnMarginAccountSummary" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getMarginSummary();
    deepStrictEqual(data, response);
  });

  test(".marginBuy()", async () => {
    const response: MarginOrderResult = {
      orderNumber: "123321",
      resultingTrades: [],
      clientOrderId: "123",
      message: "Margin order placed.",
      fee: "0.00150000",
      tokenFee: 0,
      tokenFeeCurrency: null,
      currencyPair: "BTC_EOS",
    };
    const currencyPair = "BTC_EOS";
    const rate = 0.0035;
    const amount = 20;
    const clientOrderId = 123;
    const params = { currencyPair, rate, amount, clientOrderId };
    const form = { command: "marginBuy", ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.marginBuy(params);
    deepStrictEqual(data, response);
  });

  test(".marginBuy() (with no `currencyPair`)", async () => {
    const currencyPair = DefaultPair;
    const response: MarginOrderResult = {
      orderNumber: "123321",
      resultingTrades: [],
      clientOrderId: "123",
      message: "Margin order placed.",
      fee: "0.00150000",
      tokenFee: 0,
      tokenFeeCurrency: null,
      currencyPair,
    };
    const rate = 0.0035;
    const amount = 20;
    const clientOrderId = 123;
    const params = { rate, amount, clientOrderId };
    const form = { command: "marginBuy", currencyPair, ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.marginBuy(params);
    deepStrictEqual(data, response);
  });

  test(".marginSell()", async () => {
    const response: MarginOrderResult = {
      orderNumber: "123321",
      resultingTrades: [],
      clientOrderId: "123",
      message: "Margin order placed.",
      fee: "0.00150000",
      tokenFee: 0,
      tokenFeeCurrency: null,
      currencyPair: "BTC_EOS",
    };
    const currencyPair = "BTC_EOS";
    const rate = 0.0035;
    const amount = 20;
    const clientOrderId = 123;
    const lendingRate = 0.001;
    const params = { currencyPair, rate, amount, clientOrderId, lendingRate };
    const form = { command: "marginSell", ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.marginSell(params);
    deepStrictEqual(data, response);
  });

  test(".marginSell() (with no `currencyPair`)", async () => {
    const currencyPair = DefaultPair;
    const response: MarginOrderResult = {
      orderNumber: "123321",
      resultingTrades: [],
      clientOrderId: "123",
      message: "Margin order placed.",
      fee: "0.00150000",
      tokenFee: 0,
      tokenFeeCurrency: null,
      currencyPair,
    };
    const rate = 0.0035;
    const amount = 20;
    const clientOrderId = 123;
    const lendingRate = 0.001;
    const params = { rate, amount, clientOrderId, lendingRate };
    const form = { command: "marginSell", currencyPair, ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.marginSell(params);
    deepStrictEqual(data, response);
  });

  test(".getMarginPosition()", async () => {
    const response: MarginPositionResult = {
      amount: "40.94717831",
      total: "-0.09671314",
      basePrice: "0.00236190",
      liquidationPrice: -1,
      pl: "-0.00058655",
      lendingFees: "-0.00000038",
      type: "long",
    };
    const currencyPair = "USDT_BTC";
    const form = { command: "getMarginPosition", currencyPair };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getMarginPosition({ currencyPair });
    deepStrictEqual(data, response);
  });

  test(".getMarginPosition() (with no `currencyPair`)", async () => {
    const response: MarginPositionResult = {
      amount: "40.94717831",
      total: "-0.09671314",
      basePrice: "0.00236190",
      liquidationPrice: -1,
      pl: "-0.00058655",
      lendingFees: "-0.00000038",
      type: "long",
    };
    const currencyPair = DefaultPair;
    const form = { command: "getMarginPosition", currencyPair };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getMarginPosition({});
    deepStrictEqual(data, response);
  });

  test(".getMarginPosition() (with no arguments)", async () => {
    const response: MarginPositionResult = {
      amount: "40.94717831",
      total: "-0.09671314",
      basePrice: "0.00236190",
      liquidationPrice: -1,
      pl: "-0.00058655",
      lendingFees: "-0.00000038",
      type: "long",
    };
    const currencyPair = DefaultPair;
    const form = { command: "getMarginPosition", currencyPair };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getMarginPosition();
    deepStrictEqual(data, response);
  });

  test(".closeMarginPosition()", async () => {
    const response: ClosePositionResult = {
      success: 1,
      message: "Successfully closed margin position.",
      resultingTrades: {
        BTC_XMR: [
          {
            amount: "7.09215901",
            date: "2015-05-10 22:38:49",
            rate: "0.00235337",
            total: "0.01669047",
            tradeID: "1213346",
            type: "sell",
          },
          {
            amount: "24.00289920",
            date: "2015-05-10 22:38:49",
            rate: "0.00235321",
            total: "0.05648386",
            tradeID: "1213347",
            type: "sell",
          },
        ],
      },
    };
    const currencyPair = "USDT_BTC";
    const form = { command: "closeMarginPosition", currencyPair };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.closeMarginPosition({ currencyPair });
    deepStrictEqual(data, response);
  });

  test(".closeMarginPosition() (with no `currencyPair`)", async () => {
    const response: ClosePositionResult = {
      success: 1,
      message: "Successfully closed margin position.",
      resultingTrades: {
        BTC_XMR: [
          {
            amount: "7.09215901",
            date: "2015-05-10 22:38:49",
            rate: "0.00235337",
            total: "0.01669047",
            tradeID: "1213346",
            type: "sell",
          },
          {
            amount: "24.00289920",
            date: "2015-05-10 22:38:49",
            rate: "0.00235321",
            total: "0.05648386",
            tradeID: "1213347",
            type: "sell",
          },
        ],
      },
    };
    const currencyPair = DefaultPair;
    const form = { command: "closeMarginPosition", currencyPair };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.closeMarginPosition({});
    deepStrictEqual(data, response);
  });

  test(".closeMarginPosition() (with no arguments)", async () => {
    const response: ClosePositionResult = {
      success: 1,
      message: "Successfully closed margin position.",
      resultingTrades: {
        BTC_XMR: [
          {
            amount: "7.09215901",
            date: "2015-05-10 22:38:49",
            rate: "0.00235337",
            total: "0.01669047",
            tradeID: "1213346",
            type: "sell",
          },
          {
            amount: "24.00289920",
            date: "2015-05-10 22:38:49",
            rate: "0.00235321",
            total: "0.05648386",
            tradeID: "1213347",
            type: "sell",
          },
        ],
      },
    };
    const currencyPair = DefaultPair;
    const form = { command: "closeMarginPosition", currencyPair };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.closeMarginPosition();
    deepStrictEqual(data, response);
  });

  test(".createLoanOffer()", async () => {
    const response: OfferResult = {
      success: 1,
      message: "Loan order placed.",
      orderID: 1002013188,
    };
    const amount = 0.1;
    const currency = "BTC";
    const duration = 2;
    const autoRenew = 0;
    const lendingRate = 0.015;
    const params: OfferOptions = {
      amount,
      currency,
      duration,
      autoRenew,
      lendingRate,
    };
    const form = { command: "createLoanOffer", ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.createLoanOffer(params);
    deepStrictEqual(data, response);
  });

  test(".cancelLoanOffer()", async () => {
    const response: CancelLoanResponse = {
      success: 1,
      message: "Loan offer canceled.",
      amount: "0.10000000",
    };
    const orderNumber = 1002013188;
    const form = { command: "cancelLoanOffer", orderNumber };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.cancelLoanOffer({ orderNumber });
    deepStrictEqual(data, response);
  });

  test(".getOpenLoanOffers()", async () => {
    const response: LoanOffers = {
      BTC: [
        {
          id: 1002015083,
          rate: "0.01500000",
          amount: "0.10000000",
          duration: 2,
          autoRenew: 0,
          date: "2018-10-26 20:26:46",
        },
      ],
    };
    const form = { command: "returnOpenLoanOffers" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getOpenLoanOffers();
    deepStrictEqual(data, response);
  });

  test(".getActiveLoans()", async () => {
    const response: ActiveLoans = {
      provided: [
        {
          id: 75073,
          currency: "LTC",
          rate: "0.00020000",
          amount: "0.72234880",
          range: 2,
          autoRenew: 0,
          date: "2018-05-10 23:45:05",
          fees: "0.00006000",
        },
        {
          id: 74961,
          currency: "LTC",
          rate: "0.00002000",
          amount: "4.43860711",
          range: 2,
          autoRenew: 0,
          date: "2018-05-10 23:45:05",
          fees: "0.00006000",
        },
      ],
      used: [
        {
          id: 75238,
          currency: "BTC",
          rate: "0.00020000",
          amount: "0.04843834",
          range: 2,
          date: "2018-05-10 23:51:12",
          fees: "-0.00000001",
        },
      ],
    };
    const form = { command: "returnActiveLoans" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getActiveLoans();
    deepStrictEqual(data, response);
  });

  test(".getLendingHistory()", async () => {
    const response: LendingHistoryItem[] = [
      {
        id: 246300115,
        currency: "BTC",
        rate: "0.00013890",
        amount: "0.33714830",
        duration: "0.00090000",
        interest: "0.00000005",
        fee: "0.00000000",
        earned: "0.00000005",
        open: "2017-01-01 23:41:37",
        close: "2017-01-01 23:42:51",
      },
      {
        id: 246294775,
        currency: "BTC",
        rate: "0.00013890",
        amount: "0.03764586",
        duration: "0.00150000",
        interest: "0.00000001",
        fee: "0.00000000",
        earned: "0.00000001",
        open: "2017-01-01 23:36:32",
        close: "2017-01-01 23:38:45",
      },
    ];
    const start = 1483228800;
    const end = 1483315200;
    const limit = 100;
    const params = { start, end, limit };
    const form = { command: "returnLendingHistory", ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getLendingHistory(params);
    deepStrictEqual(data, response);
  });

  test(".getLendingHistory() (with no arguments)", async () => {
    const response: LendingHistoryItem[] = [
      {
        id: 246300115,
        currency: "BTC",
        rate: "0.00013890",
        amount: "0.33714830",
        duration: "0.00090000",
        interest: "0.00000005",
        fee: "0.00000000",
        earned: "0.00000005",
        open: "2017-01-01 23:41:37",
        close: "2017-01-01 23:42:51",
      },
      {
        id: 246294775,
        currency: "BTC",
        rate: "0.00013890",
        amount: "0.03764586",
        duration: "0.00150000",
        interest: "0.00000001",
        fee: "0.00000000",
        earned: "0.00000001",
        open: "2017-01-01 23:36:32",
        close: "2017-01-01 23:38:45",
      },
    ];
    const form = { command: "returnLendingHistory" };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.getLendingHistory();
    deepStrictEqual(data, response);
  });

  test(".toggleAutoRenew()", async () => {
    const response: AutoRenewResult = { success: 1, message: 0 };
    const orderNumber = 1002013188;
    const form = { command: "toggleAutoRenew", orderNumber };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.toggleAutoRenew({ orderNumber });
    deepStrictEqual(data, response);
  });

  test(".swapCurrencies()", async () => {
    const response: SwapResult = {
      success: true,
      message: "Swap 24.998 from BTC to WBTC.",
    };
    const fromCurrency = "BTC";
    const toCurrency = "WBTC";
    const amount = 25;
    const params = { fromCurrency, toCurrency, amount };
    const form = { command: "swapCurrencies", ...params };
    const path = "/tradingApi";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "POST", body: body(form) })
      .reply(200, response);

    const data = await client.swapCurrencies(params);
    deepStrictEqual(data, response);
  });

  test(".nonce()", () => {
    const otherClient = new AuthenticatedClient({ key, secret });
    const otherNonce = otherClient.nonce();
    deepStrictEqual(typeof otherNonce, "number");
  });
});
