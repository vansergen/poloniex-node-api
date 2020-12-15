import Websocket from "ws";
import { EventEmitter } from "events";
import { SignRequest, SignedRequest } from "./signer";
import { Currencies } from "./currencies";
import { CurrencyPairs } from "./currencypairs";

export const WsUri = "wss://api2.poloniex.com";
export const DefaultChannels = [121];

export type Channel = number | string;

export interface Subscription {
  command: "subscribe" | "unsubscribe";
  channel: Channel;
}

export interface RawError {
  error: string;
}

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

export type RawMarginUpdate = ["m", number, number, string, string | null];

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
  (
    | RawPendingOrder
    | RawNewOrder
    | RawBalance
    | RawOrder
    | RawMarginUpdate
    | RawTrade
    | RawKill
  )[]
];

export type RawMessage =
  | RawWsHeartbeat
  | RawAcknowledgement
  | RawTickerMessage
  | RawVolumeMessage
  | RawPriceAggregatedBook
  | RawAccountMessage
  | RawError;

export interface BaseMessage {
  channel_id: Channel;
  subject: string;
  sequence?: number | string | null;
}

export interface WsHeartbeat extends BaseMessage {
  channel_id: 1010;
  subject: "heartbeat";
}

export interface WsAcknowledgement extends BaseMessage {
  subject: "subscribed" | "unsubscribed";
}

export interface WsTicker extends BaseMessage {
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
}

export interface WsVolume extends BaseMessage {
  subject: "volume";
  channel_id: 1003;
  time: string;
  users: number;
  volume: { [currency: string]: string };
}

export interface WsSnapshot {
  subject: "snapshot";
  currencyPair: string;
  asks: { [price: string]: string };
  bids: { [price: string]: string };
}

export interface WsPublicTrade {
  subject: "publicTrade";
  tradeID: string;
  type: "buy" | "sell";
  price: string;
  size: string;
  timestamp: number;
}

export interface WsBookUpdate {
  subject: "update";
  type: "bid" | "ask";
  price: string;
  size: string;
}

export type WsBookMessage = BaseMessage & {
  sequence: number;
  currencyPair?: string;
} & (WsSnapshot | WsPublicTrade | WsBookUpdate);

export interface WsPendingOrder {
  subject: "pending";
  orderNumber: number;
  currencyPairId: number;
  currencyPair?: string;
  rate: string;
  amount: string;
  type: "buy" | "sell";
  clientOrderId: string | null;
}

export interface WsNewOrder {
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
}

export interface WsBalance {
  subject: "balance";
  currencyId: number;
  currency?: string;
  wallet: "exchange" | "margin" | "lending";
  amount: string;
}

export interface WsOrder {
  subject: "order";
  orderNumber: number;
  newAmount: string;
  orderType: "filled" | "canceled" | "self-trade";
  clientOrderId: string | null;
}

export interface WsMarginUpdate {
  subject: "margin";
  orderNumber: number;
  currency: string;
  amount: string;
  clientOrderId?: string | null;
}

export interface WsTrade {
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
}

export interface WsKill {
  subject: "killed";
  orderNumber: number;
  clientOrderId: string | null;
}

export type WsAccountMessage = BaseMessage &
  (
    | WsPendingOrder
    | WsNewOrder
    | WsBalance
    | WsOrder
    | WsMarginUpdate
    | WsTrade
    | WsKill
  );

export type WsMessage =
  | WsHeartbeat
  | WsAcknowledgement
  | WsTicker
  | WsVolume
  | WsBookMessage
  | WsAccountMessage;

export interface WebsocketClientOptions {
  wsUri?: string;
  raw?: boolean;
  channels?: Channel[];
  key?: string;
  secret?: string;
}

export declare interface WebsocketClient {
  on(event: "open" | "close", eventListener: () => void): this;
  on(event: "message", eventListener: (data: WsMessage) => void): this;
  on(event: "rawMessage", eventListener: (data: RawMessage) => void): this;
  on(event: "error", eventListener: (error: unknown) => void): this;

  once(event: "open" | "close", eventListener: () => void): this;
  once(event: "message", eventListener: (data: WsMessage) => void): this;
  once(event: "rawMessage", eventListener: (data: RawMessage) => void): this;
  once(event: "error", eventListener: (error: unknown) => void): this;
}

export class WebsocketClient extends EventEmitter {
  readonly #key?: string;
  readonly #secret?: string;
  #nonce: () => number;

  public ws?: Websocket;
  public readonly raw: boolean;
  public readonly channels: Channel[];
  public readonly wsUri: string;

  /**
   * Create WebsocketClient.
   */
  public constructor({
    wsUri = WsUri,
    raw = true,
    channels = DefaultChannels,
    key,
    secret,
  }: WebsocketClientOptions = {}) {
    super();
    this.raw = raw;
    this.channels = channels;
    this.#nonce = (): number => Date.now();
    this.wsUri = wsUri;
    if (key && secret) {
      this.#key = key;
      this.#secret = secret;
    }
  }

  /**
   * Connect to the websocket.
   */
  public async connect(): Promise<void> {
    if (this.ws) {
      switch (this.ws.readyState) {
        case Websocket.CLOSING:
        case Websocket.CONNECTING:
          throw new Error(`Could not connect. State: ${this.ws.readyState}`);
        case Websocket.OPEN:
          return;
        default:
          break;
      }
    }

    await new Promise<void>((resolve, reject) => {
      this.ws = new Websocket(this.wsUri);
      this.ws.once("open", resolve);
      this.ws.on("open", () => {
        this.onOpen().catch(reject);
      });
      this.ws.on("close", this.onClose.bind(this));
      this.ws.on("message", this.onMessage.bind(this));
      this.ws.once("error", reject);
      this.ws.on("error", this.onError.bind(this));
    });
  }

  /**
   * Disconnect from the websocket.
   */
  public async disconnect(): Promise<void> {
    switch (this.ws?.readyState) {
      case Websocket.CLOSED:
        return;
      case Websocket.CLOSING:
      case Websocket.CONNECTING:
        throw new Error(`Could not disconnect. State: ${this.ws.readyState}`);
      default:
        break;
    }

    await new Promise<void>((resolve, reject) => {
      if (!this.ws) {
        resolve();
        return;
      }
      this.ws.once("error", reject);
      this.ws.once("close", resolve);
      this.ws.close();
    });
  }

  /**
   * Subscribes to the specified channel.
   */
  public async subscribe(channel: Channel): Promise<void> {
    await this.send({ command: "subscribe", channel });
  }

  /**
   * Unsubscribes from the specified channel.
   */
  public async unsubscribe(channel: Channel): Promise<void> {
    await this.send({ command: "unsubscribe", channel });
  }

  private async send(subscription: Subscription): Promise<void> {
    const { ws } = this;

    if (!ws) {
      throw new Error("Websocket is not initialized");
    }

    let message = { ...subscription } as Subscription & {
      payload: string;
    } & SignedRequest;

    if (this.#key && this.#secret) {
      const form = new URLSearchParams({ nonce: `${this.nonce()}` });
      const payload = form.toString();
      const signature = SignRequest({
        key: this.#key,
        secret: this.#secret,
        body: payload,
      });
      message = { ...message, payload, ...signature };
    }
    await new Promise<void>((resolve, reject) => {
      ws.send(JSON.stringify(message), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private async onOpen(): Promise<void> {
    this.emit("open");
    try {
      for (const channel of this.channels) {
        await this.subscribe(channel);
      }
    } catch (error) {
      this.onError(error);
    }
  }

  private onClose(): void {
    this.emit("close");
  }

  private onMessage(data: string): void {
    try {
      const jsondata = JSON.parse(data) as RawMessage;
      if ("error" in jsondata) {
        this.onError(jsondata);
        return;
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
    } catch (error) {
      this.onError(error);
    }
  }

  private onError(error: unknown): void {
    if (!error) {
      return;
    }
    this.emit("error", error);
  }

  public static formatTicker([
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
      low24hr,
    ],
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
      low24hr,
    };
  }

  public static formatVolume([
    channel_id,
    ,
    [time, users, volume],
  ]: RawVolumeMessage): WsVolume {
    return { subject: "volume", channel_id, time, users, volume };
  }

  public static formatSnapshot([
    ,
    { currencyPair, orderBook },
  ]: RawSnapshot): WsSnapshot {
    const [asks, bids] = orderBook;
    return { subject: "snapshot", currencyPair, asks, bids };
  }

  public static formatPublicTrade([
    ,
    tradeID,
    side,
    price,
    size,
    timestamp,
  ]: RawPublicTrade): WsPublicTrade {
    const type = side === 1 ? "buy" : "sell";
    return { subject: "publicTrade", tradeID, type, price, size, timestamp };
  }

  public static formatBookUpdate([
    ,
    side,
    price,
    size,
  ]: RawBookUpdate): WsBookUpdate {
    const type = side === 1 ? "bid" : "ask";
    return { subject: "update", type, price, size };
  }

  public static formatHeartbeat([channel_id]: RawWsHeartbeat): WsHeartbeat {
    return { subject: "heartbeat", channel_id };
  }

  public static formatAcknowledge([
    channel_id,
    sequence,
  ]: RawAcknowledgement): WsAcknowledgement {
    const subject = sequence ? "subscribed" : "unsubscribed";
    return { subject, channel_id };
  }

  public static formatUpdate([
    channel_id,
    sequence,
    messages,
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
          ...msg,
        });
      } else {
        const msg = WebsocketClient.formatBookUpdate(message);
        output.push({ currencyPair, channel_id, sequence, ...msg });
      }
    }
    return output;
  }

  public static formatPending([
    ,
    orderNumber,
    currencyPairId,
    rate,
    amount,
    type,
    clientOrderId,
  ]: RawPendingOrder): WsPendingOrder {
    return {
      subject: "pending",
      orderNumber,
      currencyPairId,
      currencyPair: CurrencyPairs[currencyPairId],
      rate,
      amount,
      type: type === "0" ? "sell" : "buy",
      clientOrderId,
    };
  }

  public static formatNew([
    ,
    currencyPairId,
    orderNumber,
    type,
    rate,
    amount,
    date,
    originalAmount,
    clientOrderId,
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
      clientOrderId,
    };
  }

  public static formatBalance([
    ,
    currencyId,
    w,
    amount,
  ]: RawBalance): WsBalance {
    const wallet = w === "e" ? "exchange" : w === "m" ? "margin" : "lending";
    const currency = Currencies[currencyId];
    return { subject: "balance", currencyId, currency, wallet, amount };
  }

  public static formatOrder([
    ,
    orderNumber,
    newAmount,
    t,
    clientOrderId,
  ]: RawOrder): WsOrder {
    const subject = "order";
    const orderType =
      t === "f" ? "filled" : t === "c" ? "canceled" : "self-trade";
    return { subject, orderNumber, newAmount, orderType, clientOrderId };
  }

  public static formatMarginUpdate([
    ,
    orderNumber,
    currency,
    amount,
    clientOrderId,
  ]: RawMarginUpdate): WsMarginUpdate {
    const subject = "margin";
    return {
      subject,
      orderNumber,
      currency: Currencies[currency] ?? `${currency}`,
      amount,
      clientOrderId,
    };
  }

  public static formatTrade([
    ,
    tradeID,
    rate,
    amount,
    feeMultiplier,
    fundingType,
    orderNumber,
    fee,
    date,
    clientOrderId,
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
      clientOrderId,
    };
  }

  public static formatKill([, orderNumber, clientOrderId]: RawKill): WsKill {
    return { subject: "killed", orderNumber, clientOrderId };
  }

  public static formatAccount([
    channel_id,
    ,
    messages,
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
      } else if (message[0] === "m") {
        const msg = WebsocketClient.formatMarginUpdate(message);
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

  public set nonce(nonce: () => number) {
    this.#nonce = nonce;
  }

  public get nonce(): () => number {
    return this.#nonce;
  }
}
