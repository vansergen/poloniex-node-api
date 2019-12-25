import * as Websocket from "ws";
import { EventEmitter } from "events";
import { SignRequest } from "./signer";
import { CurrencyPairs } from "./currencypairs";

export const WsUri = "wss://api2.poloniex.com";
export const DefaultChannels = [121];

export type Channel = number | string;

export type Subscription = {
  command: "subscribe" | "unsubscribe";
  channel: Channel;
};

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

export type RawMessage = RawWsHeartbeat | RawAcknowledgement | RawTickerMessage;

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
  id: number;
  currencyPair: string;
  last: string;
  lowestAsk: string;
  highestBid: string;
  percentChange: string;
  baseVolume: string;
  quoteVolume: string;
  isFrozen: 0 | 1;
  high24hr: string;
  low24hr: string;
};

export type WsMessage = WsHeartbeat | WsAcknowledgement | WsTicker;

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
  on(event: "error", eventListener: (error: any) => void): this;

  once(event: "open", eventListener: () => void): this;
  once(event: "close", eventListener: () => void): this;
  once(event: "message", eventListener: (data: WsMessage) => void): this;
  once(event: "rawMessage", eventListener: (data: RawMessage) => void): this;
  once(event: "error", eventListener: (error: any) => void): this;
}

export class WebsocketClient extends EventEmitter {
  readonly wsUri: string;
  readonly raw: boolean;
  readonly channels: Channel[];
  readonly key?: string;
  readonly secret?: string;
  private socket?: Websocket;
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
          throw new Error("Could not connect. State:" + this.socket.readyState);
      }
    }

    this.socket = new Websocket(this.wsUri);
    this.socket.on("open", this.onOpen.bind(this));
    this.socket.on("close", this.onClose.bind(this));
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
        throw new Error("Could not connect. State: " + this.socket.readyState);
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

  private onError(error: any): void {
    if (!error) {
      return;
    }
    this.emit("error", error);
  }

  static formatTicker([
    channel_id,
    sequence,
    [
      id,
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
      sequence,
      id,
      currencyPair: CurrencyPairs[id],
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen,
      high24hr,
      low24hr
    };
  }

  set nonce(nonce: () => number) {
    this._nonce = nonce;
  }

  get nonce(): () => number {
    return this._nonce ? this._nonce : () => Date.now();
  }
}
