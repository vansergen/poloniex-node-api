import { EventEmitter } from 'events';

declare module 'poloniex' {
  export type callback<T> = (error: any, data: T) => void;

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

    get(options: any);

    request(options: any);

    cb(method: string, callback: callback<any>, options?: any);

    getTickers(): Promise<any>;

    getVolume(): Promise<any>;

    getOrderBook(options?: any): Promise<any>;

    getTradeHistory(options?: any): Promise<any[]>;

    getChartData(options: any): Promise<any[]>;

    getCurrencies(): Promise<any>;

    getLoanOrders(options: any): Promise<any>;
  }

  export class AuthenticatedClient {
    constructor(options: AuthenticatedClientOptions);

    post(options: any);

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
