import * as assert from "assert";
import { AuthenticatedClient, Headers } from "../index";

const key = "poloniex-api-key";
const secret = "poloniex-api-secret";

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
});
