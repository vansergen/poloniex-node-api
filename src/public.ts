import { Fetch, type IFetchOptions } from "rpc-request";

export type IRecordType = Record<
  string,
  string[] | boolean | number | string | undefined
>;

export interface IPoloniexGetOptions extends IPoloniexFetchOptions {
  options?: IRecordType;
}

export interface IPoloniexFetchOptions extends IFetchOptions {
  options?: IRecordType | unknown[];
}

export const ApiUrl = "https://api.poloniex.com/";
export const DefaultSymbol = "BTC_USDT";

export interface IOrderBookOptions {
  symbol?: string;
  scale?: number;
  limit?: 5 | 10 | 20 | 50 | 100 | 150;
}

export interface ICandlesOptions {
  symbol?: string;
  interval:
    | "DAY_1"
    | "DAY_3"
    | "HOUR_1"
    | "HOUR_2"
    | "HOUR_4"
    | "HOUR_6"
    | "HOUR_12"
    | "MINUTE_1"
    | "MINUTE_5"
    | "MINUTE_10"
    | "MINUTE_15"
    | "MINUTE_30"
    | "MONTH_1"
    | "WEEK_1";
  limit?: number;
  startTime?: number;
  endTime?: number;
}

export interface IPublicTradeOptions {
  symbol?: string;
  limit?: number;
}

/** Reference Data */

export interface ISymbolInformation {
  symbol: string;
  baseCurrencyName: string;
  quoteCurrencyName: string;
  displayName: string;
  state: string;
  visibleStartTime: number;
  tradableStartTime: number;
  symbolTradeLimit: {
    symbol: string;
    priceScale: number;
    quantityScale: number;
    amountScale: number;
    minQuantity: string;
    minAmount: string;
    highestBid: string;
    lowestAsk: string;
  };
  crossMargin: { supportCrossMargin: boolean; maxLeverage: number };
}

export interface ICurrency {
  currency: string;
  id: number;
  name: string;
  description: string;
  type: string;
  withdrawalFee: string;
  minConf: number;
  depositAddress: null;
  blockchain: string;
  delisted: boolean;
  tradingState: "NORMAL" | "OFFLINE";
  walletState: "DISABLED" | "ENABLED";
  supportCollateral: boolean;
  supportBorrow: boolean;
}

export interface IExtendedCurrency extends ICurrency {
  parentChain: string | null;
  isMultiChain: boolean;
  isChildChain: boolean;
  childChains: string[];
}

export interface ISystemTimestamp {
  serverTime: number;
}

export interface IPrice {
  symbol: string;
  price: string;
  time: number;
  dailyChange: string;
  ts: number;
}

export interface IMarkPrice {
  symbol: string;
  markPrice: string;
  time: number;
}

export interface IMarkPriceComponents extends Omit<IMarkPrice, "time"> {
  ts: number;
  components: {
    symbol: string;
    symbolPrice: string;
    weight: string;
    convertPrice: string;
    exchange: string;
  }[];
}

export interface IOrderBook {
  time: number;
  scale: string;
  asks: string[];
  bids: string[];
  ts: number;
}

export type IRawCandle = [
  low: string,
  high: string,
  open: string,
  close: string,
  amount: string,
  quantity: string,
  buyTakerAmount: string,
  buyTakerQuantity: string,
  tradeCount: number,
  ts: number,
  weightedAverage: string,
  interval: ICandlesOptions["interval"],
  startTime: number,
  closeTime: number,
];

export interface ICandle {
  low: string;
  high: string;
  open: string;
  close: string;
  amount: string;
  quantity: string;
  buyTakerAmount: string;
  buyTakerQuantity: string;
  tradeCount: number;
  ts: number;
  weightedAverage: string;
  interval: ICandlesOptions["interval"];
  startTime: number;
  closeTime: number;
}

export interface IPublicTrade {
  id: string;
  price: string;
  quantity: string;
  amount: string;
  takerSide: "BUY" | "SELL";
  ts: number;
  createTime: number;
}

export interface ITicker {
  symbol: string;
  open: string;
  low: string;
  high: string;
  close: string;
  quantity: string;
  amount: string;
  tradeCount: number;
  startTime: number;
  closeTime: number;
  displayName: string;
  dailyChange: string;
  bid: string;
  bidQuantity: string;
  ask: string;
  askQuantity: string;
  ts: number;
  markPrice: string;
}

export interface ICollateral {
  currency: string;
  collateralRate: string;
  initialMarginRate: string;
  maintenanceMarginRate: string;
}

export interface IBorrowRate {
  tier: string;
  rates: {
    currency: string;
    dailyBorrowRate: string;
    hourlyBorrowRate: string;
    borrowLimit: string;
  }[];
}

export interface IPublicClientOptions {
  url?: URL | string | undefined;
  symbol?: string;
}

export class PublicClient extends Fetch {
  readonly #symbol: string;

  public constructor({
    url = ApiUrl,
    symbol = DefaultSymbol,
  }: IPublicClientOptions = {}) {
    super({ base_url: new URL(url), transform: "json" });
    this.#symbol = symbol;
  }

  public get base_url(): URL {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return super.base_url!;
  }

  public get symbol(): string {
    return this.#symbol;
  }

  public get<T = unknown>(
    path = "",
    {
      options,
      ...init
    }: Exclude<IPoloniexGetOptions, { options: unknown[] }> = {},
  ): Promise<T> {
    const searchParams = new URLSearchParams();
    PublicClient.setQuery(searchParams, options);
    const url = new URL(path, this.base_url);
    url.search = searchParams.toString();

    return super.get(url.toString(), init);
  }

  /** Get all symbols and their trade limit info. */
  public getMarkets(): Promise<ISymbolInformation[]> {
    return this.get<ISymbolInformation[]>("/markets");
  }

  /** Get a single symbol and its trade limit info. */
  public getMarket({ symbol = this.#symbol } = {}): Promise<
    [ISymbolInformation]
  > {
    return this.get<[ISymbolInformation]>(`/markets/${symbol}`);
  }

  /** Get data for a supported currency all supported currencies. */
  public async getCurrency(query: {
    includeMultiChainCurrencies: true;
    currency: string;
  }): Promise<IExtendedCurrency>;
  public async getCurrency(query: {
    includeMultiChainCurrencies: true;
    currency?: undefined;
  }): Promise<IExtendedCurrency[]>;
  public async getCurrency(query: {
    includeMultiChainCurrencies?: false | undefined;
    currency: string;
  }): Promise<ICurrency>;
  public async getCurrency(query?: {
    includeMultiChainCurrencies?: false | undefined;
    currency?: string | undefined;
  }): Promise<ICurrency[]>;
  public async getCurrency({
    currency,
    ...options
  }: {
    includeMultiChainCurrencies?: boolean | undefined;
    currency?: string | undefined;
  } = {}): Promise<
    ICurrency | ICurrency[] | IExtendedCurrency | IExtendedCurrency[]
  > {
    if (typeof currency === "undefined") {
      const all = await this.get<Record<string, Omit<ICurrency, "currency">>[]>(
        "/currencies",
        { options },
      );

      return all.map((c) => PublicClient.#formatCurrency(c));
    }

    const info = await this.get<Record<string, Omit<ICurrency, "currency">>>(
      `/currencies/${currency}`,
      { options },
    );

    return PublicClient.#formatCurrency(info);
  }

  /** Get current server time. */
  public getSystemTime(): Promise<ISystemTimestamp> {
    return this.get<ISystemTimestamp>("/timestamp");
  }

  /** Get the latest trade price for all symbols. */
  public getPrices(): Promise<IPrice[]> {
    return this.get<IPrice[]>("/markets/price");
  }

  /** Get the latest trade price for a symbol. */
  public getPrice({ symbol = this.#symbol } = {}): Promise<IPrice> {
    return this.get<IPrice>(`/markets/${symbol}/price`);
  }

  /** Get latest mark price for all cross margin symbols. */
  public getMarkPrices(): Promise<IMarkPrice[]> {
    return this.get<IMarkPrice[]>("/markets/markPrice");
  }

  /** Get latest mark price for a single cross margin symbol. */
  public getMarkPrice({ symbol = this.#symbol } = {}): Promise<IMarkPrice> {
    return this.get<IMarkPrice>(`/markets/${symbol}/markPrice`);
  }

  /** Get components of the mark price for a given symbol. */
  public getMarkPriceComponents({
    symbol = this.#symbol,
  } = {}): Promise<IMarkPriceComponents> {
    return this.get<IMarkPriceComponents>(
      `/markets/${symbol}/markPriceComponents`,
    );
  }

  /** Get the order book for a given symbol. */
  public getOrderBook({
    symbol = this.#symbol,
    ...options
  }: IOrderBookOptions = {}): Promise<IOrderBook> {
    return this.get<IOrderBook>(`/markets/${symbol}/orderBook`, { options });
  }

  /** Get OHLC for a symbol at given timeframe (interval). */
  public async getCandles({
    symbol = this.#symbol,
    ...options
  }: ICandlesOptions): Promise<ICandle[]> {
    const raw = await this.get<IRawCandle[]>(`/markets/${symbol}/candles`, {
      options,
    });

    return raw.map((candle) => PublicClient.#formatCandle(candle));
  }

  /** Get a list of recent trades. */
  public async getPublicTrades({
    symbol = this.#symbol,
    ...options
  }: IPublicTradeOptions = {}): Promise<IPublicTrade[]> {
    return this.get<IPublicTrade[]>(`/markets/${symbol}/trades`, { options });
  }

  /** Get ticker in last 24 hours for all symbols. */
  public getTickers(): Promise<ITicker[]> {
    return this.get<ITicker[]>("/markets/ticker24h");
  }

  /** Get ticker in last 24 hours for a given symbol. */
  public getTicker({ symbol = this.#symbol } = {}): Promise<ITicker> {
    return this.get<ITicker>(`/markets/${symbol}/ticker24h`);
  }

  /** Get collateral information for all currencies or a single currency.. */
  public getCollateral(options: { currency: string }): Promise<ICollateral>;
  public getCollateral(options?: {
    currency?: undefined;
  }): Promise<ICollateral[]>;
  public getCollateral({
    currency,
  }: { currency?: string | undefined } = {}): Promise<
    ICollateral | ICollateral[]
  > {
    return this.get<ICollateral | ICollateral[]>(
      typeof currency === "undefined"
        ? "/markets/collateralInfo"
        : `/markets/${currency}/collateralInfo`,
    );
  }

  /** Get borrow rates information for all tiers and currencies. */
  public getBorrowRates(): Promise<IBorrowRate[]> {
    return this.get<IBorrowRate[]>("/markets/borrowRatesInfo");
  }

  public static setQuery(query: URLSearchParams, object?: IRecordType): void {
    for (const key in object) {
      const value = object[key];
      if (typeof value !== "undefined") {
        query.set(key, value.toString());
      }
    }
  }

  static #formatCurrency(
    currency: Record<string, Omit<ICurrency, "currency">>,
  ): ICurrency {
    const [key] = Object.keys(currency);
    return { ...currency[key], currency: key };
  }

  static #formatCandle([
    low,
    high,
    open,
    close,
    amount,
    quantity,
    buyTakerAmount,
    buyTakerQuantity,
    tradeCount,
    ts,
    weightedAverage,
    interval,
    startTime,
    closeTime,
  ]: IRawCandle): ICandle {
    return {
      low,
      high,
      open,
      close,
      amount,
      quantity,
      buyTakerAmount,
      buyTakerQuantity,
      tradeCount,
      ts,
      weightedAverage,
      interval,
      startTime,
      closeTime,
    };
  }
}
