import * as assert from "assert";
import * as nock from "nock";
import {
  AuthenticatedClient,
  Headers,
  ApiUri,
  Balances,
  CompleteBalances,
  Adresses,
  NewAddress
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
});
