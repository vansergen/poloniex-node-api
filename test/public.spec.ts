import { deepStrictEqual, rejects } from "node:assert";
import { MockAgent, getGlobalDispatcher, setGlobalDispatcher } from "undici";
import {
  PublicClient,
  ApiUri,
  ApiLimit,
  DefaultPair,
  Tickers,
  Volumes,
  OrderBook,
  Trade,
  Candle,
  ICurrencies,
  ExtendedCurrencies,
  Loans,
} from "../index.js";

suite("PublicClient", () => {
  const api_url = new URL(ApiUri);
  const client = new PublicClient();

  const globalDispatcher = getGlobalDispatcher();
  const mockAgent = new MockAgent();
  const mockPool = mockAgent.get(api_url.origin);

  suiteSetup(() => {
    setGlobalDispatcher(mockAgent);
    mockAgent.disableNetConnect();
  });

  suiteTeardown(() => {
    mockAgent.enableNetConnect();
    setGlobalDispatcher(globalDispatcher);
  });

  test("constructor", () => {
    deepStrictEqual(client.currencyPair, DefaultPair);
  });

  test(".constructor() (with custom parameters)", () => {
    const currencyPair = "BTC_ETH";
    const otherClient = new PublicClient({ currencyPair });
    deepStrictEqual(otherClient.currencyPair, currencyPair);
  });

  test(".get() (throws an error)", async () => {
    const error = "Some error message";
    const path = "/public";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, { error });

    await rejects(client.get(path), new Error(error));
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
        low24hr: "8732.23922667",
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
        low24hr: "0.02938000",
      },
    };
    const path = "/public";
    const command = "returnTicker";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query: { command } })
      .reply(200, tickers);

    const data = await client.getTickers();
    deepStrictEqual(data, tickers);
  });

  test(".getVolume()", async () => {
    const volume: Volumes = {
      USDT_BTC: { USDT: "7161846.98235853", BTC: "790.32984132" },
      USDT_ETH: { USDT: "895368.56029939", ETH: "3331.80491546" },
      totalETH: "370.77305935",
      totalBTC: "1845.83395826",
      totalUSDT: "11287088.18195494",
    };
    const path = "/public";
    const command = "return24hVolume";
    const url = new URL(path, ApiUri);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query: { command } })
      .reply(200, volume);

    const data = await client.getVolume();
    deepStrictEqual(data, volume);
  });

  test(".getOrderBook()", async () => {
    const books: OrderBook = {
      USDT_BTC: {
        asks: [
          ["9297.44488770", 0.143181],
          ["9298.08427869", 0.0001161],
        ],
        bids: [
          ["9297.24540399", 1.46374898],
          ["9297.24540398", 0.0443],
        ],
        isFrozen: "0",
        seq: 376097564,
      },
      BTC_ETH: {
        asks: [
          ["0.02930568", 0.56225405],
          ["0.02931998", 1],
        ],
        bids: [
          ["0.02930505", 0.00011779],
          ["0.02929320", 25],
        ],
        isFrozen: "0",
        seq: 711985070,
      },
    };
    const path = "/public";
    const command = "returnOrderBook";
    const url = new URL(path, ApiUri);
    const currencyPair = "all";
    const depth = 10;
    const query = { command, currencyPair, depth };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, books);

    const data = await client.getOrderBook({ currencyPair, depth });
    deepStrictEqual(data, books);
  });

  test(".getOrderBook() (with no `currencyPair`)", async () => {
    const book: OrderBook = {
      asks: [
        ["9297.44488770", 0.143181],
        ["9298.08427869", 0.0001161],
      ],
      bids: [
        ["9297.24540399", 1.46374898],
        ["9297.24540398", 0.0443],
      ],
      isFrozen: "0",
      seq: 376097564,
    };
    const path = "/public";
    const command = "returnOrderBook";
    const url = new URL(path, ApiUri);
    const currencyPair = DefaultPair;
    const depth = 10;
    const query = { command, currencyPair, depth };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, book);

    const data = await client.getOrderBook({ depth });
    deepStrictEqual(data, book);
  });

  test(".getOrderBook() (with no `depth`)", async () => {
    const book: OrderBook = {
      asks: [
        ["9297.44488770", 0.143181],
        ["9298.08427869", 0.0001161],
      ],
      bids: [
        ["9297.24540399", 1.46374898],
        ["9297.24540398", 0.0443],
      ],
      isFrozen: "0",
      seq: 376097564,
    };
    const path = "/public";
    const command = "returnOrderBook";
    const url = new URL(path, ApiUri);
    const currencyPair = "USDT_BTC";
    const depth = ApiLimit;
    const query = { command, currencyPair, depth };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, book);

    const data = await client.getOrderBook({ currencyPair });
    deepStrictEqual(data, book);
  });

  test(".getOrderBook() (with no arguments)", async () => {
    const book: OrderBook = {
      asks: [
        ["9297.44488770", 0.143181],
        ["9298.08427869", 0.0001161],
      ],
      bids: [
        ["9297.24540399", 1.46374898],
        ["9297.24540398", 0.0443],
      ],
      isFrozen: "0",
      seq: 376097564,
    };
    const path = "/public";
    const command = "returnOrderBook";
    const url = new URL(path, ApiUri);
    const currencyPair = DefaultPair;
    const depth = ApiLimit;
    const query = { command, currencyPair, depth };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, book);

    const data = await client.getOrderBook();
    deepStrictEqual(data, book);
  });

  test(".getTradeHistory()", async () => {
    const trades: Trade[] = [
      {
        globalTradeID: 420170516,
        tradeID: 27129920,
        date: "2019-06-17 15:25:18",
        type: "buy",
        rate: "9257.23051444",
        amount: "0.01394711",
        total: "129.11161228",
        orderNumber: 277619132092,
      },
      {
        globalTradeID: 420170477,
        tradeID: 27129919,
        date: "2019-06-17 15:24:19",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.07792262",
        total: "721.34398141",
        orderNumber: 277619040184,
      },
      {
        globalTradeID: 420170476,
        tradeID: 27129918,
        date: "2019-06-17 15:24:18",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.00259138",
        total: "23.98887982",
        orderNumber: 277619039185,
      },
    ];
    const path = "/public";
    const command = "returnTradeHistory";
    const url = new URL(path, ApiUri);
    const currencyPair = "USDT_BTC";
    const start = 1410158341;
    const query = { command, currencyPair, start };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, trades);

    // eslint-disable-next-line init-declarations
    let end: undefined;
    const data = await client.getTradeHistory({ end, start, currencyPair });
    deepStrictEqual(data, trades);
  });

  test(".getTradeHistory() (with no `currencyPair`)", async () => {
    const trades: Trade[] = [
      {
        globalTradeID: 420170516,
        tradeID: 27129920,
        date: "2019-06-17 15:25:18",
        type: "buy",
        rate: "9257.23051444",
        amount: "0.01394711",
        total: "129.11161228",
        orderNumber: 277619132092,
      },
      {
        globalTradeID: 420170477,
        tradeID: 27129919,
        date: "2019-06-17 15:24:19",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.07792262",
        total: "721.34398141",
        orderNumber: 277619040184,
      },
      {
        globalTradeID: 420170476,
        tradeID: 27129918,
        date: "2019-06-17 15:24:18",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.00259138",
        total: "23.98887982",
        orderNumber: 277619039185,
      },
    ];
    const path = "/public";
    const command = "returnTradeHistory";
    const url = new URL(path, ApiUri);
    const currencyPair = DefaultPair;
    const start = 1410158341;
    const end = 1410499372;
    const query = { command, currencyPair, start, end };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, trades);

    const data = await client.getTradeHistory({ end, start });
    deepStrictEqual(data, trades);
  });

  test(".getTradeHistory() (with no arguments)", async () => {
    const trades: Trade[] = [
      {
        globalTradeID: 420170516,
        tradeID: 27129920,
        date: "2019-06-17 15:25:18",
        type: "buy",
        rate: "9257.23051444",
        amount: "0.01394711",
        total: "129.11161228",
        orderNumber: 277619132092,
      },
      {
        globalTradeID: 420170477,
        tradeID: 27129919,
        date: "2019-06-17 15:24:19",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.07792262",
        total: "721.34398141",
        orderNumber: 277619040184,
      },
      {
        globalTradeID: 420170476,
        tradeID: 27129918,
        date: "2019-06-17 15:24:18",
        type: "sell",
        rate: "9257.18336240",
        amount: "0.00259138",
        total: "23.98887982",
        orderNumber: 277619039185,
      },
    ];
    const path = "/public";
    const command = "returnTradeHistory";
    const url = new URL(path, ApiUri);
    const currencyPair = DefaultPair;
    const query = { command, currencyPair };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, trades);

    const data = await client.getTradeHistory();
    deepStrictEqual(data, trades);
  });

  test(".getChartData()", async () => {
    const candles: Candle[] = [
      {
        date: 1560613059,
        high: 8809.26970927,
        low: 8809.26970927,
        open: 8809.26970927,
        close: 8809.26970927,
        volume: 0,
        quoteVolume: 0,
        weightedAverage: 8809.26970927,
      },
      {
        date: 1560643200,
        high: 9325,
        low: 8759.37683497,
        open: 8809.49125799,
        close: 8968.92286817,
        volume: 11929575.934481,
        quoteVolume: 1317.2708549,
        weightedAverage: 9056.28169795,
      },
      {
        date: 1560729600,
        high: 9390.83903896,
        low: 8949.00000001,
        open: 8963.50269782,
        close: 9157.79085762,
        volume: 3895287.1624447,
        quoteVolume: 423.63287478,
        weightedAverage: 9194.95958491,
      },
    ];
    const path = "/public";
    const command = "returnChartData";
    const url = new URL(path, ApiUri);
    const currencyPair = "BTC_XMR";
    const period = 14400;
    const start = 1546300800;
    const end = 1546646400;
    const query = { command, currencyPair, period, start, end };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, candles);

    const data = await client.getChartData({
      period,
      start,
      currencyPair,
      end,
    });
    deepStrictEqual(data, candles);
  });

  test(".getChartData() (with no `currencyPair`)", async () => {
    const candles: Candle[] = [
      {
        date: 1560613059,
        high: 8809.26970927,
        low: 8809.26970927,
        open: 8809.26970927,
        close: 8809.26970927,
        volume: 0,
        quoteVolume: 0,
        weightedAverage: 8809.26970927,
      },
      {
        date: 1560643200,
        high: 9325,
        low: 8759.37683497,
        open: 8809.49125799,
        close: 8968.92286817,
        volume: 11929575.934481,
        quoteVolume: 1317.2708549,
        weightedAverage: 9056.28169795,
      },
      {
        date: 1560729600,
        high: 9390.83903896,
        low: 8949.00000001,
        open: 8963.50269782,
        close: 9157.79085762,
        volume: 3895287.1624447,
        quoteVolume: 423.63287478,
        weightedAverage: 9194.95958491,
      },
    ];
    const path = "/public";
    const command = "returnChartData";
    const url = new URL(path, ApiUri);
    const currencyPair = DefaultPair;
    const period = 14400;
    const start = 1546300800;
    const end = 1546646400;
    const query = { command, currencyPair, period, start, end };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, candles);

    const data = await client.getChartData({ period, start, end });
    deepStrictEqual(data, candles);
  });

  test(".getCurrencies()", async () => {
    const currencies: ICurrencies = {
      BTC: {
        id: 28,
        name: "Bitcoin",
        humanType: "BTC Clone",
        currencyType: "address",
        txFee: "0.00050000",
        minConf: 1,
        depositAddress: null,
        disabled: 0,
        frozen: 0,
        hexColor: "F59C3D",
        blockchain: "BTC",
        delisted: 0,
        isGeofenced: 0,
      },
      USDT: {
        id: 214,
        name: "Tether USD",
        humanType: "Sweep to Main Account",
        currencyType: "address",
        txFee: "60.00000000",
        minConf: 2,
        depositAddress: null,
        disabled: 0,
        frozen: 0,
        hexColor: "44A58B",
        blockchain: "OMNI",
        delisted: 0,
        isGeofenced: 0,
      },
    };
    const path = "/public";
    const command = "returnCurrencies";
    const includeMultiChainCurrencies = false;
    const url = new URL(path, ApiUri);
    const query = { command, includeMultiChainCurrencies };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, currencies);

    const data = await client.getCurrencies();
    deepStrictEqual(data, currencies);
  });

  test(".getCurrencies() (with `includeMultiChainCurrencies`)", async () => {
    const currencies: ExtendedCurrencies = {
      BTC: {
        id: 28,
        name: "Bitcoin",
        humanType: "BTC Clone",
        currencyType: "address",
        txFee: "0.00050000",
        minConf: 1,
        depositAddress: null,
        disabled: 0,
        frozen: 0,
        hexColor: "F59C3D",
        blockchain: "BTC",
        delisted: 0,
        parentChain: null,
        isMultiChain: 1,
        isChildChain: 0,
        childChains: ["BTCTRON"],
        isGeofenced: 0,
      },
      USDT: {
        id: 214,
        name: "Tether USD",
        humanType: "Sweep to Main Account",
        currencyType: "address",
        txFee: "60.00000000",
        minConf: 2,
        depositAddress: null,
        disabled: 0,
        frozen: 0,
        hexColor: "44A58B",
        blockchain: "OMNI",
        delisted: 0,
        parentChain: null,
        isMultiChain: 1,
        isChildChain: 0,
        childChains: ["USDTETH", "USDTTRON"],
        isGeofenced: 0,
      },
    };
    const path = "/public";
    const command = "returnCurrencies";
    const includeMultiChainCurrencies = true;
    const url = new URL(path, ApiUri);
    const query = { command, includeMultiChainCurrencies };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, currencies);

    const data = await client.getCurrencies({ includeMultiChainCurrencies });
    deepStrictEqual(data, currencies);
  });

  test(".getLoanOrders()", async () => {
    const loans: Loans = {
      offers: [
        { rate: "0.00005900", amount: "0.01961918", rangeMin: 2, rangeMax: 2 },
        { rate: "0.00006000", amount: "62.24928418", rangeMin: 2, rangeMax: 2 },
      ],
      demands: [
        { rate: "0.02000000", amount: "0.00100014", rangeMin: 2, rangeMax: 2 },
        { rate: "0.00001000", amount: "0.04190154", rangeMin: 2, rangeMax: 2 },
      ],
    };
    const path = "/public";
    const command = "returnLoanOrders";
    const currency = "BTC";
    const url = new URL(path, ApiUri);
    const query = { currency, command };
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, loans);

    const data = await client.getLoanOrders({ currency });
    deepStrictEqual(data, loans);
  });
});
