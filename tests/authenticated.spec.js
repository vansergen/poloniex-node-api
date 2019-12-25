const assert = require("assert");
const nock = require("nock");

const Poloniex = require("../index.js");
const { EXCHANGE_API_URL } = require("../lib/utilities");

const key = "poloniex-api-key";
const secret = "poloniex-api-secret";

const authClient = new Poloniex.AuthenticatedClient({ key, secret });

suite("AuthenticatedClient", () => {
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
