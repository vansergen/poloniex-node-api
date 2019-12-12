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
}
