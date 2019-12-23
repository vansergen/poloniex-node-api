import { EventEmitter } from "events";

declare module "poloniex-node-api" {
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

  export type Volume = { [currency: string]: string };

  export type BaseTrade = {
    amount: string;
    date: string;
    rate: string;
    total: string;
    tradeID: number;
    type: "buy" | "sell";
  };

  export type CurrencyPairFilter = { currencyPair?: string };

  export type OrderFilter = { orderNumber: number };

  export type LendingHistoryOptions = {
    start?: number;
    end?: number;
    limit?: number;
  };

  export type Balances = { [currency: string]: string };

  export type ResultingTrade = BaseTrade & { takerAdjustment?: string };

  export type CancelLoanResponse = {
    success: 0 | 1;
    message: string;
    amount?: string;
  };

  export type LoanOffer = {
    id: number;
    rate: string;
    amount: string;
    duration: number;
    autoRenew: 0 | 1;
    date: string;
  };

  export type LoanOffers = { [currency: string]: LoanOffer[] } | LoanOffer[];

  export type ActiveLoan = {
    id: number;
    currency: string;
    rate: string;
    amount: string;
    range: number;
    autoRenew?: 0 | 1;
    date: string;
    fees: string;
  };

  export type ActiveLoans = {
    provided: ActiveLoan[];
    used: ActiveLoan[];
  };

  export type LendingHistoryItem = {
    id: number;
    currency: string;
    rate: string;
    amount: string;
    duration: string;
    interest: string;
    fee: string;
    earned: string;
    open: string;
    close: string;
  };

  export type LendingHistory = LendingHistoryItem[];

  export type AutoRenewResult = {
    success: 0 | 1;
    message: 0 | 1;
  };

  export type WsRawMessage = Array<any>;

  export namespace WebsocketMessage {
    type Message = {
      channel_id: string | number;
      sequence: number | null | "";
    };

    export type Heartbeat = {
      subject: "heartbeat";
    } & Message;

    export type Subscribe = {
      subject: "subscribed" | "unsubscribed";
    } & Message;

    export type Ticker = {
      subject: "ticker";
      currencyPair: string | undefined;
    } & TickerInfo &
      Message;

    export type WSVolume = {
      subject: "volume";
      time: string;
      users: number;
      volume: Volume;
    };

    export type Update = {
      subject: "update";
      type: "buy" | "sell";
      price: string;
      size: string;
    } & Message;

    export type Snapshot = {
      subject: "snapshot";
      currencyPair: string;
      asks: {
        [price: string]: string;
      };
      bids: {
        [price: string]: string;
      };
    } & Message;

    export type WSPublicTrade = {
      subject: "publicTrade";
      tradeID: string;
      type: "buy" | "sell";
      price: string;
      size: string;
      timestamp: number;
    } & Message;

    export type Balance = {
      subject: "balance";
      currencyId: number;
      currency: string | undefined;
      wallet: "e" | "m" | "l";
      amount: string;
    } & Message;

    export type New = {
      subject: "new";
      id: number;
      currencyPair: string | undefined;
      orderNumber: number;
      type: "buy" | "sell";
      rate: string;
      amount: string;
      date: string;
      originalAmount: string;
      clientOrderId: string | null;
    } & Message;

    export type WSOrder = {
      subject: "order";
      orderNumber: number;
      newAmount: string;
      orderType: "filled" | "canceled" | "self-trade";
      clientOrderId: string | null;
    } & Message;

    export type WSPending = {
      subject: "pending";
      orderNumber: number;
      currencyPair: string | undefined;
      rate: string;
      amount: string;
      type: "buy" | "sell";
      clientOrderId: string | null;
    } & Message;

    export type WSTrade = {
      subject: "trade";
      tradeID: number;
      rate: string;
      amount: string;
      feeMultiplier: string;
      fundingType: 0 | 1 | 2 | 3;
      orderNumber: number;
      fee: string;
      date: string;
      clientOrderId: string | null;
    } & Message;

    export type WSKill = {
      subject: "killed";
      orderNumber: number;
      clientOrderId: string | null;
    };
  }

  export type WebsocketMessage =
    | WebsocketMessage.Heartbeat
    | WebsocketMessage.Subscribe
    | WebsocketMessage.Ticker
    | WebsocketMessage.WSVolume
    | WebsocketMessage.Update
    | WebsocketMessage.Snapshot
    | WebsocketMessage.WSPublicTrade
    | WebsocketMessage.Balance
    | WebsocketMessage.New
    | WebsocketMessage.WSOrder
    | WebsocketMessage.WSPending
    | WebsocketMessage.WSTrade
    | WebsocketMessage.WSKill;

  export type SubscriptionOptions = {
    channel_id: string | number;
  };

  export type WebsocketClientOptions = {
    api_uri?: string;
    raw?: boolean;
    channels?: string | number | Array<string | number>;
    key?: string;
    secret?: string;
  };

  export class AuthenticatedClient {
    cancelLoanOffer(options: OrderFilter): Promise<CancelLoanResponse>;

    getOpenLoanOffers(): Promise<LoanOffers>;

    getActiveLoans(): Promise<ActiveLoans>;

    getLendingHistory(options?: LendingHistoryOptions): Promise<LendingHistory>;

    toggleAutoRenew(options: OrderFilter): Promise<AutoRenewResult>;
  }

  export class WebsocketClient extends EventEmitter {
    constructor(options?: WebsocketClientOptions);

    on(event: "message", eventHandler: (data: WebsocketMessage) => void): this;
    on(event: "open", eventHandler: () => void): this;
    on(event: "close", eventHandler: () => void): this;
    on(event: "error", eventHandler: (error: any) => void): this;
    on(event: "raw", eventHandler: (data: WsRawMessage) => void): this;

    connect(): void;
    disconnect(): void;

    subscribe(options: SubscriptionOptions): void;
    unsubscribe(options: SubscriptionOptions): void;
  }
}
