import * as assert from "assert";
import * as nock from "nock";
import {
  PublicClient,
  ApiUri,
  DefaultTimeout,
  DefaultPair,
  Headers,
  Tickers,
  Volumes
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

  test(".getTickers()", async () => {
    const tickers: Tickers = {
      USDT_BTC: {
        id: 121,
        last: "9162.76459012",
        lowestAsk: "9162.76459012",
        highestBid: "9151.76341041",
        percentChange: "0.04079405",
        baseVolume: "9649722.16546198",
        quoteVolume: "1064.67078796",
        isFrozen: "0",
        high24hr: "9325.00000000",
        low24hr: "8732.23922667"
      },
      BTC_ETH: {
        id: 148,
        last: "0.02963883",
        lowestAsk: "0.02963878",
        highestBid: "0.02963850",
        percentChange: "-0.02552059",
        baseVolume: "255.46245681",
        quoteVolume: "8544.98856973",
        isFrozen: "0",
        high24hr: "0.03079000",
        low24hr: "0.02938000"
      }
    };
    const command = "returnTicker";
    nock(ApiUri)
      .get("/public")
      .query({ command })
      .reply(200, tickers);

    const data = await client.getTickers();
    assert.deepStrictEqual(data, tickers);
  });

  test(".getVolume()", async () => {
    const volume: Volumes = {
      USDT_BTC: { USDT: "7161846.98235853", BTC: "790.32984132" },
      USDT_ETH: { USDT: "895368.56029939", ETH: "3331.80491546" },
      totalETH: "370.77305935",
      totalBTC: "1845.83395826",
      totalUSDT: "11287088.18195494"
    };
    const command = "return24hVolume";
    nock(ApiUri)
      .get("/public")
      .query({ command })
      .reply(200, volume);

    const data = await client.getVolume();
    assert.deepStrictEqual(data, volume);
  });
});
