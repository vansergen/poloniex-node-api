const assert = require("assert");
const nock = require("nock");

const Poloniex = require("../index.js");
const { EXCHANGE_API_URL } = require("../lib/utilities");

const key = "poloniex-api-key";
const secret = "poloniex-api-secret";

const authClient = new Poloniex.AuthenticatedClient({ key, secret });

suite("AuthenticatedClient", () => {
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
