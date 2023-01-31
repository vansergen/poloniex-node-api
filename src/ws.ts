import { EventEmitter } from "node:events";
import { WebSocket } from "ws";
import { DefaultSymbol } from "./public.js";
import {
  ISide,
  IOrderType,
  IAccountType,
  IOrderSource,
  IMatchRole,
  IOrderState,
} from "./auth.js";
import { signature } from "./signature.js";

export class WSAbort extends Error {
  public constructor(msg: string, cause?: Event) {
    super(msg, { cause });
    this.name = "AbortError";
  }
}

export const WebSocketURL = "wss://ws.poloniex.com/ws/";

export type IWSType = "private" | "public";

interface ISignal {
  signal?: AbortSignal | null | undefined;
}

interface IListenersOptions<T extends IMessage = IMessage> extends ISignal {
  predicate: (message: IMessage) => message is T;
}

interface IEvent {
  event: string;
}

interface IBaseAuthMessage {
  data: { success: boolean; ts: number; message?: string };
  channel: "auth";
}

export interface IFailedAuth extends IBaseAuthMessage {
  data: IBaseAuthMessage["data"] & { success: false; message: string };
}

export interface ISuccessAuth extends IBaseAuthMessage {
  data: IBaseAuthMessage["data"] & { success: true };
}

export interface IPong extends IEvent {
  event: "pong";
}

export type ICandlesChannel =
  | "candles_day_1"
  | "candles_day_3"
  | "candles_hour_1"
  | "candles_hour_2"
  | "candles_hour_4"
  | "candles_hour_6"
  | "candles_hour_12"
  | "candles_minute_1"
  | "candles_minute_5"
  | "candles_minute_10"
  | "candles_minute_15"
  | "candles_minute_30"
  | "candles_month_1"
  | "candles_week_1";

interface ISymbols extends ISignal {
  symbols?: string[] | string | undefined;
}

interface ISubscriptionOptions extends ISymbols {
  event: "subscribe" | "unsubscribe";
  channel: IChannel;
  data?: Record<string, unknown>;
}

interface IBookOptions extends ISymbols {
  depth?: 5 | 10 | 20;
}

interface ISubscribeCandlesOptions extends ISymbols {
  channel: ICandlesChannel;
}

export type IPublicChannel =
  | ICandlesChannel
  | "book_lv2"
  | "book"
  | "ticker"
  | "trades";

export type IPrivateChannel = "auth" | "balances" | "orders";

export type IChannel = IPrivateChannel | IPublicChannel;

export interface ISubscribeEvent<T extends IChannel = IChannel> extends IEvent {
  event: "subscribe";
  channel: T;
  symbols?: string[];
}

export interface IUnsubscribeEvent<T extends IChannel = IChannel>
  extends IEvent {
  event: "unsubscribe";
  channel: T;
}

type ISubscription = ISubscribeEvent | IUnsubscribeEvent;

export interface IUnsubscribeAll extends IEvent {
  event: "unsubscribe_all";
  channel: "all";
}

export interface ISubscriptions {
  subscriptions: IChannel[];
}

export interface IErrorMessage extends IEvent {
  message: string;
}

export interface IWSCandle {
  channel: ICandlesChannel;
  data: [
    {
      symbol: string;
      amount: string;
      high: string;
      quantity: string;
      tradeCount: number;
      low: string;
      closeTime: number;
      startTime: number;
      close: string;
      open: string;
      ts: number;
    }
  ];
}

export interface IWSTrade {
  channel: "trades";
  data: [
    {
      symbol: string;
      amount: string;
      takerSide: Lowercase<ISide>;
      quantity: string;
      createTime: number;
      price: string;
      id: number;
      ts: number;
    }
  ];
}

export interface IWSTicker {
  channel: "ticker";
  data: [
    {
      symbol: string;
      dailyChange: string;
      high: string;
      amount: string;
      quantity: string;
      tradeCount: number;
      low: string;
      closeTime: number;
      startTime: number;
      close: string;
      open: string;
      ts: number;
      markPrice: string;
    }
  ];
}

export interface IBookData {
  symbol: string;
  createTime: number;
  asks: [string, string][];
  bids: [string, string][];
  id: number;
  ts: number;
}

export interface IBook {
  channel: "book";
  data: [
    {
      symbol: string;
      createTime: number;
      asks: [string, string][];
      bids: [string, string][];
      id: number;
      ts: number;
    }
  ];
}

interface IBookUpdate {
  symbol: string;
  asks: [string, string][];
  bids: [string, string][];
  createTime: number;
  lastId: number;
  id: number;
  ts: number;
}

export interface IBookLv2Snapshot {
  channel: "book_lv2";
  action: "snapshot";
  data: [IBookUpdate];
}

export interface IBookLv2Update extends Omit<IBookLv2Snapshot, "action"> {
  action: "update";
}

export type IBookLv2 = IBookLv2Snapshot | IBookLv2Update;

export type IPublicMessage =
  | IBook
  | IBookLv2Snapshot
  | IBookLv2Update
  | ISubscriptions
  | IUnsubscribeAll
  | IWSCandle
  | IWSTicker
  | IWSTrade;

export type IOrderEventType = "canceled" | "place" | "trade";

export interface IWSOrder {
  channel: "orders";
  data: [
    {
      symbol: string;
      type: IOrderType;
      quantity: string;
      orderId: string;
      tradeFee: string;
      clientOrderId: string;
      accountType: IAccountType;
      feeCurrency: string;
      eventType: IOrderEventType;
      source: IOrderSource;
      side: ISide;
      filledQuantity: string;
      filledAmount: string;
      matchRole: IMatchRole | "";
      state: IOrderState;
      tradeTime: number;
      tradeAmount: string;
      orderAmount: string;
      createTime: number;
      price: string;
      tradeQty: string;
      tradePrice: string;
      tradeId: string;
      ts: number;
    }
  ];
}

type IBalanceEventType =
  | "canceled_order"
  | "deposit"
  | "match_order"
  | "place_order"
  | "transfer_in"
  | "transfer_out"
  | "withdraw";

export interface IWSBalance {
  channel: "balances";
  data: [
    {
      changeTime: number;
      accountId: string;
      accountType: IAccountType;
      eventType: IBalanceEventType;
      available: string;
      currency: string;
      id: number;
      userId: number;
      hold: string;
      ts: number;
    }
  ];
}

export type IPrivateMessage =
  | IFailedAuth
  | ISuccessAuth
  | IWSBalance
  | IWSOrder;

export type IMessage =
  | IPong
  | IPrivateMessage
  | IPublicMessage
  | ISubscribeEvent
  | IUnsubscribeEvent;

export interface IWebSocketClientOptions {
  ws_url?: URL | string | undefined;
  symbol?: string | undefined;
  key?: string | undefined;
  secret?: string | undefined;
  signTimestamp?: () => string;
}

export class WebSocketClient extends EventEmitter {
  readonly #ws_url: URL;
  readonly #symbol: string;
  readonly #auth: { key: string; secret: string } | null;
  readonly #signTimestamp: () => string;
  #public_ws: WebSocket | null;
  #private_ws: WebSocket | null;

  /** Create WebSocketClient. */
  public constructor({
    ws_url = WebSocketURL,
    symbol = DefaultSymbol,
    signTimestamp = (): string => Date.now().toString(),
    key,
    secret,
  }: IWebSocketClientOptions = {}) {
    super();
    this.#ws_url = new URL(ws_url);
    this.#public_ws = null;
    this.#private_ws = null;
    this.#symbol = symbol;
    this.#signTimestamp = signTimestamp;
    if (typeof key === "string" && typeof secret === "string") {
      this.#auth = { key, secret };
    } else {
      this.#auth = null;
    }
  }

  public get symbol(): string {
    return this.#symbol;
  }

  /** Public WebSocket */
  public get public_ws(): WebSocket | null {
    return this.#public_ws;
  }

  /** Private WebSocket */
  public get private_ws(): WebSocket | null {
    return this.#private_ws;
  }

  /** Connect to the public websocket. */
  public connectPublicWS(): Promise<void> {
    return this.#connectWS("public");
  }

  /** Connect to the private websocket. */
  public connectPrivateWS(): Promise<void> {
    return this.#connectWS("private");
  }

  /** Disconnect from the public websocket. */
  public disconnectPublicWS(): Promise<void> {
    return WebSocketClient.#disconnectWS(this.#public_ws);
  }

  /** Disconnect from the private websocket. */
  public disconnectPrivateWS(): Promise<void> {
    return WebSocketClient.#disconnectWS(this.#private_ws);
  }

  /** Send a ping message to the public server. */
  public pingPublic({ signal }: ISignal = {}): Promise<IPong> {
    return this.#ping("public", { signal });
  }

  /** Send a ping message to the private server. */
  public pingPrivate({ signal }: ISignal = {}): Promise<IPong> {
    return this.#ping("private", { signal });
  }

  /** Unsubscribe from all public channels. */
  public unsubscribePublic({ signal }: ISignal = {}): Promise<IUnsubscribeAll> {
    return this.#unsubscribeAll("public", { signal });
  }

  /** Unsubscribe from all public channels. */
  public unsubscribePrivate({
    signal,
  }: ISignal = {}): Promise<IUnsubscribeAll> {
    return this.#unsubscribeAll("private", { signal });
  }

  /** Get the list of current public subscriptions. */
  public getPublicSubscriptions({
    signal,
  }: ISignal = {}): Promise<ISubscriptions> {
    return this.#getSubscriptions("public", { signal });
  }

  /** Get the list of current private subscriptions. */
  public getPrivateSubscriptions({
    signal,
  }: ISignal = {}): Promise<ISubscriptions> {
    return this.#getSubscriptions("private", { signal });
  }

  /** Subscribe to the `channel` (candles). */
  public subscribeCandles({
    channel,
    signal,
    symbols = [this.#symbol],
  }: ISubscribeCandlesOptions): Promise<ISubscribeEvent<ICandlesChannel>> {
    return this.#sendSubscription<ISubscribeEvent<ICandlesChannel>>("public", {
      event: "subscribe",
      signal,
      symbols,
      channel,
    });
  }

  /** Unsubscribe from the `channel` (candles). */
  public unsubscribeCandles({
    channel,
    signal,
    symbols = this.#symbol,
  }: ISubscribeCandlesOptions): Promise<IUnsubscribeEvent<ICandlesChannel>> {
    return this.#sendSubscription<IUnsubscribeEvent<ICandlesChannel>>(
      "public",
      { event: "unsubscribe", signal, symbols, channel }
    );
  }

  /** Subscribe to the `trades` channel. */
  public subscribeTrades({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<ISubscribeEvent<"trades">> {
    return this.#sendSubscription<ISubscribeEvent<"trades">>("public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "trades",
    });
  }

  /** Unsubscribe from the `trades` channel. */
  public unsubscribeTrades({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<IUnsubscribeEvent<"trades">> {
    return this.#sendSubscription<IUnsubscribeEvent<"trades">>("public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "trades",
    });
  }

  /** Subscribe to the `ticker` channel. */
  public subscribeTicker({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<ISubscribeEvent<"ticker">> {
    return this.#sendSubscription<ISubscribeEvent<"ticker">>("public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "ticker",
    });
  }

  /** Unsubscribe from the `ticker` channel. */
  public unsubscribeTicker({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<IUnsubscribeEvent<"ticker">> {
    return this.#sendSubscription<IUnsubscribeEvent<"ticker">>("public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "ticker",
    });
  }

  /** Subscribe to the `book` channel. */
  public subscribeBook({
    signal,
    symbols = this.#symbol,
    depth = 5,
  }: IBookOptions = {}): Promise<ISubscribeEvent<"book">> {
    return this.#sendSubscription<ISubscribeEvent<"book">>("public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "book",
      data: { depth },
    });
  }

  /** Unsubscribe from the `book` channel. */
  public unsubscribeBook({
    signal,
    symbols = this.#symbol,
  }: IBookOptions = {}): Promise<IUnsubscribeEvent<"book">> {
    return this.#sendSubscription<IUnsubscribeEvent<"book">>("public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "book",
    });
  }

  /** Subscribe to the `book_lv2` channel. */
  public subscribeLv2Book({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<ISubscribeEvent<"book_lv2">> {
    return this.#sendSubscription<ISubscribeEvent<"book_lv2">>("public", {
      event: "subscribe",
      signal,
      symbols,
      channel: "book_lv2",
    });
  }

  /** Unsubscribe from the `book_lv2` channel. */
  public unsubscribeLv2Book({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<IUnsubscribeEvent<"book_lv2">> {
    return this.#sendSubscription<IUnsubscribeEvent<"book_lv2">>("public", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "book_lv2",
    });
  }

  /** Authenticate to the private websocket. */
  public async auth({ signal }: ISignal = {}): Promise<ISuccessAuth> {
    if (!this.#auth) {
      throw new Error("Auth credintials are missing");
    }

    const signTimestamp = this.#signTimestamp();
    const searchParams = new URLSearchParams({ signTimestamp });
    const path = "/ws";

    const method = "GET";
    const params = signature({
      method,
      searchParams,
      signTimestamp,
      path,
      key: this.#auth.key,
      secret: this.#auth.secret,
    });

    const payload = { event: "subscribe", channel: ["auth"], params };
    const predicate = (
      message: IMessage
    ): message is IFailedAuth | ISuccessAuth =>
      "channel" in message && message.channel === "auth";

    const result = await this.#send("private", payload, { predicate, signal });
    if (!result.data.success) {
      throw new Error(result.data.message, { cause: result });
    }

    return result as ISuccessAuth;
  }

  /** Subscribe to the `orders` channel. */
  public subscribeOrders({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<ISubscribeEvent<"orders">> {
    return this.#sendSubscription<ISubscribeEvent<"orders">>("private", {
      event: "subscribe",
      signal,
      symbols,
      channel: "orders",
    });
  }

  /** Unsubscribe from the `orders` channel. */
  public unsubscribeOrders({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): Promise<IUnsubscribeEvent<"orders">> {
    return this.#sendSubscription<IUnsubscribeEvent<"orders">>("private", {
      event: "unsubscribe",
      signal,
      symbols,
      channel: "orders",
    });
  }

  /** Subscribe to the `balances` channel. */
  public subscribeBalances({ signal }: ISymbols = {}): Promise<
    ISubscribeEvent<"balances">
  > {
    return this.#sendSubscription<ISubscribeEvent<"balances">>("private", {
      event: "subscribe",
      signal,
      channel: "balances",
    });
  }

  /** Unsubscribe from the `balances` channel. */
  public unsubscribeBalances({ signal }: ISymbols = {}): Promise<
    IUnsubscribeEvent<"balances">
  > {
    return this.#sendSubscription<IUnsubscribeEvent<"balances">>("private", {
      event: "unsubscribe",
      signal,
      channel: "balances",
    });
  }

  public async *candles({
    channel,
    signal,
    symbols = this.symbol,
  }: ISubscribeCandlesOptions): AsyncGenerator<IWSCandle> {
    await this.subscribeCandles({ channel, signal, symbols });
    const predicate = (message: IMessage): message is IWSCandle =>
      "channel" in message && message.channel === channel && "data" in message;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await this.#send<IWSCandle>("public", null, { predicate, signal });
    }
  }

  public async *trades({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): AsyncGenerator<IWSTrade> {
    await this.subscribeTrades({ signal, symbols });
    const predicate = (message: IMessage): message is IWSTrade =>
      "channel" in message && message.channel === "trades" && "data" in message;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await this.#send<IWSTrade>("public", null, { predicate, signal });
    }
  }

  public async *tickers({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): AsyncGenerator<IWSTicker> {
    await this.subscribeTicker({ signal, symbols });
    const predicate = (message: IMessage): message is IWSTicker =>
      "channel" in message && message.channel === "ticker" && "data" in message;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await this.#send<IWSTicker>("public", null, { predicate, signal });
    }
  }

  public async *books({
    signal,
    symbols = this.#symbol,
    depth = 5,
  }: IBookOptions = {}): AsyncGenerator<IBook> {
    await this.subscribeBook({ signal, symbols, depth });
    const predicate = (message: IMessage): message is IBook =>
      "channel" in message && message.channel === "book" && "data" in message;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await this.#send<IBook>("public", null, { predicate, signal });
    }
  }

  public async *booksLv2({
    signal,
    symbols = this.#symbol,
  }: IBookOptions = {}): AsyncGenerator<IBookLv2> {
    await this.subscribeLv2Book({ signal, symbols });
    const predicate = (message: IMessage): message is IBookLv2 =>
      "channel" in message &&
      message.channel === "book_lv2" &&
      "data" in message;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await this.#send<IBookLv2>("public", null, { predicate, signal });
    }
  }

  public async *orders({
    signal,
    symbols = this.#symbol,
  }: ISymbols = {}): AsyncGenerator<IWSOrder> {
    await this.subscribeOrders({ signal, symbols });
    const predicate = (message: IMessage): message is IWSOrder =>
      "channel" in message && message.channel === "orders" && "data" in message;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await this.#send<IWSOrder>("private", null, { predicate, signal });
    }
  }

  public async *balances({
    signal,
  }: ISymbols = {}): AsyncGenerator<IWSBalance> {
    await this.subscribeBalances({ signal });
    const predicate = (message: IMessage): message is IWSBalance =>
      "channel" in message &&
      message.channel === "balances" &&
      "data" in message;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield await this.#send<IWSBalance>("private", null, {
        predicate,
        signal,
      });
    }
  }

  /** Send a message to the WebSocket server */
  public send(payload: Record<string, unknown>, type: IWSType): Promise<void> {
    const ws = type === "private" ? this.#private_ws : this.#public_ws;

    if (!ws) {
      return Promise.reject(new Error("Websocket is not connected"));
    }

    return new Promise((resolve, reject) => {
      ws.send(JSON.stringify(payload), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  #send<T extends IMessage = IMessage>(
    type: IWSType,
    payload: Record<string, unknown> | null,
    { predicate, signal }: IListenersOptions<T>
  ): Promise<T> {
    return new Promise<T>((resolve, reject): void => {
      const ws = type === "private" ? this.#private_ws : this.#public_ws;

      if (!ws) {
        reject(new Error("Websocket is not connected"));
        return;
      }

      const aborted = signal?.aborted ?? false;
      const use_abort = signal instanceof AbortSignal && !aborted;

      const listeners = {
        message: (message: IMessage, ws_type: IWSType): void => {
          if (ws_type === type && predicate(message)) {
            listeners.remove_listeners();

            resolve(message);
          }
        },

        close: (ws_type: IWSType): void => {
          if (ws_type === type) {
            listeners.remove_listeners();

            reject(new Error("WebSocket connection has been closed"));
          }
        },

        error: (error: unknown, ws_type: IWSType): void => {
          if (ws_type === type) {
            listeners.remove_listeners();

            reject(error);
          }
        },

        abort: (event: Event): void => {
          listeners.remove_listeners();

          reject(new WSAbort("The request has been aborted", event));
        },

        add_listeners: (): void => {
          this.on("error", listeners.error)
            .on("close", listeners.close)
            .on("message", listeners.message);
        },

        remove_listeners: (): void => {
          this.off("message", listeners.message)
            .off("error", listeners.error)
            .off("close", listeners.close);

          if (use_abort) {
            signal.removeEventListener("abort", listeners.abort);
          }
        },
      };

      if (use_abort) {
        signal.addEventListener("abort", listeners.abort, { once: true });
      }

      if (payload) {
        ws.send(JSON.stringify(payload), (error) => {
          if (error) {
            if (use_abort) {
              signal.removeEventListener("abort", listeners.abort);
            }

            reject(error);
          } else if (!use_abort || !signal.aborted) {
            listeners.add_listeners();
          }
        });
      } else {
        listeners.add_listeners();
      }
    });
  }

  #sendSubscription<T extends ISubscription = ISubscription>(
    type: IWSType,
    { event, channel, signal, symbols, data = {} }: ISubscriptionOptions
  ): Promise<T> {
    const predicate = (message: IMessage): message is T =>
      "event" in message &&
      message.event === event &&
      message.channel === channel;

    const payload: Record<string, unknown> = {
      event,
      channel: [channel],
      ...data,
    };

    if (typeof symbols !== "undefined") {
      payload.symbols = Array.isArray(symbols) ? symbols : [symbols];
    }

    return this.#send<T>(type, payload, { predicate, signal });
  }

  #ping(type: IWSType, { signal }: ISignal = {}): Promise<IPong> {
    const msg = { event: "ping" };
    const predicate = (message: IMessage): message is IPong =>
      "event" in message && message.event === "pong";

    return this.#send<IPong>(type, msg, { predicate, signal });
  }

  #unsubscribeAll(
    type: IWSType,
    { signal }: ISignal = {}
  ): Promise<IUnsubscribeAll> {
    const msg = { event: "unsubscribe_all" };
    const predicate = (message: IMessage): message is IUnsubscribeAll =>
      "event" in message && message.event === "unsubscribe_all";

    return this.#send<IUnsubscribeAll>(type, msg, { predicate, signal });
  }

  #getSubscriptions(
    type: IWSType,
    { signal }: ISignal = {}
  ): Promise<ISubscriptions> {
    const msg = { event: "list_subscriptions" };
    const predicate = (message: IMessage): message is ISubscriptions =>
      "subscriptions" in message;

    return this.#send<ISubscriptions>(type, msg, { predicate, signal });
  }

  #connectWS(type: IWSType): Promise<void> {
    const ws = type === "private" ? this.#private_ws : this.#public_ws;
    const url = new URL(type, this.#ws_url.toString());

    switch (ws?.readyState) {
      case WebSocket.CLOSING:
      case WebSocket.CONNECTING:
        return Promise.reject(
          new Error(`Could not connect. State: ${ws.readyState}`)
        );
      case WebSocket.OPEN:
        return Promise.resolve();
      default:
        break;
    }

    return new Promise<void>((resolve, reject) => {
      const socket = new WebSocket(url)
        .once("open", resolve)
        .once("error", reject)
        .on("open", () => {
          this.emit("open", type);
        })
        .once("close", () => {
          this.emit("close", type);
        })
        .on("message", (data: string) => {
          try {
            const jsondata = JSON.parse(data) as IErrorMessage | IMessage;

            if ("event" in jsondata && jsondata.event === "error") {
              this.emit(
                "error",
                new Error(jsondata.message, { cause: jsondata }),
                type
              );

              return;
            }

            this.emit("message", jsondata, type);
          } catch (error) {
            this.emit(
              "error",
              new Error("Message count not be parsed by `JSON.parse`", {
                cause: error,
              }),
              type
            );
          }
        })
        .on("error", (error) => {
          if (typeof error !== "undefined") {
            this.emit("error", error, type);
          }
        });

      if (type === "private") {
        this.#private_ws = socket;
      } else {
        this.#public_ws = socket;
      }
    });
  }

  static #disconnectWS(ws: WebSocket | null): Promise<void> {
    if (!ws) {
      return Promise.resolve();
    }

    switch (ws.readyState) {
      case WebSocket.CLOSED:
        return Promise.resolve();
      case WebSocket.CLOSING:
      case WebSocket.CONNECTING:
        return Promise.reject(
          new Error(`Could not disconnect. State: ${ws.readyState}`)
        );
      default:
        break;
    }

    return new Promise<void>((resolve, reject) => {
      const listeners = {
        close: (): void => {
          ws.off("error", listeners.error);
          resolve();
        },

        error: (error: unknown): void => {
          ws.off("close", listeners.close);
          reject(error);
        },
      };

      ws.once("error", listeners.error).once("close", listeners.close).close();
    });
  }
}
