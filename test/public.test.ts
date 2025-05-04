import { deepStrictEqual } from "node:assert";
import { MockAgent, getGlobalDispatcher, setGlobalDispatcher } from "undici";
import {
  ApiUrl,
  DefaultSymbol,
  type IBorrowRate,
  type ICandle,
  type ICollateral,
  type ICurrency,
  type IExtendedCurrency,
  type IMarkPrice,
  type IMarkPriceComponents,
  type IOrderBook,
  type IPrice,
  type IPublicTrade,
  type IRawCandle,
  type ISymbolInformation,
  type ISystemTimestamp,
  type ITicker,
  PublicClient,
} from "../index.js";

suite("PublicClient", () => {
  const api_url = new URL(ApiUrl);
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
    deepStrictEqual(client.symbol, DefaultSymbol);
    deepStrictEqual(client.base_url, new URL(ApiUrl));
    deepStrictEqual(client.reject, true);
    deepStrictEqual(client.transform, "json");
  });

  test(".constructor() (with custom parameters)", () => {
    deepStrictEqual(client.symbol, DefaultSymbol);
    deepStrictEqual(client.base_url, new URL(ApiUrl));
    deepStrictEqual(client.reject, true);
    deepStrictEqual(client.transform, "json");

    const symbol = "ETH_BTC";
    const otherClient = new PublicClient({ symbol });
    deepStrictEqual(otherClient.symbol, symbol);
  });

  test(".getMarkets()", async () => {
    const markets: ISymbolInformation[] = [
      {
        symbol: "BTC_USDT",
        baseCurrencyName: "BTC",
        quoteCurrencyName: "USDT",
        displayName: "BTC/USDT",
        state: "NORMAL",
        visibleStartTime: 1659018819512,
        tradableStartTime: 1659018819512,
        symbolTradeLimit: {
          symbol: "BTC_USDT",
          priceScale: 2,
          quantityScale: 6,
          amountScale: 2,
          minQuantity: "0.000001",
          minAmount: "1",
          highestBid: "0",
          lowestAsk: "0",
        },
        crossMargin: {
          supportCrossMargin: true,
          maxLeverage: 3,
        },
      },
      {
        symbol: "ETH_USDT",
        baseCurrencyName: "ETH",
        quoteCurrencyName: "USDT",
        displayName: "ETH/USDT",
        state: "NORMAL",
        visibleStartTime: 1659018820007,
        tradableStartTime: 1659018820007,
        symbolTradeLimit: {
          symbol: "ETH_USDT",
          priceScale: 2,
          quantityScale: 6,
          amountScale: 2,
          minQuantity: "0.000001",
          minAmount: "1",
          highestBid: "0",
          lowestAsk: "0",
        },
        crossMargin: {
          supportCrossMargin: true,
          maxLeverage: 3,
        },
      },
    ];
    const path = "markets";
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, markets);

    const data = await client.getMarkets();
    deepStrictEqual(data, markets);
  });

  test(".getMarket()", async () => {
    const market: [ISymbolInformation] = [
      {
        symbol: "ETH_BTC",
        baseCurrencyName: "ETH",
        quoteCurrencyName: "BTC",
        displayName: "ETH/BTC",
        state: "NORMAL",
        visibleStartTime: 1659018819937,
        tradableStartTime: 1659018819937,
        symbolTradeLimit: {
          symbol: "ETH_BTC",
          priceScale: 5,
          quantityScale: 3,
          amountScale: 5,
          minQuantity: "0.001",
          minAmount: "0.00001",
          highestBid: "0",
          lowestAsk: "0",
        },
        crossMargin: { supportCrossMargin: true, maxLeverage: 3 },
      },
    ];
    const symbol = "ETH_BTC";
    const path = `markets/${symbol}`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, market);

    const data = await client.getMarket({ symbol });
    deepStrictEqual(data, market);
  });

  test(".getMarket() (with no `symbol`)", async () => {
    const market: [ISymbolInformation] = [
      {
        symbol: "BTC_USDT",
        baseCurrencyName: "BTC",
        quoteCurrencyName: "USDT",
        displayName: "BTC/USDT",
        state: "NORMAL",
        visibleStartTime: 1659018819512,
        tradableStartTime: 1659018819512,
        symbolTradeLimit: {
          symbol: "BTC_USDT",
          priceScale: 2,
          quantityScale: 6,
          amountScale: 2,
          minQuantity: "0.000001",
          minAmount: "1",
          highestBid: "0",
          lowestAsk: "0",
        },
        crossMargin: { supportCrossMargin: true, maxLeverage: 3 },
      },
    ];
    const symbol = DefaultSymbol;
    const path = `markets/${symbol}`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, market);

    const data = await client.getMarket();
    deepStrictEqual(data, market);
  });

  test(".getCurrency() (with no`currency`)", async () => {
    const currencies: Record<string, Omit<IExtendedCurrency, "currency">>[] = [
      {
        ETH: {
          id: 267,
          name: "Ethereum",
          description: "Sweep to Main Account",
          type: "address",
          withdrawalFee: "0.00107535",
          minConf: 12,
          depositAddress: null,
          blockchain: "ETH",
          delisted: false,
          tradingState: "NORMAL",
          walletState: "ENABLED",
          parentChain: null,
          isMultiChain: true,
          isChildChain: false,
          supportCollateral: false,
          supportBorrow: false,
          childChains: ["ETHTRON"],
        },
      },
      {
        ABY: {
          id: 2,
          name: "ArtByte",
          description: "BTC Clone",
          type: "address",
          withdrawalFee: "0.01000000",
          minConf: 10000,
          depositAddress: null,
          blockchain: "ABY",
          delisted: true,
          tradingState: "OFFLINE",
          walletState: "DISABLED",
          parentChain: null,
          isMultiChain: false,
          isChildChain: false,
          supportCollateral: false,
          supportBorrow: false,
          childChains: [],
        },
      },
    ];
    const includeMultiChainCurrencies = true;
    const query = { includeMultiChainCurrencies };
    const path = `currencies`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, currencies);

    const data = await client.getCurrency({ includeMultiChainCurrencies });
    deepStrictEqual(
      data,
      currencies.map<ICurrency>((object) => {
        const [currency] = Object.keys(object);
        return { ...object[currency], currency };
      }),
    );
  });

  test(".getCurrency()", async () => {
    const currency = "ETH";
    const response = {
      [currency]: {
        id: 267,
        name: "Ethereum",
        description: "Sweep to Main Account",
        type: "address",
        withdrawalFee: "0.00107535",
        minConf: 12,
        depositAddress: null,
        blockchain: "ETH",
        delisted: false,
        tradingState: "NORMAL",
        walletState: "ENABLED",
        parentChain: null,
        isMultiChain: true,
        isChildChain: false,
        supportCollateral: false,
        supportBorrow: false,
        childChains: ["ETHTRON"],
      },
    };
    const path = `currencies/${currency}`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, response);

    const data = await client.getCurrency({ currency });
    deepStrictEqual(data, { ...response[currency], currency });
  });

  test(".getCurrency() (with `includeMultiChainCurrencies`)", async () => {
    const currency = "BNB";
    const response = {
      [currency]: {
        id: 343,
        name: "Binance Coin",
        description: "Sweep to Main Account",
        type: "address-payment-id",
        withdrawalFee: "0.05000000",
        minConf: 0,
        depositAddress: null,
        blockchain: "BNB",
        delisted: false,
        tradingState: "NORMAL",
        walletState: "ENABLED",
        supportCollateral: false,
        supportBorrow: false,
        parentChain: null,
        isMultiChain: true,
        isChildChain: false,
        childChains: ["BSC"],
      },
    };
    const includeMultiChainCurrencies = true;
    const query = { includeMultiChainCurrencies };
    const path = `currencies/${currency}`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, response);

    const data = await client.getCurrency({
      includeMultiChainCurrencies,
      currency,
    });
    deepStrictEqual(data, { ...response[currency], currency });
  });

  test(".getSystemTime()", async () => {
    const time: ISystemTimestamp = { serverTime: 1673615480064 };
    const path = `timestamp`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, time);

    const data = await client.getSystemTime();
    deepStrictEqual(data, time);
  });

  test(".getPrices()", async () => {
    const prices: IPrice[] = [
      {
        symbol: "TRX_USDC",
        price: "0.06023436",
        time: 1648823320095,
        dailyChange: "0.0113",
        ts: 1649022802046,
      },
      {
        symbol: "ELON_USDC",
        price: "0.0000007",
        time: 1648509468464,
        dailyChange: "-0.002",
        ts: 1649022801990,
      },
    ];
    const path = `markets/price`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, prices);

    const data = await client.getPrices();
    deepStrictEqual(data, prices);
  });

  test(".getPrice()", async () => {
    const symbol = "TRX_USDC";
    const price: IPrice = {
      symbol: "TRX_USDC",
      price: "0.06023436",
      time: 1648823320095,
      dailyChange: "0.0113",
      ts: 1649022802046,
    };
    const path = `markets/${symbol}/price`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, price);

    const data = await client.getPrice({ symbol: "TRX_USDC" });
    deepStrictEqual(data, price);
  });

  test(".getPrice() (with no `symbol`)", async () => {
    const symbol = DefaultSymbol;
    const price: IPrice = {
      symbol: "BTC_USDT",
      price: "18881.47",
      time: 1673615969233,
      dailyChange: "0.034",
      ts: 1673615969237,
    };
    const path = `markets/${symbol}/price`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, price);

    const data = await client.getPrice();
    deepStrictEqual(data, price);
  });

  test(".getMarkPrices()", async () => {
    const prices: IMarkPrice[] = [
      {
        symbol: "BTC_USDT",
        markPrice: "17580.34",
        time: 1648823320095,
      },
      {
        symbol: "ETH_USDT",
        markPrice: "1205.64",
        time: 1648509468464,
      },
    ];
    const path = `markets/markPrice`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, prices);

    const data = await client.getMarkPrices();
    deepStrictEqual(data, prices);
  });

  test(".getMarkPrice()", async () => {
    const symbol = "ETH_BTC";
    const price: IMarkPrice = {
      symbol: "ETH_USDT",
      markPrice: "1205.64",
      time: 1648509468464,
    };
    const path = `markets/${symbol}/markPrice`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, price);

    const data = await client.getMarkPrice({ symbol });
    deepStrictEqual(data, price);
  });

  test(".getMarkPrice() (with no `symbol`)", async () => {
    const symbol = DefaultSymbol;
    const price: IMarkPrice = {
      symbol: "BTC_USDT",
      markPrice: "17580.34",
      time: 1648823320095,
    };
    const path = `markets/${symbol}/markPrice`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, price);

    const data = await client.getMarkPrice();
    deepStrictEqual(data, price);
  });

  test(".getMarkPriceComponents()", async () => {
    const symbol = "ZEC_USDT";
    const price: IMarkPriceComponents = {
      markPrice: "43.93",
      symbol: "ZEC_USDT",
      ts: 1673618727606,
      components: [
        {
          symbol: "ZEC_USDT",
          symbolPrice: "43.9",
          weight: "0.01",
          convertPrice: "43.9",
          exchange: "BINANCE",
        },
        {
          symbol: "ZEC_USDT",
          symbolPrice: "43.96",
          weight: "0.01",
          convertPrice: "43.96",
          exchange: "OKX",
        },
        {
          symbol: "ZEC_USDT",
          symbolPrice: "43.91",
          weight: "0.01",
          convertPrice: "43.91",
          exchange: "HUOBI",
        },
        {
          symbol: "ZEC_USDT",
          symbolPrice: "43.93",
          weight: "0.01",
          convertPrice: "43.93",
          exchange: "GATEIO",
        },
        {
          symbol: "ZEC_USDT",
          symbolPrice: "43.968207",
          weight: "0.01",
          convertPrice: "43.968207",
          exchange: "BIBOX",
        },
        {
          symbol: "ZEC_USDT",
          symbolPrice: "43.895",
          weight: "0.01",
          convertPrice: "43.895",
          exchange: "KUCOIN",
        },
        {
          symbol: "ZEC_USDT",
          symbolPrice: "43.95",
          weight: "0.01",
          convertPrice: "43.95",
          exchange: "DIGIFINEX",
        },
      ],
    };
    const path = `markets/${symbol}/markPriceComponents`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, price);

    const data = await client.getMarkPriceComponents({ symbol });
    deepStrictEqual(data, price);
  });

  test(".getMarkPriceComponents() (with no `symbol`)", async () => {
    const symbol = DefaultSymbol;
    const price: IMarkPriceComponents = {
      markPrice: "18842.44",
      symbol: "BTC_USDT",
      ts: 1673618546807,
      components: [
        {
          symbol: "BTC_USDT",
          symbolPrice: "18841.8",
          weight: "0.52",
          convertPrice: "18841.8",
          exchange: "BINANCE",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18843",
          weight: "0.12",
          convertPrice: "18843",
          exchange: "OKX",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18841.52",
          weight: "0.02",
          convertPrice: "18841.52",
          exchange: "HUOBI",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18849.39",
          weight: "0.02",
          convertPrice: "18849.39",
          exchange: "POLONIEX",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18850.7",
          weight: "0.01",
          convertPrice: "18850.7",
          exchange: "GATEIO",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18841.95",
          weight: "0.02",
          convertPrice: "18841.95",
          exchange: "BINANCEUS",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18846",
          weight: "0.02",
          convertPrice: "18846",
          exchange: "BIBOX",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18841.6",
          weight: "0.04",
          convertPrice: "18841.6",
          exchange: "KUCOIN",
        },
        {
          symbol: "BTC_USDT",
          symbolPrice: "18844.4",
          weight: "0.02",
          convertPrice: "18844.4",
          exchange: "DIGIFINEX",
        },
      ],
    };
    const path = `markets/${symbol}/markPriceComponents`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, price);

    const data = await client.getMarkPriceComponents();
    deepStrictEqual(data, price);
  });

  test(".getOrderBook()", async () => {
    const symbol = "ETH_BTC";
    const limit = 5 as const;
    const scale = 0.01;
    const query = { limit, scale };
    const book: IOrderBook = {
      time: 1673618298938,
      scale: "0.01",
      asks: [
        "0.08",
        "198.195",
        "0.09",
        "419.508",
        "0.10",
        "564.006",
        "0.11",
        "243.555",
        "0.12",
        "172.445",
      ],
      bids: [
        "0.07",
        "268.186",
        "0.06",
        "460.585",
        "0.05",
        "340.928",
        "0.04",
        "44.939",
        "0.03",
        "24.827",
      ],
      ts: 1673618298947,
    };
    const path = `markets/${symbol}/orderBook`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, book);

    const data = await client.getOrderBook({ symbol, ...query });
    deepStrictEqual(data, book);
  });

  test(".getOrderBook() (with no `symbol`)", async () => {
    const symbol = DefaultSymbol;
    const limit = 5 as const;
    const scale = 100;
    const query = { limit, scale };
    const book: IOrderBook = {
      time: 1673620718489,
      scale: "100",
      asks: [
        "19000",
        "9.871596",
        "19100",
        "3.106331",
        "19200",
        "0.982520",
        "19300",
        "0.437888",
        "19400",
        "0.566269",
      ],
      bids: [
        "18900",
        "2.113186",
        "18800",
        "5.305187",
        "18700",
        "2.575953",
        "18600",
        "0.901731",
        "18500",
        "0.984571",
      ],
      ts: 1673620718499,
    };
    const path = `markets/${symbol}/orderBook`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, book);

    const data = await client.getOrderBook(query);
    deepStrictEqual(data, book);
  });

  test(".getCandles()", async () => {
    const symbol = "ETH_BTC";
    const interval = "HOUR_1" as const;
    const limit = 2;
    const endTime = Date.now();
    const startTime = endTime - 1000 * 60 * 60 * 24;
    const query = { interval, limit, startTime, endTime };
    const raw_candles: IRawCandle[] = [
      [
        "0.07444",
        "0.07466",
        "0.07455",
        "0.07452",
        "5.6317412",
        "75.549",
        "2.9008616",
        "38.916",
        791,
        1673618400185,
        "0.074544260930633444",
        "HOUR_1",
        1673614800000,
        1673618399999,
      ],
      [
        "0.07432",
        "0.07453",
        "0.07451",
        "0.07432",
        "3.9716139",
        "53.369",
        "1.97752535",
        "26.573",
        556,
        1673621292185,
        "0.074418011273250777",
        "HOUR_1",
        1673618400000,
        1673621999999,
      ],
    ];
    const candles: ICandle[] = [
      {
        low: "0.07444",
        high: "0.07466",
        open: "0.07455",
        close: "0.07452",
        amount: "5.6317412",
        quantity: "75.549",
        buyTakerAmount: "2.9008616",
        buyTakerQuantity: "38.916",
        tradeCount: 791,
        ts: 1673618400185,
        weightedAverage: "0.074544260930633444",
        interval: "HOUR_1",
        startTime: 1673614800000,
        closeTime: 1673618399999,
      },
      {
        low: "0.07432",
        high: "0.07453",
        open: "0.07451",
        close: "0.07432",
        amount: "3.9716139",
        quantity: "53.369",
        buyTakerAmount: "1.97752535",
        buyTakerQuantity: "26.573",
        tradeCount: 556,
        ts: 1673621292185,
        weightedAverage: "0.074418011273250777",
        interval: "HOUR_1",
        startTime: 1673618400000,
        closeTime: 1673621999999,
      },
    ];
    const path = `markets/${symbol}/candles`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, raw_candles);

    const data = await client.getCandles({ symbol, ...query });
    deepStrictEqual(data, candles);
  });

  test(".getCandles() (with no `symbol`)", async () => {
    const symbol = DefaultSymbol;
    const raw_candles: IRawCandle[] = [
      [
        "0.07444",
        "0.07466",
        "0.07455",
        "0.07452",
        "5.6317412",
        "75.549",
        "2.9008616",
        "38.916",
        791,
        1673618400185,
        "0.074544260930633444",
        "HOUR_1",
        1673614800000,
        1673618399999,
      ],
      [
        "0.07432",
        "0.07453",
        "0.07451",
        "0.07432",
        "3.9716139",
        "53.369",
        "1.97752535",
        "26.573",
        556,
        1673621292185,
        "0.074418011273250777",
        "HOUR_1",
        1673618400000,
        1673621999999,
      ],
    ];
    const candles: ICandle[] = [
      {
        low: "0.07444",
        high: "0.07466",
        open: "0.07455",
        close: "0.07452",
        amount: "5.6317412",
        quantity: "75.549",
        buyTakerAmount: "2.9008616",
        buyTakerQuantity: "38.916",
        tradeCount: 791,
        ts: 1673618400185,
        weightedAverage: "0.074544260930633444",
        interval: "HOUR_1",
        startTime: 1673614800000,
        closeTime: 1673618399999,
      },
      {
        low: "0.07432",
        high: "0.07453",
        open: "0.07451",
        close: "0.07432",
        amount: "3.9716139",
        quantity: "53.369",
        buyTakerAmount: "1.97752535",
        buyTakerQuantity: "26.573",
        tradeCount: 556,
        ts: 1673621292185,
        weightedAverage: "0.074418011273250777",
        interval: "HOUR_1",
        startTime: 1673618400000,
        closeTime: 1673621999999,
      },
    ];
    const interval = "HOUR_1" as const;
    const query = { interval };
    const path = `markets/${symbol}/candles`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, raw_candles);

    const data = await client.getCandles(query);
    deepStrictEqual(data, candles);
  });

  test(".getPublicTrades()", async () => {
    const symbol = "ETH_BTC";
    const limit = 2;
    const query = { limit };
    const trades: IPublicTrade[] = [
      {
        id: "60991704",
        price: "0.07427",
        quantity: "0.021",
        amount: "0.00155967",
        takerSide: "BUY",
        ts: 1673621709469,
        createTime: 1673621709463,
      },
      {
        id: "60991703",
        price: "0.07427",
        quantity: "0.012",
        amount: "0.00089124",
        takerSide: "SELL",
        ts: 1673621709084,
        createTime: 1673621709079,
      },
    ];
    const path = `markets/${symbol}/trades`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET", query })
      .reply(200, trades);

    const data = await client.getPublicTrades({ symbol, ...query });
    deepStrictEqual(data, trades);
  });

  test(".getPublicTrades() (with no `symbol`)", async () => {
    const symbol = DefaultSymbol;
    const trades: IPublicTrade[] = [
      {
        id: "60991704",
        price: "0.07427",
        quantity: "0.021",
        amount: "0.00155967",
        takerSide: "BUY",
        ts: 1673621709469,
        createTime: 1673621709463,
      },
      {
        id: "60991703",
        price: "0.07427",
        quantity: "0.012",
        amount: "0.00089124",
        takerSide: "SELL",
        ts: 1673621709084,
        createTime: 1673621709079,
      },
    ];
    const path = `markets/${symbol}/trades`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, trades);

    const data = await client.getPublicTrades();
    deepStrictEqual(data, trades);
  });

  test(".getTickers()", async () => {
    const tickers: ITicker[] = [
      {
        symbol: "BTC_USDT",
        open: "26343.72",
        low: "25828.72",
        high: "26984.01",
        close: "26834.91",
        quantity: "75.226341",
        amount: "1991347.4585352",
        tradeCount: 10447,
        startTime: 1683891420000,
        closeTime: 1683977821008,
        displayName: "BTC/USDT",
        dailyChange: "0.0186",
        bid: "26824.11",
        bidQuantity: "0.012147",
        ask: "26833.42",
        askQuantity: "0.069574",
        ts: 1683977822755,
        markPrice: "26828.85",
      },
      {
        symbol: "ETH_USDT",
        open: "1765.27",
        low: "1745.97",
        high: "1815.09",
        close: "1803.07",
        quantity: "259.852304",
        amount: "465367.79721283",
        tradeCount: 5554,
        startTime: 1683892380000,
        closeTime: 1683978801699,
        displayName: "ETH/USDT",
        dailyChange: "0.0214",
        bid: "1803.06",
        bidQuantity: "1.305946",
        ask: "1803.07",
        askQuantity: "0.021472",
        ts: 1683978803138,
        markPrice: "1803.34",
      },
    ];
    const path = `markets/ticker24h`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, tickers);

    const data = await client.getTickers();
    deepStrictEqual(data, tickers);
  });

  test(".getTicker()", async () => {
    const ticker: ITicker = {
      symbol: "ETH_USDT",
      open: "1765.27",
      low: "1745.97",
      high: "1815.09",
      close: "1803.07",
      quantity: "259.852304",
      amount: "465367.79721283",
      tradeCount: 5554,
      startTime: 1683892380000,
      closeTime: 1683978801699,
      displayName: "ETH/USDT",
      dailyChange: "0.0214",
      bid: "1803.06",
      bidQuantity: "1.305946",
      ask: "1803.07",
      askQuantity: "0.021472",
      ts: 1683978803138,
      markPrice: "1803.34",
    };
    const symbol = "ETH_BTC";
    const path = `markets/${symbol}/ticker24h`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, ticker);

    const data = await client.getTicker({ symbol });
    deepStrictEqual(data, ticker);
  });

  test(".getTicker() (with no `symbol`)", async () => {
    const ticker: ITicker = {
      symbol: "ETH_USDT",
      open: "1765.27",
      low: "1745.97",
      high: "1815.09",
      close: "1803.07",
      quantity: "259.852304",
      amount: "465367.79721283",
      tradeCount: 5554,
      startTime: 1683892380000,
      closeTime: 1683978801699,
      displayName: "ETH/USDT",
      dailyChange: "0.0214",
      bid: "1803.06",
      bidQuantity: "1.305946",
      ask: "1803.07",
      askQuantity: "0.021472",
      ts: 1683978803138,
      markPrice: "1803.34",
    };
    const symbol = DefaultSymbol;
    const path = `markets/${symbol}/ticker24h`;
    const url = new URL(path, ApiUrl);
    mockPool
      .intercept({ path: url.pathname, method: "GET" })
      .reply(200, ticker);

    const data = await client.getTicker();
    deepStrictEqual(data, ticker);
  });

  test(".getCollateral()", async () => {
    const info: ICollateral = {
      currency: "ETH",
      collateralRate: "0.95",
      initialMarginRate: "0.5",
      maintenanceMarginRate: "0.1",
    };
    const currency = "ETH";
    const path = `markets/${currency}/collateralInfo`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, info);

    const data = await client.getCollateral({ currency });
    deepStrictEqual(data, info);
  });

  test(".getCollateral() (with no `currency`)", async () => {
    const info: ICollateral[] = [
      {
        currency: "BTC",
        collateralRate: "0.95",
        initialMarginRate: "0.50",
        maintenanceMarginRate: "0.10",
      },
      {
        currency: "ETH",
        collateralRate: "0.95",
        initialMarginRate: "0.55",
        maintenanceMarginRate: "0.11",
      },
    ];
    const path = `markets/collateralInfo`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, info);

    const data = await client.getCollateral();
    deepStrictEqual(data, info);
  });

  test(".getBorrowRates()", async () => {
    const rates: IBorrowRate[] = [
      {
        tier: "TIER1",
        rates: [
          {
            currency: "BTC",
            dailyBorrowRate: "1",
            hourlyBorrowRate: "0.04166",
            borrowLimit: "10",
          },
          {
            currency: "ETH",
            dailyBorrowRate: "1",
            hourlyBorrowRate: "0.04166",
            borrowLimit: "100",
          },
        ],
      },
      {
        tier: "TIER2",
        rates: [
          {
            currency: "BTC",
            dailyBorrowRate: "0.95",
            hourlyBorrowRate: "0.03958",
            borrowLimit: "11",
          },
          {
            currency: "ETH",
            dailyBorrowRate: "1",
            hourlyBorrowRate: "0.03958",
            borrowLimit: "110",
          },
        ],
      },
    ];
    const path = `markets/borrowRatesInfo`;
    const url = new URL(path, ApiUrl);
    mockPool.intercept({ path: url.pathname, method: "GET" }).reply(200, rates);

    const data = await client.getBorrowRates();
    deepStrictEqual(data, rates);
  });
});
