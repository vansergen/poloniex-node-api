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
