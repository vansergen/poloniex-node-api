import { EventEmitter } from "events";

declare module "poloniex-node-api" {
  export type callback<T> = (error: any, data: T) => void;

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

  export type Volume = {
    [currency: string]: string;
  };

  export type BaseTrade = {
    amount: string;
    date: string;
    rate: string;
    total: string;
    tradeID: number;
    type: "buy" | "sell";
  };

  export type Trade = {
    globalTradeID: number;
    orderNumber: number;
  } & BaseTrade;

  export type CBOptions = {
    _method: string;
  };

  export type CurrencyPairFilter = {
    currencyPair?: string;
  };

  export type TradesFilter = {
    start?: number;
    end?: number;
  } & CurrencyPairFilter;

  export type TimeFilter = {
    start: number;
    end: number;
  };

  export type AccountFilter = {
    account?: string;
  };

  export type HistoryTradesFilter = {
    limit?: number;
  } & TradesFilter;

  export type CurrencyFilter = {
    currency: string;
  };

  export type OrderFilter = {
    orderNumber: number;
  };

  export type OrderOptions = {
    currencyPair?: string;
    rate: number;
    amount: number;
    fillOrKill?: 0 | 1;
    immediateOrCancel?: 0 | 1;
    postOnly?: 0 | 1;
    clientOrderId?: number;
  };

  export type MoveOrderOptions = {
    orderNumber: number;
    rate: number;
    amount?: number;
    postOnly?: 0 | 1;
    immediateOrCancel?: 0 | 1;
    clientOrderId?: number;
  };

  export type WithdrawOptions = {
    currency: string;
    amount: number;
    address: string;
    paymentId?: string | number;
    currencyToWithdrawAs?: "USDTTRON";
  };

  export type TransferOptions = {
    currency: string;
    amount: number;
    fromAccount: "exchange" | "margin" | "lending";
    toAccount: "exchange" | "margin" | "lending";
  };

  export type MarginOrderOptions = {
    currencyPair?: string;
    rate: number;
    amount: number;
    lendingRate: number;
    clientOrderId?: number;
  };

  export type OfferOptions = {
    currency: string;
    amount: number;
    duration: number;
    autoRenew: number;
    lendingRate: number;
  };

  export type LendingHistoryOptions = {
    start?: number;
    end?: number;
    limit?: number;
  };

  export type Balances = {
    [currency: string]: string;
  };

  export type NewAddress = {
    success: 0 | 1;
    response: string;
  };

  export type Adjustment = {
    currency: string;
    amount: string;
    timestamp: number;
    status: string;
    category: "adjustment";
    adjustmentTitle: string;
    adjustmentDesc: string;
    adjustmentHelp: string;
  };

  export type Withdrawal = {
    withdrawalNumber: number;
    currency: string;
    address: string;
    amount: string;
    fee: string;
    timestamp: number;
    status: string;
    ipAddress: string;
    canCancel: 0 | 1;
    canResendEmail: 0 | 1;
    paymentID: null | string;
  };

  export type Deposit = {
    currency: string;
    address: string;
    amount: string;
    confirmations: number;
    txid: string;
    timestamp: number;
    status: "PENDING" | "COMPLETE";
    depositNumber: number;
    category: "deposit";
  };

  export type DepositsWithdrawals = {
    deposits: Deposit[];
    withdrawals: Withdrawal[];
    adjustments: Adjustment[];
  };

  export type Order = {
    orderNumber: string;
    type: "sell" | "buy";
    rate: string;
    startingAmount: string;
    amount: string;
    total: string;
    date: string;
    margin: 0 | 1;
  };

  export type Orders =
    | {
        [currencyPair: string]: Order[];
      }
    | Order[];

  export type TradePrivate = {
    fee: string;
    category: "exchange" | "margin";
  } & Trade;

  export type OrderTrade = {
    globalTradeID: number;
    currencyPair: string;
    fee: string;
  } & BaseTrade;

  export type OrderStatus = {
    result: {
      [order: string]: {
        currencyPair: string;
        rate: string;
        amount: string;
        total: string;
        startingAmount: string;
        type: "buy" | "sell";
        status: "Open" | "Partially filled";
        date: string;
        fee?: string;
      };
    };
    success: 0 | 1;
  };

  export type ResultingTrade = {
    takerAdjustment?: string;
  } & BaseTrade;

  export type OrderResult = {
    orderNumber: string;
    resultingTrades: ResultingTrade[];
    fee: string;
    currencyPair: string;
    clientOrderId?: string;
  };

  export type CancelResponse = {
    success: 0 | 1;
    amount: string;
    message: string;
    fee?: string;
    clientOrderId?: string;
    currencyPair?: string;
  };

  export type CancelAllResponse = {
    success: 0 | 1;
    message: string;
    orderNumbers: number[];
  };

  export type MoveResponse = {
    success: 0 | 1;
    orderNumber: string;
    fee: string;
    currencyPair: string;
    resultingTrades: {
      [currencyPair: string]: ResultingTrade[];
    };
    clientOrderId: string;
  };

  export type WithdrawResponse = {
    response: string;
    email2FA?: boolean;
    withdrawalNumber?: number;
  };

  export type FeesInfo = {
    makerFee: string;
    takerFee: string;
    thirtyDayVolume: string;
    nextTier: number;
  };

  export type AvailableAccountBalances = {
    exchange?: Balances | any[];
    margin?: Balances | any[];
    lending?: Balances | any[];
  };

  export type TradableBalances = {
    [currencyPair: string]: Balances;
  };

  export type TransferResponse = {
    success: 0 | 1;
    message: string;
  };

  export type MarginAccountSummary = {
    totalValue: string;
    pl: string;
    lendingFees: string;
    netValue: string;
    totalBorrowedValue: string;
    currentMargin: string;
  };

  export type MarginOrderResult = {
    orderNumber: string;
    resultingTrades: ResultingTrade[];
    message: string;
    clientOrderId?: string;
  };

  export type MarginPosition = {
    amount: string;
    total: string;
    basePrice: string;
    liquidationPrice: number;
    pl: string;
    lendingFees: string;
    type: "long" | "short" | "none";
  };

  export type MarginPositionResult =
    | {
        [currencyPair: string]: MarginPosition;
      }
    | MarginPosition;

  export type ClosePositionResult = {
    success: 0 | 1;
    message: string;
    resultingTrades: ResultingTrade[];
  };

  export type OfferResult = {
    success: 0 | 1;
    message: string;
    orderID?: number;
  };

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

  export type LoanOffers =
    | {
        [currency: string]: LoanOffer[];
      }
    | LoanOffer[];

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
    getNewAddress(options: CurrencyFilter): Promise<NewAddress>;

    getDepositsWithdrawals(options: TimeFilter): Promise<DepositsWithdrawals>;

    getOpenOrders(options?: CurrencyPairFilter): Promise<Orders>;

    getHistoryTrades(options?: HistoryTradesFilter): Promise<TradePrivate[]>;

    getOrderTrades(options: OrderFilter): Promise<OrderTrade[]>;

    getOrderStatus(options: OrderFilter): Promise<OrderStatus>;

    buy(options: OrderOptions): Promise<OrderResult>;

    sell(options: OrderOptions): Promise<OrderResult>;

    cancelOrder(options: OrderFilter): Promise<CancelResponse>;

    cancelAllOrders(options?: CurrencyPairFilter): Promise<CancelAllResponse>;

    moveOrder(options: MoveOrderOptions): Promise<MoveResponse>;

    withdraw(options: WithdrawOptions): Promise<WithdrawResponse>;

    getFeeInfo(): Promise<FeesInfo>;

    getAvailableAccountBalances(
      options?: AccountFilter
    ): Promise<AvailableAccountBalances>;

    getTradableBalances(): Promise<TradableBalances>;

    transferBalance(options: TransferOptions): Promise<TransferResponse>;

    getMarginAccountSummary(): Promise<MarginAccountSummary>;

    marginBuy(options: MarginOrderOptions): Promise<MarginOrderResult>;

    marginSell(options: MarginOrderOptions): Promise<MarginOrderResult>;

    getMarginPosition(
      options?: CurrencyPairFilter
    ): Promise<MarginPositionResult>;

    closeMarginPosition(
      options?: CurrencyPairFilter
    ): Promise<ClosePositionResult>;

    createLoanOffer(options: OfferOptions): Promise<OfferResult>;

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
