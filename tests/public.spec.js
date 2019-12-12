const assert = require("assert");
const nock = require("nock");

const Poloniex = require("../index.js");
const publicClient = new Poloniex.PublicClient();
const { EXCHANGE_API_URL } = require("../lib/utilities");

suite("PublicClient", () => {
  teardown(() => nock.cleanAll());

  test(".request() (handles errors)", done => {
    const data = { error: "some error" };
    nock(EXCHANGE_API_URL)
      .get("/public")
      .times(1)
      .reply(400, data);

    publicClient
      .request({ method: "GET", url: EXCHANGE_API_URL + "/public" })
      .then(() => assert.fail("Should have thrown an error"))
      .catch(error => {
        assert.deepStrictEqual(error, data);
        done();
      });
  });

  test(".getTradeHistory()", done => {
    const trades = [
      {
        globalTradeID: 420170516,
        tradeID: 27129920,
        date: "2019-06-17 15:25:18",
        type: "buy",
        rate: "9257.23051444",
        amount: "0.01394711",
        total: "129.11161228",
        orderNumber: 277619132092
      },
      {
        globalTradeID: 420170477,
        tradeID: 27129919,
        date: "2019-06-17 15:24:19",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.07792262",
        total: "721.34398141",
        orderNumber: 277619040184
      },
      {
        globalTradeID: 420170476,
        tradeID: 27129918,
        date: "2019-06-17 15:24:18",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.00259138",
        total: "23.98887982",
        orderNumber: 277619039185
      }
    ];
    nock(EXCHANGE_API_URL)
      .get("/public?command=returnTradeHistory&currencyPair=USDT_BTC")
      .times(1)
      .reply(200, trades);

    publicClient
      .getTradeHistory()
      .then(data => {
        assert.deepStrictEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getTradeHistory() (with parameters)", done => {
    const options = { start: 1560783670, end: 1560783719 };
    const trades = [
      {
        globalTradeID: 420168521,
        tradeID: 47110335,
        date: "2019-06-17 15:01:58",
        type: "sell",
        rate: "0.02924282",
        amount: "0.32220457",
        total: "0.00942217",
        orderNumber: 605151881509
      },
      {
        globalTradeID: 420168418,
        tradeID: 47110334,
        date: "2019-06-17 15:01:10",
        type: "sell",
        rate: "0.02925860",
        amount: "1.00000000",
        total: "0.02925860",
        orderNumber: 605151487903
      }
    ];
    nock(EXCHANGE_API_URL)
      .get(
        "/public?command=returnTradeHistory&currencyPair=BTC_ETH&start=1560783670&end=1560783719"
      )
      .times(1)
      .reply(200, trades);

    const client = new Poloniex.PublicClient({ currencyPair: "BTC_ETH" });

    client
      .getTradeHistory(options)
      .then(data => {
        assert.deepStrictEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getChartData()", done => {
    const candles = [
      {
        date: 1560613059,
        high: 8809.26970927,
        low: 8809.26970927,
        open: 8809.26970927,
        close: 8809.26970927,
        volume: 0,
        quoteVolume: 0,
        weightedAverage: 8809.26970927
      },
      {
        date: 1560643200,
        high: 9325,
        low: 8759.37683497,
        open: 8809.49125799,
        close: 8968.92286817,
        volume: 11929575.934481,
        quoteVolume: 1317.2708549,
        weightedAverage: 9056.28169795
      },
      {
        date: 1560729600,
        high: 9390.83903896,
        low: 8949.00000001,
        open: 8963.50269782,
        close: 9157.79085762,
        volume: 3895287.1624447,
        quoteVolume: 423.63287478,
        weightedAverage: 9194.95958491
      }
    ];
    const options = {
      period: 86400,
      start: 1560613059,
      end: 1560785858
    };
    nock(EXCHANGE_API_URL)
      .get(
        "/public?command=returnChartData&currencyPair=USDT_BTC&period=86400&start=1560613059&end=1560785858"
      )
      .times(1)
      .reply(200, candles);

    publicClient
      .getChartData(options)
      .then(data => {
        assert.deepStrictEqual(data, candles);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getCurrencies()", done => {
    const currencies = {
      BTC: {
        id: 28,
        name: "Bitcoin",
        humanType: "BTC Clone",
        currencyType: "address",
        txFee: "0.00050000",
        minConf: 1,
        depositAddress: null,
        disabled: 0,
        delisted: 0,
        frozen: 0,
        isGeofenced: 0
      },
      USDT: {
        id: 214,
        name: "Tether USD",
        humanType: "Sweep to Main Account",
        currencyType: "address",
        txFee: "10.00000000",
        minConf: 2,
        depositAddress: null,
        disabled: 0,
        delisted: 0,
        frozen: 0,
        isGeofenced: 0
      }
    };
    nock(EXCHANGE_API_URL)
      .get("/public?command=returnCurrencies")
      .times(1)
      .reply(200, currencies);

    publicClient
      .getCurrencies()
      .then(data => {
        assert.deepStrictEqual(data, currencies);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test(".getLoanOrders()", done => {
    const options = { currency: "BTC" };
    const loans = {
      offers: [
        { rate: "0.00005900", amount: "0.01961918", rangeMin: 2, rangeMax: 2 },
        { rate: "0.00006000", amount: "62.24928418", rangeMin: 2, rangeMax: 2 }
      ],
      demands: [
        { rate: "0.02000000", amount: "0.00100014", rangeMin: 2, rangeMax: 2 },
        { rate: "0.00001000", amount: "0.04190154", rangeMin: 2, rangeMax: 2 }
      ]
    };
    nock(EXCHANGE_API_URL)
      .get("/public?command=returnLoanOrders&currency=BTC")
      .times(1)
      .reply(200, loans);

    publicClient
      .getLoanOrders(options)
      .then(data => {
        assert.deepStrictEqual(data, loans);
        done();
      })
      .catch(error => assert.fail(error));
  });
});
