/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { EventEmitter } from "node:events";
import { WebSocket } from "ws";
import { Currencies } from "./currencies.js";
import { CurrencyPairs } from "./currencypairs.js";
import { SignRequest as signRequest, SignedRequest } from "./signer.js";

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
  [string, number, Record<string, string>]
];

export type RawSnapshot = [
  "i",
  {
    currencyPair: string;
    orderBook: [Record<string, string>, Record<string, string>];
  },
  string
];

export type RawPublicTrade = [
  "t",
  string,
  0 | 1,
  string,
  string,
  number,
  string
];

export type RawBookUpdate = ["o", 0 | 1, string, string, string];

export type RawPriceAggregatedBook = [
  Channel,
  number,
  (RawBookUpdate | RawPublicTrade | RawSnapshot)[]
];

export type RawPendingOrder = [
  "p",
  number,
  number,
  string,
  string,
  string,
  string | null,
  string
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

export type RawBalance = ["b", number, "e" | "l" | "m", string];

export type RawOrder = ["o", number, string, "c" | "f" | "s", string | null];

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
  string | null,
  string,
  string
];

export type RawKill = ["k", number, string | null];

export type RawAccountMessage = [
  1000,
  "",
  (
    | RawBalance
    | RawKill
    | RawMarginUpdate
    | RawNewOrder
    | RawOrder
    | RawPendingOrder
    | RawTrade
  )[]
];

export type RawMessage =
  | RawAccountMessage
  | RawAcknowledgement
  | RawError
  | RawPriceAggregatedBook
  | RawTickerMessage
  | RawVolumeMessage
  | RawWsHeartbeat;

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
  currencyPair?: string | undefined;
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
  volume: Record<string, string>;
}

export interface WsSnapshot {
  subject: "snapshot";
  currencyPair: string;
  asks: Record<string, string>;
  bids: Record<string, string>;
  epoch_ms: string;
}

export interface WsPublicTrade {
  subject: "publicTrade";
  tradeID: string;
  type: "buy" | "sell";
  price: string;
  size: string;
  timestamp: number;
  epoch_ms: string;
}

export interface WsBookUpdate {
  subject: "update";
  type: "ask" | "bid";
  price: string;
  size: string;
  epoch_ms: string;
}

export type WsBookMessage = BaseMessage & {
  sequence: number;
  currencyPair?: string | undefined;
} & (WsBookUpdate | WsPublicTrade | WsSnapshot);

export interface WsPendingOrder {
  subject: "pending";
  orderNumber: number;
  currencyPairId: number;
  currencyPair?: string | undefined;
  rate: string;
  amount: string;
  type: "buy" | "sell";
  clientOrderId: string | null;
  epoch_ms: string;
}

export interface WsNewOrder {
  subject: "new";
  currencyPairId: number;
  currencyPair?: string | undefined;
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
  currency?: string | undefined;
  wallet: "exchange" | "lending" | "margin";
  amount: string;
}

export interface WsOrder {
  subject: "order";
  orderNumber: number;
  newAmount: string;
  orderType: "canceled" | "filled" | "self-trade";
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
  total_trade: string;
  epoch_ms: string;
}

export interface WsKill {
  subject: "killed";
  orderNumber: number;
  clientOrderId: string | null;
}

export type WsAccountMessage = BaseMessage &
  (
    | WsBalance
    | WsKill
    | WsMarginUpdate
    | WsNewOrder
    | WsOrder
    | WsPendingOrder
    | WsTrade
  );

export type WsMessage =
  | WsAccountMessage
  | WsAcknowledgement
  | WsBookMessage
  | WsHeartbeat
  | WsTicker
  | WsVolume;

export interface WebSocketClientOptions {
  wsUri?: string;
  raw?: boolean;
  channels?: Channel[];
  key?: string;
  secret?: string;
}

export declare interface WebSocketClient {
  on: ((event: "close" | "open", eventListener: () => void) => this) &
    ((event: "error", eventListener: (error: unknown) => void) => this) &
    ((event: "message", eventListener: (data: WsMessage) => void) => this) &
    ((event: "rawMessage", eventListener: (data: RawMessage) => void) => this);

  once: ((event: "close" | "open", eventListener: () => void) => this) &
    ((event: "error", eventListener: (error: unknown) => void) => this) &
    ((event: "message", eventListener: (data: WsMessage) => void) => this) &
    ((event: "rawMessage", eventListener: (data: RawMessage) => void) => this);
}

export class WebSocketClient extends EventEmitter {
  readonly #key?: string;
  readonly #secret?: string;
  #nonce: () => number;

  public ws?: WebSocket;
  public readonly raw: boolean;
  public readonly channels: Channel[];
  public readonly wsUri: string;

  /** Create WebSocketClient. */
  public constructor({
    wsUri = WsUri,
    raw = true,
    channels = DefaultChannels,
    key,
    secret,
  }: WebSocketClientOptions = {}) {
    super();
    this.raw = raw;
    this.channels = channels;
    this.#nonce = (): number => Date.now();
    this.wsUri = wsUri;
    if (typeof key !== "undefined" && typeof secret !== "undefined") {
      this.#key = key;
      this.#secret = secret;
    }
  }

  /** Connect to the websocket. */
  public async connect(): Promise<void> {
    switch (this.ws?.readyState) {
      case WebSocket.CLOSING:
      case WebSocket.CONNECTING:
        throw new Error(`Could not connect. State: ${this.ws.readyState}`);
      case WebSocket.OPEN:
        return;
      default:
        break;
    }

    await new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.wsUri);
      this.ws
        .once("open", resolve)
        .once("error", reject)
        .on("open", () => {
          this.emit("open");
          for (const channel of this.channels) {
            this.subscribe(channel).catch((error) => {
              this.emit("error", error);
            });
          }
        })
        .on("close", () => {
          this.emit("close");
        })
        .on("message", (data: string) => {
          try {
            const jsondata = JSON.parse(data) as RawMessage;
            if ("error" in jsondata) {
              this.emit("error", jsondata);
              return;
            }

            if (this.raw) {
              this.emit("rawMessage", jsondata);
            }

            if (jsondata.length === 1) {
              const message = WebSocketClient.formatHeartbeat(jsondata);
              this.emit("message", message);
            } else if (jsondata.length === 2) {
              const message = WebSocketClient.formatAcknowledge(jsondata);
              this.emit("message", message);
            } else if (jsondata[1] === null && jsondata[0] === 1002) {
              const message = WebSocketClient.formatTicker(jsondata);
              this.emit("message", message);
            } else if (jsondata[1] === null) {
              const message = WebSocketClient.formatVolume(jsondata);
              this.emit("message", message);
            } else if (jsondata[1] === "") {
              const messages = WebSocketClient.formatAccount(jsondata);
              for (const message of messages) {
                this.emit("message", message);
              }
            } else {
              const messages = WebSocketClient.formatUpdate(jsondata);
              for (const message of messages) {
                this.emit("message", message);
              }
            }
          } catch (error) {
            this.emit("error", error);
          }
        })
        .on("error", (error) => {
          if (typeof error !== "undefined") {
            this.emit("error", error);
          }
        });
    });
  }

  /** Disconnect from the websocket. */
  public async disconnect(): Promise<void> {
    switch (this.ws?.readyState) {
      case WebSocket.CLOSED:
        return;
      case WebSocket.CLOSING:
      case WebSocket.CONNECTING:
        throw new Error(`Could not disconnect. State: ${this.ws.readyState}`);
      default:
        break;
    }

    await new Promise<void>((resolve, reject) => {
      if (this.ws) {
        this.ws.once("error", reject).once("close", resolve).close();
      } else {
        resolve();
      }
    });
  }

  /** Subscribes to the specified channel. */
  public subscribe(channel: Channel): Promise<void> {
    return this.#send({ command: "subscribe", channel });
  }

  /** Unsubscribes from the specified channel. */
  public unsubscribe(channel: Channel): Promise<void> {
    return this.#send({ command: "unsubscribe", channel });
  }

  async #send(subscription: Subscription): Promise<void> {
    const { ws } = this;

    if (!ws) {
      throw new Error("WebSocket is not initialized");
    }

    let message = { ...subscription } as SignedRequest &
      Subscription & {
        payload: string;
      };

    if (
      typeof this.#key !== "undefined" &&
      typeof this.#secret !== "undefined"
    ) {
      const form = new URLSearchParams({ nonce: `${this.nonce()}` });
      const payload = form.toString();
      const signature = signRequest({
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
      currencyPair: (
        CurrencyPairs as Record<string, string | undefined> &
          typeof CurrencyPairs
      )[currencyPairId],
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen: Boolean(isFrozen),
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
    epoch_ms,
  ]: RawSnapshot): WsSnapshot {
    const [asks, bids] = orderBook;
    return { subject: "snapshot", currencyPair, asks, bids, epoch_ms };
  }

  public static formatPublicTrade([
    ,
    tradeID,
    side,
    price,
    size,
    timestamp,
    epoch_ms,
  ]: RawPublicTrade): WsPublicTrade {
    return {
      subject: "publicTrade",
      tradeID,
      type: side === 1 ? "buy" : "sell",
      price,
      size,
      timestamp,
      epoch_ms,
    };
  }

  public static formatBookUpdate([
    ,
    side,
    price,
    size,
    epoch_ms,
  ]: RawBookUpdate): WsBookUpdate {
    const type = side === 1 ? "bid" : "ask";
    return { subject: "update", type, price, size, epoch_ms };
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
    const currencyPair = (
      CurrencyPairs as Record<string, string | undefined> & typeof CurrencyPairs
    )[channel_id];
    for (const message of messages) {
      if (message[0] === "i") {
        const msg = WebSocketClient.formatSnapshot(message);
        output.push({ channel_id, sequence, ...msg });
      } else if (message[0] === "t") {
        const msg = WebSocketClient.formatPublicTrade(message);
        output.push({
          currencyPair,
          channel_id,
          sequence,
          ...msg,
        });
      } else {
        const msg = WebSocketClient.formatBookUpdate(message);
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
    epoch_ms,
  ]: RawPendingOrder): WsPendingOrder {
    return {
      subject: "pending",
      orderNumber,
      currencyPairId,
      currencyPair: (
        CurrencyPairs as Record<string, string | undefined> &
          typeof CurrencyPairs
      )[currencyPairId],
      rate,
      amount,
      type: type === "0" ? "sell" : "buy",
      clientOrderId,
      epoch_ms,
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
      currencyPair: (
        CurrencyPairs as Record<string, string | undefined> &
          typeof CurrencyPairs
      )[currencyPairId],
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
    const currency = (
      Currencies as Record<string, string | undefined> & typeof Currencies
    )[currencyId];
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
      currency:
        (Currencies as Record<string, string | undefined> & typeof Currencies)[
          currency
        ] ?? `${currency}`,
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
    total_trade,
    epoch_ms,
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
      total_trade,
      epoch_ms,
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
        const msg = WebSocketClient.formatPending(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "n") {
        const msg = WebSocketClient.formatNew(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "b") {
        const msg = WebSocketClient.formatBalance(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "o") {
        const msg = WebSocketClient.formatOrder(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "m") {
        const msg = WebSocketClient.formatMarginUpdate(message);
        output.push({ channel_id, ...msg });
      } else if (message[0] === "t") {
        const msg = WebSocketClient.formatTrade(message);
        output.push({ channel_id, ...msg });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (message[0] === "k") {
        const msg = WebSocketClient.formatKill(message);
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
