import { Fetch } from "rpc-request";

export const ApiUri = "https://poloniex.com";
export const DefaultPair = "USDT_BTC";
export const ApiLimit = 100;
export const Headers = { "User-Agent": "poloniex-node-api-client" };

export interface CurrencyPair {
  currencyPair?: string | undefined;
}

export interface BookFilter extends CurrencyPair {
  depth?: number | undefined;
}

export interface TradesFilter extends CurrencyPair {
  start?: number | undefined;
  end?: number | undefined;
}

export interface TimeFilter {
  start: number;
  end: number;
}

export type Period = 300 | 900 | 1800 | 7200 | 14400 | 86400;

export interface ChartFilter extends CurrencyPair {
  period: Period;
  start: number;
  end: number;
}

export interface CurrencyFilter {
  currency: string;
}

export interface TickerInfo {
  id: number;
  last: string;
  lowestAsk: string;
  highestBid: string;
  percentChange: string;
  baseVolume: string;
  quoteVolume: string;
  isFrozen: string | 0 | 1;
  high24hr: string;
  low24hr: string;
}

export type Tickers = Record<string, TickerInfo>;

export type Volume = Record<string, string>;

export type Volumes = Record<string, Volume | string>;

export interface OrderBookInfo {
  asks: [string, number][];
  bids: [string, number][];
  isFrozen: string;
  seq: number;
}

export type OrderBooksInfo = Record<string, OrderBookInfo>;

export type OrderBook = OrderBookInfo | OrderBooksInfo;

export type Side = "buy" | "sell";

export interface BaseTrade {
  type: Side;
  amount: string;
  date: string;
  rate: string;
  total: string;
  tradeID: number | string;
}

export interface Trade extends BaseTrade {
  globalTradeID: number;
  orderNumber: number | string;
}

export interface Candle {
  date: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  quoteVolume: number;
  weightedAverage: number;
}

export interface CurrencyInfo {
  id: number;
  name: string;
  humanType: string;
  currencyType: string;
  txFee: string;
  minConf: number;
  depositAddress: string | null;
  disabled: 0 | 1;
  delisted: 0 | 1;
  frozen: 0 | 1;
  hexColor: string;
  blockchain: string | null;
  isGeofenced: 0 | 1;
}

export interface ExtendedCurrencyInfo extends CurrencyInfo {
  parentChain: string | null;
  isMultiChain: 0 | 1;
  isChildChain: 0 | 1;
  childChains: string[];
}

export type ICurrencies = Record<string, CurrencyInfo>;

export type ExtendedCurrencies = Record<string, ExtendedCurrencyInfo>;

export interface Loan {
  rate: string;
  amount: string;
  rangeMin: number;
  rangeMax: number;
}

export interface Loans {
  offers: Loan[];
  demands: Loan[];
}

export class PublicClient extends Fetch {
  public readonly currencyPair: string;

  public constructor({ currencyPair = DefaultPair }: CurrencyPair = {}) {
    super({
      headers: Headers,
      reject: false,
      transform: "json",
      base_url: ApiUri,
    });
    this.currencyPair = currencyPair;
  }

  public async get<T = unknown>(url: string): Promise<T> {
    const response = await super.get<{ error?: string }>(url);
    if (typeof response.error !== "undefined") {
      throw new Error(response.error);
    }
    return response as T;
  }

  /** Retrieves summary information for each currency pair listed on the exchange. */
  public async getTickers(): Promise<Tickers> {
    const command = "returnTicker";
    const url = new URL("/public", ApiUri);
    PublicClient.addOptions(url, { command });
    const tickers = await this.get<Tickers>(url.toString());
    return tickers;
  }

  /** Retrieves the 24-hour volume for all markets as well as totals for primary currencies. */
  public async getVolume(): Promise<Volumes> {
    const command = "return24hVolume";
    const url = new URL("/public", ApiUri);
    PublicClient.addOptions(url, { command });
    const volumes = await this.get<Volumes>(url.toString());
    return volumes;
  }

  /** Get the order book for a given market. */
  public async getOrderBook({
    currencyPair = this.currencyPair,
    depth = ApiLimit,
  }: BookFilter = {}): Promise<OrderBook> {
    const command = "returnOrderBook";
    const url = new URL("/public", ApiUri);
    PublicClient.addOptions(url, { command, currencyPair, depth });
    const orderBook = await this.get<OrderBook>(url.toString());
    return orderBook;
  }

  /** Get the past 200 trades for a given market, or up to 1,000 trades between a range `start` and `end`. */
  public async getTradeHistory({
    currencyPair = this.currencyPair,
    ...rest
  }: TradesFilter = {}): Promise<Trade[]> {
    const command = "returnTradeHistory";
    const url = new URL("/public", ApiUri);
    PublicClient.addOptions(url, { command, currencyPair, ...rest });
    const trades = await this.get<Trade[]>(url.toString());
    return trades;
  }

  /** Get candlestick chart data. */
  public async getChartData({
    currencyPair = this.currencyPair,
    ...rest
  }: ChartFilter): Promise<Candle[]> {
    const command = "returnChartData";
    const url = new URL("/public", ApiUri);
    PublicClient.addOptions(url, { command, currencyPair, ...rest });
    const candles = await this.get<Candle[]>(url.toString());
    return candles;
  }

  /** Get information about currencies. */
  public async getCurrencies(params: {
    includeMultiChainCurrencies: true;
  }): Promise<ExtendedCurrencies>;
  public async getCurrencies(params?: {
    includeMultiChainCurrencies?: boolean;
  }): Promise<ICurrencies>;
  public async getCurrencies({
    includeMultiChainCurrencies = false,
  } = {}): Promise<ExtendedCurrencies | ICurrencies> {
    const command = "returnCurrencies";
    const url = new URL("/public", ApiUri);
    PublicClient.addOptions(url, { command, includeMultiChainCurrencies });
    const currencies = await this.get<ICurrencies>(url.toString());
    return currencies;
  }

  /**  Get the list of loan offers and demands for a given currency. */
  public async getLoanOrders(qs: CurrencyFilter): Promise<Loans> {
    const command = "returnLoanOrders";
    const url = new URL("/public", ApiUri);
    PublicClient.addOptions(url, { command, ...qs });
    const loans = await this.get<Loans>(url.toString());
    return loans;
  }

  protected static addOptions(
    target: URL | URLSearchParams,
    data: Record<string, boolean | number | string | undefined>
  ): void {
    const searchParams = target instanceof URL ? target.searchParams : target;
    for (const key in data) {
      const value = data[key];
      if (typeof value !== "undefined") {
        searchParams.append(key, value.toString());
      }
    }
  }
}
