const assert = require("assert");
const nock = require("nock");

const Poloniex = require("../index.js");
const { EXCHANGE_API_URL } = require("../lib/utilities");

const key = "poloniex-api-key";
const secret = "poloniex-api-secret";

const authClient = new Poloniex.AuthenticatedClient({ key, secret });

suite("AuthenticatedClient", () => {
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
