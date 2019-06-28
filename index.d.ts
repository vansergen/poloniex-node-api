import { EventEmitter } from 'events';

declare module 'poloniex' {
  export type callback<T> = (error: any, data: T) => void;

  export type TickerInfo = {
    id: number;
    last: string;
    lowestAsk: string;
    highestBid: string;
    percentChange: string;
    baseVolume: string;
    quoteVolume: string;
    isFrozen: string;
    high24hr: string;
    low24hr: string;
  };

  export type Tickers = {
    [currency: string]: TickerInfo;
  };

  export type Volume = {
    [currency: string]: string;
  };

  export type Volumes = {
    [currency: string]: string | Volume;
  };

  export type OrderBookInfo = {
    asks: [string, number][];
    bids: [string, number][];
    isFrozen: string;
    seq: number;
  };

  export type OrderBooksInfo = {
    [currency: string]: OrderBookInfo;
  };

  export type OrderBook = OrderBookInfo | OrderBooksInfo;

  export type getOptions = {
    command: string;
  };

  export type requestOptions = {
    method: 'GET' | 'POST';
    url: string;
    qs?: getOptions;
    form?: {
      nonce: number;
    } & getOptions;
  };

  export type CurrencyFilter = {
    currencyPair?: string;
  };

  export type BookFilter = {
    depth?: number;
  } & CurrencyFilter;

  export type PublicClientOptions = {
    currencyPair?: string;
    api_uri?: string;
    timeout?: number;
  };

  export type AuthenticatedClientOptions = {
    key: string;
    secret: number;
  } & PublicClientOptions;

  export type WebsocketClientOptions = {
    api_uri?: string;
    raw?: boolean;
    channels?: string | number | Array<string | number>;
    key?: string;
    secret?: string;
  };

  export class PublicClient {
    constructor(options?: PublicClientOptions);

    get(options: getOptions): Promise<any>;

    request(options: requestOptions): Promise<any>;

    cb(method: string, callback: callback<any>, options?: any);

    getTickers(): Promise<Tickers>;

    getVolume(): Promise<Volumes>;

    getOrderBook(options?: BookFilter): Promise<OrderBook>;

    getTradeHistory(options?: any): Promise<any[]>;

    getChartData(options: any): Promise<any[]>;

    getCurrencies(): Promise<any>;

    getLoanOrders(options: any): Promise<any>;
  }

  export class AuthenticatedClient {
    constructor(options: AuthenticatedClientOptions);

    post(options: getOptions): Promise<any>;

    getBalances(): Promise<any>;

    getCompleteBalances(options?: any): Promise<any>;

    getDepositAddresses(): Promise<any>;

    getNewAddress(options: any): Promise<any>;

    getDepositsWithdrawals(options: any): Promise<any>;
  }

  export class WebsocketClient extends EventEmitter {
    constructor(options?: WebsocketClientOptions);

    on(event: 'open', eventHandler: () => void): this;
    on(event: 'close', eventHandler: () => void): this;
    on(event: 'error', eventHandler: (error: any) => void): this;
    on(event: 'message', eventHandler: (data: any) => void): this;
    on(event: 'raw', eventHandler: (data: any) => void): this;

    connect(): void;
    disconnect(): void;

    subscribe(options: any): void;
    unsubscribe(options: any): void;
  }
}
