import * as assert from "assert";
import {
  PublicClient,
  ApiUri,
  DefaultTimeout,
  DefaultPair,
  Headers
} from "../index";

const client = new PublicClient();

suite("PublicClient", () => {
  test(".constructor()", () => {
    assert.deepStrictEqual(client.currencyPair, DefaultPair);
    assert.deepStrictEqual(client._rpoptions, {
      baseUrl: ApiUri,
      json: true,
      timeout: DefaultTimeout,
      headers: Headers
    });
  });

  test(".constructor() (with custom parameters)", () => {
    const apiUri = "https://new-poloniex-api-url.com";
    const timeout = 9000;
    const currencyPair = "BTC_ETH";
    const client = new PublicClient({ apiUri, timeout, currencyPair });
    assert.deepStrictEqual(client.currencyPair, currencyPair);
    assert.deepStrictEqual(client._rpoptions, {
      baseUrl: apiUri,
      json: true,
      timeout,
      headers: Headers
    });
  });
});
