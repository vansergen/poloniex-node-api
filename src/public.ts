import { RPC, RPCOptions } from "rpc-request";

export const ApiUri = "https://poloniex.com";
export const DefaultTimeout = 30000;
export const DefaultPair = "USDT_BTC";
export const ApiLimit = 100;
export const Headers = {
  "User-Agent": "poloniex-node-api-client",
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest"
};

export type CurrencyPair = { currencyPair?: string };

export type BookFilter = CurrencyPair & { depth?: number };

export type TradesFilter = CurrencyPair & { start?: number; end?: number };

export type TimeFilter = { start: number; end: number };

export type ChartFilter = CurrencyPair & {
  period: 300 | 900 | 1800 | 7200 | 14400 | 86400;
} & TimeFilter;

export type CurrencyFilter = { currency: string };

export type TickerInfo = {
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
};

export type Tickers = { [currency: string]: TickerInfo };

export type Volume = { [currency: string]: string };

export type Volumes = { [currency: string]: string | Volume };

export type OrderBookInfo = {
  asks: [string, number][];
  bids: [string, number][];
  isFrozen: string;
  seq: number;
};

export type OrderBooksInfo = { [currency: string]: OrderBookInfo };

export type OrderBook = OrderBookInfo | OrderBooksInfo;

export type BaseTrade = {
  amount: string;
  date: string;
  rate: string;
  total: string;
  tradeID: number;
  type: "buy" | "sell";
};

export type Trade = BaseTrade & { globalTradeID: number; orderNumber: number };

export type Candle = {
  date: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  quoteVolume: number;
  weightedAverage: number;
};

export type CurrencyInfo = {
  id: number;
  name: string;
  humanType: string;
  currencyType: string;
  txFee: string;
  minConf: number;
  depositAddress: null | string;
  disabled: 0 | 1;
  delisted: 0 | 1;
  frozen: 0 | 1;
  isGeofenced: 0 | 1;
};

export type Currencies = { [currency: string]: CurrencyInfo };

export type Loan = {
  rate: string;
  amount: string;
  rangeMin: number;
  rangeMax: number;
};

export type Loans = { offers: Loan[]; demands: Loan[] };

export type PublicClientOptions = {
  currencyPair?: string;
  apiUri?: string;
  timeout?: number;
};

export class PublicClient extends RPC {
  readonly currencyPair: string;

  constructor({
    currencyPair = DefaultPair,
    apiUri = ApiUri,
    timeout = DefaultTimeout
  }: PublicClientOptions = {}) {
    super({ baseUrl: apiUri, json: true, headers: Headers, timeout });
    this.currencyPair = currencyPair || DefaultPair;
  }

  get({ qs }: RPCOptions): Promise<any> {
    return super.get({ uri: "/public", qs });
  }

  /**
   * Retrieves summary information for each currency pair listed on the exchange.
   */
  getTickers(): Promise<Tickers> {
    return this.get({ qs: { command: "returnTicker" } });
  }

  /**
   * Retrieves the 24-hour volume for all markets as well as totals for primary currencies.
   */
  getVolume(): Promise<Volumes> {
    return this.get({ qs: { command: "return24hVolume" } });
  }

  /**
   * Get the order book for a given market.
   */
  getOrderBook({
    currencyPair = "all",
    depth = ApiLimit
  }: BookFilter = {}): Promise<OrderBook> {
    const qs = { command: "returnOrderBook", currencyPair, depth };
    return this.get({ qs });
  }

  /**
   * Get the past 200 trades for a given market, or up to 1,000 trades between a range `start` and `end`.
   */
  getTradeHistory({
    currencyPair = this.currencyPair,
    ...rest
  }: TradesFilter = {}): Promise<Trade[]> {
    const qs = { command: "returnTradeHistory", currencyPair, ...rest };
    return this.get({ qs });
  }

  /**
   * Get candlestick chart data.
   */
  getChartData({
    currencyPair = this.currencyPair,
    ...qs
  }: ChartFilter): Promise<Candle[]> {
    const command = "returnChartData";
    return this.get({ qs: { command, currencyPair, ...qs } });
  }

  /**
   * Get information about currencies.
   */
  getCurrencies(): Promise<Currencies> {
    return this.get({ qs: { command: "returnCurrencies" } });
  }

  /**
   * Get the list of loan offers and demands for a given currency.
   */
  getLoanOrders({ currency }: CurrencyFilter): Promise<Loans> {
    return this.get({ qs: { command: "returnLoanOrders", currency } });
  }
}
