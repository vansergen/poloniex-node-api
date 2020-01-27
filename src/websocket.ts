import * as Websocket from "ws";
import { EventEmitter } from "events";
import { SignRequest } from "./signer";
import { Currencies } from "./currencies";
import { CurrencyPairs } from "./currencypairs";

export const WsUri = "wss://api2.poloniex.com";
export const DefaultChannels = [121];

export type Channel = number | string;

export type Subscription = {
  command: "subscribe" | "unsubscribe";
  channel: Channel;
};

export type RawError = { error: string };

export type RawWsHeartbeat = [1010];

export type RawAcknowledgement = [Channel, 0 | 1];

export type RawTickerMessage = [
  1002,
  null,
  [
    number,
    string,
    string,
    string,
    string,
    string,
    string,
    0 | 1,
    string,
    string
  ]
];

export type RawVolumeMessage = [
  1003,
  null,
  [string, number, { [currency: string]: string }]
];

export type RawSnapshot = [
  "i",
  {
    currencyPair: string;
    orderBook: [{ [asks: string]: string }, { [bids: string]: string }];
  }
];

export type RawPublicTrade = ["t", string, 0 | 1, string, string, number];

export type RawBookUpdate = ["o", 0 | 1, string, string];

export type RawPriceAggregatedBook = [
  Channel,
  number,
  (RawSnapshot | RawPublicTrade | RawBookUpdate)[]
];

export type RawPendingOrder = [
  "p",
  number,
  number,
  string,
  string,
  string,
  string | null
];

export type RawNewOrder = [
  "n",
  number,
  number,
  string,
  string,
  string,
  string,
  string,
  string | null
];

export type RawBalance = ["b", number, "e" | "m" | "l", string];

export type RawOrder = ["o", number, string, "f" | "s" | "c", string | null];

export type RawTrade = [
  "t",
  number,
  string,
  string,
  string,
  0 | 1 | 2 | 3,
  number,
  string,
  string,
  string | null
];

export type RawKill = ["k", number, string | null];

export type RawAccountMessage = [
  1000,
  "",
  (RawPendingOrder | RawNewOrder | RawBalance | RawOrder | RawTrade | RawKill)[]
];

export type RawMessage =
  | RawWsHeartbeat
  | RawAcknowledgement
  | RawTickerMessage
  | RawVolumeMessage
  | RawPriceAggregatedBook
  | RawAccountMessage
  | RawError;

export type BaseMessage = {
  channel_id: Channel;
  subject: string;
  sequence?: number | string | null;
};

export type WsHeartbeat = BaseMessage & {
  channel_id: 1010;
  subject: "heartbeat";
};

export type WsAcknowledgement = BaseMessage & {
  subject: "subscribed" | "unsubscribed";
};

export type WsTicker = BaseMessage & {
  subject: "ticker";
  channel_id: 1002;
  currencyPairId: number;
  currencyPair?: string;
  last: string;
  lowestAsk: string;
  highestBid: string;
  percentChange: string;
  baseVolume: string;
  quoteVolume: string;
  isFrozen: boolean;
  high24hr: string;
  low24hr: string;
};

export type WsVolume = BaseMessage & {
  subject: "volume";
  channel_id: 1003;
  time: string;
  users: number;
  volume: { [currency: string]: string };
};

export type WsSnapshot = {
  subject: "snapshot";
  currencyPair: string;
  asks: { [price: string]: string };
  bids: { [price: string]: string };
};

export type WsPublicTrade = {
  subject: "publicTrade";
  tradeID: string;
  type: "buy" | "sell";
  price: string;
  size: string;
  timestamp: number;
};

export type WsBookUpdate = {
  subject: "update";
  type: "buy" | "sell";
  price: string;
  size: string;
};

export type WsBookMessage = BaseMessage & {
  sequence: number;
  currencyPair?: string;
} & (WsSnapshot | WsPublicTrade | WsBookUpdate);

export type WsPendingOrder = {
  subject: "pending";
  orderNumber: number;
  currencyPairId: number;
  currencyPair?: string;
  rate: string;
  amount: string;
  type: "buy" | "sell";
  clientOrderId: string | null;
};

export type WsNewOrder = {
  subject: "new";
  currencyPairId: number;
  currencyPair?: string;
  orderNumber: number;
  type: "buy" | "sell";
  rate: string;
  amount: string;
  date: string;
  originalAmount: string;
  clientOrderId: string | null;
};

export type WsBalance = {
  subject: "balance";
  currencyId: number;
  currency?: string;
  wallet: "exchange" | "margin" | "lending";
  amount: string;
};

export type WsOrder = {
  subject: "order";
  orderNumber: number;
  newAmount: string;
  orderType: "filled" | "canceled" | "self-trade";
  clientOrderId: string | null;
};

export type WsTrade = {
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
};

export type WsKill = {
  subject: "killed";
  orderNumber: number;
  clientOrderId: string | null;
};

export type WsAccountMessage = BaseMessage &
  (WsPendingOrder | WsNewOrder | WsBalance | WsOrder | WsTrade | WsKill);

export type WsMessage =
  | WsHeartbeat
  | WsAcknowledgement
  | WsTicker
  | WsVolume
  | WsBookMessage
  | WsAccountMessage;

export type WebsocketClientOptions = {
  wsUri?: string;
  raw?: boolean;
  channels?: Channel[];
  key?: string;
  secret?: string;
};

export declare interface WebsocketClient {
  on(event: "open", eventListener: () => void): this;
  on(event: "close", eventListener: () => void): this;
  on(event: "message", eventListener: (data: WsMessage) => void): this;
  on(event: "rawMessage", eventListener: (data: RawMessage) => void): this;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: "error", eventListener: (error: any) => void): this;

  once(event: "open", eventListener: () => void): this;
  once(event: "close", eventListener: () => void): this;
  once(event: "message", eventListener: (data: WsMessage) => void): this;
  once(event: "rawMessage", eventListener: (data: RawMessage) => void): this;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  once(event: "error", eventListener: (error: any) => void): this;
}

export class WebsocketClient extends EventEmitter {
  readonly wsUri: string;
  readonly raw: boolean;
  readonly channels: Channel[];
  readonly key?: string;
  readonly secret?: string;
  public socket?: Websocket;
  private _nonce?: () => number;

  /**
   * Create WebsocketClient.
   */
  constructor({
    wsUri = WsUri,
    raw = true,
    channels = DefaultChannels,
    key,
    secret
  }: WebsocketClientOptions = {}) {
    super();
    this.wsUri = wsUri;
    this.raw = raw;
    this.channels = channels;
    if (key && secret) {
      this.key = key;
      this.secret = secret;
    }
  }

  /**
   * Connect to the websocket.
   */
  connect(): void {
    if (this.socket) {
      switch (this.socket.readyState) {
        case Websocket.OPEN:
          return;
        case Websocket.CLOSING:
        case Websocket.CONNECTING:
          throw new Error(
            "Could not connect. State: " + this.socket.readyState
          );
      }
    }

    this.socket = new Websocket(this.wsUri);
    this.socket.on("open", this.onOpen.bind(this));
    this.socket.on("close", this.onClose.bind(this));
    this.socket.on("message", this.onMessage.bind(this));
    this.socket.on("error", this.onError.bind(this));
  }

  /**
   * Disconnect from the websocket.
   */
  disconnect(): void {
    if (!this.socket) {
      return;
    }

    switch (this.socket.readyState) {
      case Websocket.CLOSED:
        return;
      case Websocket.CLOSING:
      case Websocket.CONNECTING:
        throw new Error(
          "Could not disconnect. State: " + this.socket.readyState
        );
    }

    this.socket.close();
  }

  /**
   * Subscribes to the specified channel.
   */
  subscribe(channel: Channel): void {
    this.send({ command: "subscribe", channel });
  }

  /**
   * Unsubscribes from the specified channel.
   */
  unsubscribe(channel: Channel): void {
    this.send({ command: "unsubscribe", channel });
  }

  private send(subscription: Subscription): void {
    if (!this.socket) {
      throw new Error("Websocket is not initialized");
    } else if (this.key && this.secret) {
      const { key, secret } = this;
      const form = { nonce: this.nonce() };
      const payload = "nonce=" + form.nonce.toString();
      const signature = SignRequest({ key, secret, form });
      const message = { ...subscription, payload, ...signature };
      this.socket.send(JSON.stringify(message));
    } else {
      this.socket.send(JSON.stringify(subscription));
    }
  }

  private onOpen(): void {
    this.emit("open");
    for (const channel of this.channels) {
      this.subscribe(channel);
    }
  }

  private onClose(): void {
    this.emit("close");
  }

  private onMessage(data: string): void {
    const jsondata: RawMessage = JSON.parse(data);
    if ("error" in jsondata) {
      return this.onError(jsondata);
    }

    if (this.raw) {
      this.emit("rawMessage", jsondata);
    }

    if (jsondata.length === 1) {
      const message = WebsocketClient.formatHeartbeat(jsondata);
      this.emit("message", message);
    } else if (jsondata.length === 2) {
      const message = WebsocketClient.formatAcknowledge(jsondata);
      this.emit("message", message);
    } else if (jsondata[1] === null && jsondata[0] === 1002) {
      const message = WebsocketClient.formatTicker(jsondata);
      this.emit("message", message);
    } else if (jsondata[1] === null && jsondata[0] === 1003) {
      const message = WebsocketClient.formatVolume(jsondata);
      this.emit("message", message);
    } else if (
      (jsondata[1] === "" || jsondata[1] === null) &&
      jsondata[0] === 1000
    ) {
      const messages = WebsocketClient.formatAccount(jsondata);
      for (const message of messages) {
        this.emit("message", message);
      }
    } else {
      const messages = WebsocketClient.formatUpdate(jsondata);
      for (const message of messages) {
        this.emit("message", message);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onError(error: any): void {
    if (!error) {
      return;
    }
    this.emit("error", error);
  }

  static formatTicker([
    channel_id,
    ,
    [
      currencyPairId,
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen,
      high24hr,
      low24hr
    ]
  ]: RawTickerMessage): WsTicker {
    return {
      subject: "ticker",
      channel_id,
      currencyPairId,
      currencyPair: CurrencyPairs[currencyPairId],
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen: isFrozen ? true : false,
      high24hr,
      low24hr
    };
  }

  static formatVolume([
    channel_id,
    ,
    [time, users, volume]
  ]: RawVolumeMessage): WsVolume {
    return { subject: "volume", channel_id, time, users, volume };
  }

  static formatSnapshot([
    ,
    { currencyPair, orderBook }
  ]: RawSnapshot): WsSnapshot {
    const [asks, bids] = orderBook;
    return { subject: "snapshot", currencyPair, asks, bids };
  }

  static formatPublicTrade([
    ,
    tradeID,
    side,
    price,
    size,
    timestamp
  ]: RawPublicTrade): WsPublicTrade {
    const type = side === 1 ? "buy" : "sell";
    return { subject: "publicTrade", tradeID, type, price, size, timestamp };
  }

  static formatBookUpdate([, side, price, size]: RawBookUpdate): WsBookUpdate {
    const type = side === 1 ? "buy" : "sell";
    return { subject: "update", type, price, size };
  }

  static formatHeartbeat([channel_id]: RawWsHeartbeat): WsHeartbeat {
    return { subject: "heartbeat", channel_id };
  }

  static formatAcknowledge([
    channel_id,
    sequence
  ]: RawAcknowledgement): WsAcknowledgement {
    const subject = sequence ? "subscribed" : "unsubscribed";
    return { subject, channel_id };
  }

  static formatUpdate([
    channel_id,
    sequence,
    messages
  ]: RawPriceAggregatedBook): WsBookMessage[] {
    const output: WsBookMessage[] = [];
    const currencyPair = CurrencyPairs[channel_id];
    for (const message of messages) {
      if (message[0] === "i") {
        const msg = WebsocketClient.formatSnapshot(message);
        output.push({ channel_id, sequence, ...msg });
      } else if (message[0] === "t") {
        const msg = WebsocketClient.formatPublicTrade(message);
        output.push({
          currencyPair,
          channel_id,
          sequence,
          ...msg
        });
      } else {
        const msg = WebsocketClient.formatBookUpdate(message);
        output.push({ currencyPair, channel_id, sequence, ...msg });
      }
    }
    return output;
  }

  static formatPending([
    ,
    orderNumber,
    currencyPairId,
    rate,
    amount,
    type,
    clientOrderId
  ]: RawPendingOrder): WsPendingOrder {
    return {
      subject: "pending",
      orderNumber,
      currencyPairId,
      currencyPair: CurrencyPairs[currencyPairId],
      rate,
      amount,
      type: type === "0" ? "sell" : "buy",
      clientOrderId
    };
  }

  static formatNew([
    ,
    currencyPairId,
    orderNumber,
    type,
    rate,
    amount,
    date,
    originalAmount,
    clientOrderId
  ]: RawNewOrder): WsNewOrder {
    return {
      subject: "new",
      currencyPairId,
      currencyPair: CurrencyPairs[currencyPairId],
      orderNumber,
      type: type === "0" ? "sell" : "buy",
      rate,
      amount,
      date,
      originalAmount,
      clientOrderId
    };
  }

  static formatBalance([, currencyId, w, amount]: RawBalance): WsBalance {
    const wallet = w === "e" ? "exchange" : w === "m" ? "margin" : "lending";
    const currency = Currencies[currencyId];
    return { subject: "balance", currencyId, currency, wallet, amount };
  }

  static formatOrder([
    ,
    orderNumber,
    newAmount,
    t,
    clientOrderId
  ]: RawOrder): WsOrder {
    const subject = "order";
    const orderType =
      t === "f" ? "filled" : t === "c" ? "canceled" : "self-trade";
    return { subject, orderNumber, newAmount, orderType, clientOrderId };
  }

  static formatTrade([
    ,
    tradeID,
    rate,
    amount,
    feeMultiplier,
    fundingType,
    orderNumber,
    fee,
    date,
    clientOrderId
  ]: RawTrade): WsTrade {
    return {
      subject: "trade",
      tradeID,
      rate,
      amount,
      feeMultiplier,
      fundingType,
      orderNumber,
      fee,
      date,
      clientOrderId
    };
  }

  static formatKill([, orderNumber, clientOrderId]: RawKill): WsKill {
    return { subject: "killed", orderNumber, clientOrderId };
  }

  static formatAccount([
    channel_id,
    ,
    messages
  ]: RawAccountMessage): WsAccountMessage[] {
    const output: WsAccountMessage[] = [];
    for (const message of messages) {
      if (message[0] === "p") {
        const msg = WebsocketClient.formatPending(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "n") {
        const msg = WebsocketClient.formatNew(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "b") {
        const msg = WebsocketClient.formatBalance(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "o") {
        const msg = WebsocketClient.formatOrder(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "t") {
        const msg = WebsocketClient.formatTrade(message);
        output.push({ channel_id, ...msg });
      } else {
        const msg = WebsocketClient.formatKill(message);
        output.push({ channel_id, ...msg });
      }
    }
    return output;
  }

  set nonce(nonce: () => number) {
    this._nonce = nonce;
  }

  get nonce(): () => number {
    return this._nonce ? this._nonce : (): number => Date.now();
  }
}
