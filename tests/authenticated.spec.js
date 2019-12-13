const assert = require("assert");
const nock = require("nock");

const Poloniex = require("../index.js");
const { EXCHANGE_API_URL } = require("../lib/utilities");

const key = "poloniex-api-key";
const secret = "poloniex-api-secret";

const authClient = new Poloniex.AuthenticatedClient({ key, secret });

suite("AuthenticatedClient", () => {
  test(".getNewAddress()", done => {
    const currency = "ETH";
    const address = {
      success: 1,
      response: "0xa6f0dacc33c7f63e137e0106ed71cc20b4b931af"
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "generateNewAddress",
        nonce,
        currency
      })
      .times(1)
      .reply(200, address);

    authClient
      .getNewAddress({ currency })
      .then(data => {
        assert.deepStrictEqual(data, address);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getDepositsWithdrawals()", done => {
    const options = { start: 1529425667, end: 1560961667 };
    const deposits_withdrawals = {
      adjustments: [],
      deposits: [],
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
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "returnDepositsWithdrawals",
        nonce,
        start: options.start,
        end: options.end
      })
      .times(1)
      .reply(200, deposits_withdrawals);

    authClient
      .getDepositsWithdrawals(options)
      .then(data => {
        assert.deepStrictEqual(data, deposits_withdrawals);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getOpenOrders()", done => {
    const orders = [];
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "returnOpenOrders",
        currencyPair: "all",
        nonce
      })
      .times(1)
      .reply(200, orders);

    authClient
      .getOpenOrders()
      .then(data => {
        assert.deepStrictEqual(data, orders);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getHistoryTrades()", done => {
    const trades = [
      {
        globalTradeID: 394700861,
        tradeID: 45210354,
        date: "2018-10-23 18:01:58",
        type: "buy",
        rate: "0.03117266",
        amount: "0.00000652",
        total: "0.00000020",
        orderNumber: "104768235093"
      }
    ];
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "returnTradeHistory",
        currencyPair: "all",
        nonce
      })
      .times(1)
      .reply(200, trades);

    authClient
      .getHistoryTrades()
      .then(data => {
        assert.deepStrictEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getOrderTrades()", done => {
    const trades = [
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
    const orderNumber = 9623891284;
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnOrderTrades", orderNumber, nonce })
      .times(1)
      .reply(200, trades);

    authClient
      .getOrderTrades({ orderNumber })
      .then(data => {
        assert.deepStrictEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getOrderStatus()", done => {
    const response = {
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
    const orderNumber = 96238912841;
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnOrderStatus", orderNumber, nonce })
      .times(1)
      .reply(200, response);

    authClient
      .getOrderStatus({ orderNumber })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".buy()", done => {
    const currencyPair = "BTC_ETH";
    const rate = 0.01;
    const amount = 1;
    const response = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "3.0",
          date: "2018-10-25 23:03:21",
          rate: "0.0002",
          total: "0.0006",
          tradeID: "251834",
          type: "buy"
        }
      ],
      fee: "0.01000000",
      currencyPair: "BTC_ETH"
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "buy",
        currencyPair,
        rate,
        amount,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .buy({ currencyPair, rate, amount })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".buy(with default currencyPair)", done => {
    const currencyPair = "BTC_ETH";
    const client = new Poloniex.AuthenticatedClient({
      key,
      secret,
      currencyPair
    });

    const rate = 0.01;
    const amount = 1;
    const response = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "3.0",
          date: "2018-10-25 23:03:21",
          rate: "0.0002",
          total: "0.0006",
          tradeID: "251834",
          type: "buy"
        }
      ],
      fee: "0.01000000",
      currencyPair: "BTC_ETH"
    };
    const nonce = 154264078495300;
    client.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "buy",
        currencyPair,
        rate,
        amount,
        nonce
      })
      .times(1)
      .reply(200, response);

    client
      .buy({ rate, amount })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".sell()", done => {
    const currencyPair = "BTC_ETH";
    const rate = 10;
    const amount = 1;
    const response = {
      orderNumber: "514845991926",
      resultingTrades: [
        {
          amount: "1.0",
          date: "2018-10-25 23:03:21",
          rate: "10.0",
          total: "10.0",
          tradeID: "251869",
          type: "sell"
        }
      ],
      fee: "0.01000000",
      currencyPair: "BTC_ETH"
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "sell",
        currencyPair,
        rate,
        amount,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .sell({ currencyPair, rate, amount })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".sell() (with `clientOrderId`)", done => {
    const currencyPair = "BTC_ETH";
    const rate = 10;
    const amount = 1;
    const clientOrderId = 12345;
    const response = {
      orderNumber: "514845991926",
      resultingTrades: [
        {
          amount: "1.0",
          date: "2018-10-25 23:03:21",
          rate: "10.0",
          total: "10.0",
          tradeID: "251869",
          type: "sell"
        }
      ],
      fee: "0.01000000",
      clientOrderId: "12345",
      currencyPair: "BTC_ETH"
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "sell",
        currencyPair,
        rate,
        amount,
        clientOrderId,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .sell({ currencyPair, rate, amount, clientOrderId })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".cancelOrder()", done => {
    const result = {
      success: 1,
      amount: "50.00000000",
      message: "Order #514845991795 canceled."
    };
    const orderNumber = 514845991795;
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "cancelOrder", orderNumber, nonce })
      .times(1)
      .reply(200, result);

    authClient
      .cancelOrder({ orderNumber })
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".cancelAllOrders()", done => {
    const result = {
      success: 1,
      message: "Orders canceled",
      orderNumbers: [503749, 888321, 7315825, 7316824]
    };
    const nonce = 1559587794133;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "cancelAllOrders", nonce })
      .times(1)
      .reply(200, result);

    authClient
      .cancelAllOrders()
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".moveOrder()", done => {
    const result = {
      success: 1,
      orderNumber: "514851232549",
      resultingTrades: { BTC_ETH: [] }
    };
    const orderNumber = 514851026755;
    const rate = 0.00015;
    const nonce = 1559587794133;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "moveOrder", nonce, rate, orderNumber })
      .times(1)
      .reply(200, result);

    authClient
      .moveOrder({ orderNumber, rate })
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".moveOrder() (with `clientOrderId`)", done => {
    const result = {
      success: 1,
      orderNumber: "514851232549",
      resultingTrades: { BTC_ETH: [] },
      fee: "0.00150000",
      currencyPair: "BTC_ETH",
      clientOrderId: "12345"
    };
    const orderNumber = 514851026755;
    const rate = 0.00015;
    const nonce = 1559587794133;
    const clientOrderId = 12345;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "moveOrder",
        nonce,
        rate,
        orderNumber,
        clientOrderId
      })
      .times(1)
      .reply(200, result);

    authClient
      .moveOrder({ orderNumber, rate, clientOrderId })
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".withdraw()", done => {
    const result = { response: "Withdrew 2.0 ETH." };
    const currency = "ETH";
    const amount = 0.000152;
    const address = "0x84a90e21d9d02e30ddcea56d618aa75ba90331ff";
    const nonce = 1559587794133;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "withdraw",
        nonce,
        currency,
        amount,
        address
      })
      .times(1)
      .reply(200, result);

    authClient
      .withdraw({ currency, amount, address })
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getFeeInfo()", done => {
    const result = {
      makerFee: "0.00100000",
      takerFee: "0.00200000",
      thirtyDayVolume: "106.08463302",
      nextTier: 500000
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnFeeInfo", nonce })
      .times(1)
      .reply(200, result);

    authClient
      .getFeeInfo()
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getAvailableAccountBalances()", done => {
    const result = {
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
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnAvailableAccountBalances", nonce })
      .times(1)
      .reply(200, result);

    authClient
      .getAvailableAccountBalances()
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getTradableBalances()", done => {
    const result = {
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
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnTradableBalances", nonce })
      .times(1)
      .reply(200, result);

    authClient
      .getTradableBalances()
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".transferBalance()", done => {
    const result = {
      success: 1,
      message: "Transferred 0.50000000 BTC from lending to exchange account."
    };
    const currency = "BTC";
    const amount = 0.5;
    const fromAccount = "lending";
    const toAccount = "exchange";
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "transferBalance",
        currency,
        amount,
        fromAccount,
        toAccount,
        nonce
      })
      .times(1)
      .reply(200, result);

    authClient
      .transferBalance({ currency, amount, fromAccount, toAccount })
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getMarginAccountSummary()", done => {
    const result = {
      totalValue: "0.09999999",
      pl: "0.00000000",
      lendingFees: "0.00000000",
      netValue: "0.09999999",
      totalBorrowedValue: "0.02534580",
      currentMargin: "3.94542646"
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnMarginAccountSummary", nonce })
      .times(1)
      .reply(200, result);

    authClient
      .getMarginAccountSummary()
      .then(data => {
        assert.deepStrictEqual(data, result);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".marginBuy()", done => {
    const currencyPair = "BTC_ETH";
    const rate = 0.0035;
    const amount = 20;
    const response = {
      orderNumber: "515007818806",
      resultingTrades: [],
      message: "Margin order placed."
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "marginBuy",
        currencyPair,
        rate,
        amount,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .marginBuy({ currencyPair, rate, amount })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".marginBuy(with default currencyPair)", done => {
    const currencyPair = "BTC_ETH";
    const rate = 0.0035;
    const amount = 20;
    const client = new Poloniex.AuthenticatedClient({
      key,
      secret,
      currencyPair
    });
    const response = {
      orderNumber: "514845991795",
      resultingTrades: [
        {
          amount: "3.0",
          date: "2018-10-25 23:03:21",
          rate: "0.0002",
          total: "0.0006",
          tradeID: "251834",
          type: "buy"
        }
      ],
      fee: "0.01000000",
      currencyPair: "BTC_ETH"
    };
    const nonce = 154264078495300;
    client.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "marginBuy",
        currencyPair,
        rate,
        amount,
        nonce
      })
      .times(1)
      .reply(200, response);

    client
      .marginBuy({ rate, amount })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".marginSell()", done => {
    const currencyPair = "BTC_ETH";
    const rate = 0.0035;
    const amount = 20;
    const response = {
      orderNumber: "515007818812",
      resultingTrades: [],
      message: "Margin order placed."
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "marginSell",
        currencyPair,
        rate,
        amount,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .marginSell({ currencyPair, rate, amount })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".marginSell() (with `clientOrderId`)", done => {
    const currencyPair = "BTC_ETH";
    const rate = 0.0035;
    const amount = 20;
    const clientOrderId = 12345;
    const response = {
      orderNumber: "515007818812",
      resultingTrades: [],
      message: "Margin order placed.",
      clientOrderId: "12345"
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "marginSell",
        currencyPair,
        rate,
        amount,
        clientOrderId,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .marginSell({ currencyPair, rate, amount, clientOrderId })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getMarginPosition()", done => {
    const currencyPair = "BTC_ETH";
    const response = {
      amount: "40.94717831",
      total: "-0.09671314",
      basePrice: "0.00236190",
      liquidationPrice: -1,
      pl: "-0.00058655",
      lendingFees: "-0.00000038",
      type: "long"
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "getMarginPosition",
        currencyPair,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .getMarginPosition({ currencyPair })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".closeMarginPosition()", done => {
    const currencyPair = "BTC_ETH";
    const response = {
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
            type: "sell"
          },
          {
            amount: "24.00289920",
            date: "2015-05-10 22:38:49",
            rate: "0.00235321",
            total: "0.05648386",
            tradeID: "1213347",
            type: "sell"
          }
        ]
      }
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "closeMarginPosition",
        currencyPair,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .closeMarginPosition({ currencyPair })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".createLoanOffer()", done => {
    const currency = "BTC";
    const amount = 0.1;
    const duration = 2;
    const autoRenew = 0;
    const lendingRate = 0.015;
    const response = {
      success: 1,
      message: "Loan order placed.",
      orderID: 1002013188
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "createLoanOffer",
        currency,
        amount,
        duration,
        autoRenew,
        lendingRate,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .createLoanOffer({ currency, amount, duration, autoRenew, lendingRate })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".cancelLoanOffer()", done => {
    const orderNumber = 1002013188;
    const response = {
      success: 1,
      message: "Loan offer canceled.",
      amount: "0.10000000"
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "cancelLoanOffer", orderNumber, nonce })
      .times(1)
      .reply(200, response);

    authClient
      .cancelLoanOffer({ orderNumber })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getOpenLoanOffers()", done => {
    const response = {
      BTC: [
        {
          id: 1002015083,
          rate: "0.01500000",
          amount: "0.10000000",
          duration: 2,
          autoRenew: 0,
          date: "2018-10-26 20:26:46"
        }
      ]
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnOpenLoanOffers", nonce })
      .times(1)
      .reply(200, response);

    authClient
      .getOpenLoanOffers()
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getActiveLoans()", done => {
    const response = {
      provided: [
        {
          id: 75073,
          currency: "LTC",
          rate: "0.00020000",
          amount: "0.72234880",
          range: 2,
          autoRenew: 0,
          date: "2018-05-10 23:45:05",
          fees: "0.00006000"
        },
        {
          id: 74961,
          currency: "LTC",
          rate: "0.00002000",
          amount: "4.43860711",
          range: 2,
          autoRenew: 0,
          date: "2018-05-10 23:45:05",
          fees: "0.00006000"
        }
      ],
      used: [
        {
          id: 75238,
          currency: "BTC",
          rate: "0.00020000",
          amount: "0.04843834",
          range: 2,
          date: "2018-05-10 23:51:12",
          fees: "-0.00000001"
        }
      ]
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "returnActiveLoans", nonce })
      .times(1)
      .reply(200, response);

    authClient
      .getActiveLoans()
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getLendingHistory()", done => {
    const response = [
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
        close: "2017-01-01 23:42:51"
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
        close: "2017-01-01 23:38:45"
      },
      {
        id: 245670087,
        currency: "BTC",
        rate: "0.00014000",
        amount: "0.10038365",
        duration: "0.00010000",
        interest: "0.00000001",
        fee: "0.00000000",
        earned: "0.00000001",
        open: "2017-01-01 03:18:25",
        close: "2017-01-01 03:18:32"
      },
      {
        id: 245645491,
        currency: "XMR",
        rate: "0.00002191",
        amount: "0.00006579",
        duration: "0.00560000",
        interest: "0.00000001",
        fee: "0.00000000",
        earned: "0.00000001",
        open: "2017-01-01 02:17:09",
        close: "2017-01-01 02:25:10"
      }
    ];
    const start = 1483228800;
    const end = 1483315200;
    const limit = 100;
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", {
        command: "returnLendingHistory",
        start,
        end,
        limit,
        nonce
      })
      .times(1)
      .reply(200, response);

    authClient
      .getLendingHistory({ start, end, limit })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".toggleAutoRenew()", done => {
    const response = { success: 1, message: 0 };
    const orderNumber = 1002013188;
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post("/tradingApi", { command: "toggleAutoRenew", orderNumber, nonce })
      .times(1)
      .reply(200, response);

    authClient
      .toggleAutoRenew({ orderNumber })
      .then(data => {
        assert.deepStrictEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });
});
