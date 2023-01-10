import { deepStrictEqual, ok, rejects } from "node:assert";
import {
  WebSocketClient,
  WsUri,
  DefaultChannels,
  SignRequest,
  RawTickerMessage,
  WsTicker,
  RawVolumeMessage,
  WsVolume,
  RawSnapshot,
  WsSnapshot,
  RawPublicTrade,
  WsPublicTrade,
  RawBookUpdate,
  WsBookUpdate,
  RawWsHeartbeat,
  WsHeartbeat,
  RawAcknowledgement,
  WsAcknowledgement,
  RawPriceAggregatedBook,
  WsBookMessage,
  RawPendingOrder,
  WsPendingOrder,
  RawNewOrder,
  WsNewOrder,
  RawBalance,
  WsBalance,
  RawOrder,
  WsOrder,
  RawMarginUpdate,
  WsMarginUpdate,
  RawTrade,
  WsTrade,
  RawKill,
  WsKill,
  RawAccountMessage,
  WsAccountMessage,
  Currencies,
} from "../index.js";
import { WebSocketServer, WebSocket } from "ws";

const port = 10010;
const wsUri = `ws://localhost:${port}`;

suite("WebSocketClient", () => {
  let client: WebSocketClient;
  let server: WebSocketServer;

  setup(() => {
    server = new WebSocketServer({ port });
    client = new WebSocketClient({ wsUri });
  });

  teardown(async () => {
    server.clients?.forEach((c) => c.close());
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  test("constructor", () => {
    const key = "poloniexapikey";
    const secret = "poloniexapisecret";
    const channels = [] as number[];
    const raw = false;
    const websocket = new WebSocketClient({ key, secret, raw, channels });
    deepStrictEqual(websocket.channels, channels);
    deepStrictEqual(websocket.wsUri, WsUri);
    deepStrictEqual(websocket.raw, raw);
  });

  test(".nonce()", () => {
    const nonce = client.nonce();
    ok(Date.now() - nonce < 10);
  });

  test("constructor (with no arguments)", () => {
    const websocket = new WebSocketClient();
    deepStrictEqual(websocket.channels, DefaultChannels);
    deepStrictEqual(websocket.wsUri, WsUri);
    deepStrictEqual(websocket.raw, true);
  });

  test(".connect() (subscribes to the default channel)", async () => {
    deepStrictEqual(client.wsUri, wsUri);

    const connection = new Promise<void>((resolve, reject) => {
      server.once("connection", (ws) => {
        ws.once("message", (data: string) => {
          try {
            const [channel] = DefaultChannels;
            const command = "subscribe";
            deepStrictEqual(JSON.parse(data), { command, channel });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    });

    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
    await connection;
  });

  test(".connect() (when `readyState` is `OPEN`)", async () => {
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
  });

  test(".connect() (when `readyState` is `CONNECTING`)", async () => {
    const connect = client.connect();
    const error = new Error("Could not connect. State: 0");
    deepStrictEqual(client.ws?.readyState, WebSocket.CONNECTING);
    await rejects(client.connect(), error);
    await connect;
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
  });

  test(".connect() (when `readyState` is `CLOSING`)", async () => {
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
    const disconnect = client.disconnect();
    const error = new Error("Could not connect. State: 2");
    deepStrictEqual(client.ws?.readyState, WebSocket.CLOSING);
    await rejects(client.connect(), error);
    await disconnect;
  });

  test(".connect() (when `readyState` is `CLOSED`)", async () => {
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
    await client.disconnect();
    deepStrictEqual(client.ws?.readyState, WebSocket.CLOSED);
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
  });

  test(".disconnect()", async () => {
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
    await client.disconnect();
    deepStrictEqual(client.ws?.readyState, WebSocket.CLOSED);
  });

  test(".disconnect() (when socket is not initialized)", async () => {
    ok(typeof client.ws === "undefined");
    await client.disconnect();
    ok(typeof client.ws === "undefined");
  });

  test(".disconnect() (when `readyState` is `CLOSED`)", async () => {
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
    await client.disconnect();
    deepStrictEqual(client.ws?.readyState, WebSocket.CLOSED);
    await client.disconnect();
    deepStrictEqual(client.ws?.readyState, WebSocket.CLOSED);
  });

  test(".disconnect() (when `readyState` is `CONNECTING`)", async () => {
    const connect = client.connect();
    const error = new Error("Could not disconnect. State: 0");
    deepStrictEqual(client.ws?.readyState, WebSocket.CONNECTING);
    await rejects(client.disconnect(), error);
    await connect;
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
  });

  test(".disconnect() (when `readyState` is `CLOSING`)", async () => {
    await client.connect();
    deepStrictEqual(client.ws?.readyState, WebSocket.OPEN);
    const disconnect = client.disconnect();
    const error = new Error("Could not disconnect. State: 2");
    deepStrictEqual(client.ws?.readyState, WebSocket.CLOSING);
    await rejects(client.disconnect(), error);
    await disconnect;
    deepStrictEqual(client.ws?.readyState, WebSocket.CLOSED);
  });

  test(".subscribe()", async () => {
    const channelToSubscribe = 1003;
    const [channel] = DefaultChannels;
    const connection = new Promise<void>((resolve) => {
      server.once("connection", (ws) => {
        const command = "subscribe";
        ws.once("message", (message: string) => {
          deepStrictEqual(JSON.parse(message), { command, channel });
          ws.once("message", (data: string) => {
            deepStrictEqual(JSON.parse(data), {
              command,
              channel: channelToSubscribe,
            });
            resolve();
          });
        });
      });
    });
    await client.connect();
    await client.subscribe(channelToSubscribe);
    await connection;
  });

  test(".subscribe() (when WebSocket is not open)", async () => {
    const message = "WebSocket is not open: readyState 3 (CLOSED)";
    await client.connect();
    await client.disconnect();

    await rejects(client.subscribe(1000), new Error(message));
  });

  test(".subscribe() (when `socket` is not initialized)", async () => {
    const error = new Error("WebSocket is not initialized");
    await rejects(client.subscribe(1002), error);
  });

  test(".unsubscribe()", async () => {
    const [channel] = DefaultChannels;
    const connection = new Promise<void>((resolve) => {
      server.once("connection", (ws) => {
        const command = "subscribe";
        ws.once("message", (message: string) => {
          deepStrictEqual(JSON.parse(message), { command, channel });
          ws.once("message", (data: string) => {
            deepStrictEqual(JSON.parse(data), {
              command: "unsubscribe",
              channel,
            });
            resolve();
          });
        });
      });
    });
    await client.connect();
    await client.unsubscribe(channel);
    await connection;
  });

  test(".unsubscribe() (when WebSocket is not open)", async () => {
    const key = "poloniex-api-key";
    const secret = "poloniex-api-secret";
    const message = "WebSocket is not open: readyState 3 (CLOSED)";
    const authClient = new WebSocketClient({ wsUri, key, secret });
    const nonce = 1;
    authClient.nonce = (): number => nonce;
    await authClient.connect();
    await authClient.disconnect();
    await rejects(authClient.unsubscribe(1000), new Error(message));
  });

  suite("Formatters", () => {
    test(".formatTicker()", () => {
      const rawTicker: RawTickerMessage = [
        1002,
        null,
        [
          150,
          "0.00000098",
          "0.00000099",
          "0.00000098",
          "0.01030927",
          "23.24910068",
          "23685243.40788439",
          0,
          "0.00000100",
          "0.00000096",
        ],
      ];
      const expectedTicker: WsTicker = {
        subject: "ticker",
        channel_id: 1002,
        currencyPairId: 150,
        currencyPair: "BTC_SC",
        last: "0.00000098",
        lowestAsk: "0.00000099",
        highestBid: "0.00000098",
        percentChange: "0.01030927",
        baseVolume: "23.24910068",
        quoteVolume: "23685243.40788439",
        isFrozen: false,
        high24hr: "0.00000100",
        low24hr: "0.00000096",
      };
      const ticker = WebSocketClient.formatTicker(rawTicker);
      deepStrictEqual(ticker, expectedTicker);
    });

    test(".formatTicker() (`isFrozen` is true)", () => {
      const rawTicker: RawTickerMessage = [
        1002,
        null,
        [
          150,
          "0.00000098",
          "0.00000099",
          "0.00000098",
          "0.01030927",
          "23.24910068",
          "23685243.40788439",
          1,
          "0.00000100",
          "0.00000096",
        ],
      ];
      const expectedTicker: WsTicker = {
        subject: "ticker",
        channel_id: 1002,
        currencyPairId: 150,
        currencyPair: "BTC_SC",
        last: "0.00000098",
        lowestAsk: "0.00000099",
        highestBid: "0.00000098",
        percentChange: "0.01030927",
        baseVolume: "23.24910068",
        quoteVolume: "23685243.40788439",
        isFrozen: true,
        high24hr: "0.00000100",
        low24hr: "0.00000096",
      };
      const ticker = WebSocketClient.formatTicker(rawTicker);
      deepStrictEqual(ticker, expectedTicker);
    });

    test(".formatVolume()", () => {
      const rawVolume: RawVolumeMessage = [
        1003,
        null,
        [
          "2018-11-07 16:26",
          5804,
          {
            BTC: "3418.409",
            ETH: "2645.921",
            USDT: "10832502.689",
            USDC: "1578020.908",
          },
        ],
      ];
      const expectedVolume: WsVolume = {
        subject: "volume",
        channel_id: 1003,
        time: "2018-11-07 16:26",
        users: 5804,
        volume: {
          BTC: "3418.409",
          ETH: "2645.921",
          USDT: "10832502.689",
          USDC: "1578020.908",
        },
      };
      const volume = WebSocketClient.formatVolume(rawVolume);
      deepStrictEqual(volume, expectedVolume);
    });

    test(".formatSnapshot()", () => {
      const rawSnapshot: RawSnapshot = [
        "i",
        {
          currencyPair: "BTC_ETH",
          orderBook: [
            {
              "0.03119500": "8.87619723",
              "0.03120486": "2.15539849",
              "0.03120500": "50.78890000",
              "3777.70000000": "0.00100000",
              "4999.00000000": "0.05000000",
              "5000.00000000": "0.20000000",
            },
            {
              "0.03118500": "50.78940000",
              "0.03117855": "10.55121501",
              "0.03117841": "6.20027213",
              "0.00000003": "20000.00000000",
              "0.00000002": "670207.00000000",
              "0.00000001": "1462262.00000000",
            },
          ],
        },
        "1580123594000",
      ];
      const expectedSnapshot: WsSnapshot = {
        subject: "snapshot",
        currencyPair: "BTC_ETH",
        asks: {
          "0.03119500": "8.87619723",
          "0.03120486": "2.15539849",
          "0.03120500": "50.78890000",
          "3777.70000000": "0.00100000",
          "4999.00000000": "0.05000000",
          "5000.00000000": "0.20000000",
        },
        bids: {
          "0.03118500": "50.78940000",
          "0.03117855": "10.55121501",
          "0.03117841": "6.20027213",
          "0.00000003": "20000.00000000",
          "0.00000002": "670207.00000000",
          "0.00000001": "1462262.00000000",
        },
        epoch_ms: "1580123594000",
      };
      const snapshot = WebSocketClient.formatSnapshot(rawSnapshot);
      deepStrictEqual(snapshot, expectedSnapshot);
    });

    test(".formatPublicTrade() (buy)", () => {
      const rawTrade: RawPublicTrade = [
        "t",
        "48555788",
        1,
        "0.01924381",
        "0.60000000",
        1580123594,
        "1580123594000",
      ];
      const expectedTrade: WsPublicTrade = {
        subject: "publicTrade",
        tradeID: "48555788",
        type: "buy",
        price: "0.01924381",
        size: "0.60000000",
        timestamp: 1580123594,
        epoch_ms: "1580123594000",
      };
      const trade = WebSocketClient.formatPublicTrade(rawTrade);
      deepStrictEqual(trade, expectedTrade);
    });

    test(".formatPublicTrade() (sell)", () => {
      const rawTrade: RawPublicTrade = [
        "t",
        "48555788",
        0,
        "0.01924381",
        "0.60000000",
        1580123594,
        "1580123594000",
      ];
      const expectedTrade: WsPublicTrade = {
        subject: "publicTrade",
        tradeID: "48555788",
        type: "sell",
        price: "0.01924381",
        size: "0.60000000",
        timestamp: 1580123594,
        epoch_ms: "1580123594000",
      };
      const trade = WebSocketClient.formatPublicTrade(rawTrade);
      deepStrictEqual(trade, expectedTrade);
    });

    test(".formatBookUpdate() (bid)", () => {
      const rawUpdate: RawBookUpdate = [
        "o",
        1,
        "0.01924381",
        "0.00000000",
        "1580123594000",
      ];
      const expectedUpdate: WsBookUpdate = {
        subject: "update",
        type: "bid",
        price: "0.01924381",
        size: "0.00000000",
        epoch_ms: "1580123594000",
      };
      const update = WebSocketClient.formatBookUpdate(rawUpdate);
      deepStrictEqual(update, expectedUpdate);
    });

    test(".formatBookUpdate() (ask)", () => {
      const rawUpdate: RawBookUpdate = [
        "o",
        0,
        "0.01924381",
        "0.00000000",
        "1580123594000",
      ];
      const expectedUpdate: WsBookUpdate = {
        subject: "update",
        type: "ask",
        price: "0.01924381",
        size: "0.00000000",
        epoch_ms: "1580123594000",
      };
      const update = WebSocketClient.formatBookUpdate(rawUpdate);
      deepStrictEqual(update, expectedUpdate);
    });

    test(".formatHeartbeat()", () => {
      const rawHeartbeat: RawWsHeartbeat = [1010];
      const expectedHeartbeat: WsHeartbeat = {
        subject: "heartbeat",
        channel_id: 1010,
      };
      const heartbeat = WebSocketClient.formatHeartbeat(rawHeartbeat);
      deepStrictEqual(heartbeat, expectedHeartbeat);
    });

    test(".formatAcknowledge() (subscribe)", () => {
      const rawAcknowledge: RawAcknowledgement = [1002, 1];
      const expectedAcknowledge: WsAcknowledgement = {
        subject: "subscribed",
        channel_id: 1002,
      };
      const acknowledge = WebSocketClient.formatAcknowledge(rawAcknowledge);
      deepStrictEqual(acknowledge, expectedAcknowledge);
    });

    test(".formatAcknowledge() (unsubscribed)", () => {
      const rawAcknowledge: RawAcknowledgement = [1002, 0];
      const expectedAcknowledge: WsAcknowledgement = {
        subject: "unsubscribed",
        channel_id: 1002,
      };
      const acknowledge = WebSocketClient.formatAcknowledge(rawAcknowledge);
      deepStrictEqual(acknowledge, expectedAcknowledge);
    });

    test(".formatUpdate()", () => {
      const rawPriceAggregatedBook: RawPriceAggregatedBook = [
        148,
        818973992,
        [
          [
            "i",
            {
              currencyPair: "BTC_ETH",
              orderBook: [
                {
                  "0.03119500": "8.87619723",
                  "0.03120486": "2.15539849",
                  "0.03120500": "50.78890000",
                  "3777.70000000": "0.00100000",
                  "4999.00000000": "0.05000000",
                  "5000.00000000": "0.20000000",
                },
                {
                  "0.03118500": "50.78940000",
                  "0.03117855": "10.55121501",
                  "0.03117841": "6.20027213",
                  "0.00000003": "20000.00000000",
                  "0.00000002": "670207.00000000",
                  "0.00000001": "1462262.00000000",
                },
              ],
            },
            "1580123594000",
          ],
          ["o", 1, "0.01924381", "0.00000000", "1580123594000"],
          [
            "t",
            "48555788",
            0,
            "0.01924381",
            "0.60000000",
            1580123594,
            "1580123594000",
          ],
        ],
      ];
      const expectedMessages: WsBookMessage[] = [
        {
          channel_id: 148,
          sequence: 818973992,
          subject: "snapshot",
          currencyPair: "BTC_ETH",
          asks: {
            "0.03119500": "8.87619723",
            "0.03120486": "2.15539849",
            "0.03120500": "50.78890000",
            "3777.70000000": "0.00100000",
            "4999.00000000": "0.05000000",
            "5000.00000000": "0.20000000",
          },
          bids: {
            "0.03118500": "50.78940000",
            "0.03117855": "10.55121501",
            "0.03117841": "6.20027213",
            "0.00000003": "20000.00000000",
            "0.00000002": "670207.00000000",
            "0.00000001": "1462262.00000000",
          },
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 148,
          sequence: 818973992,
          currencyPair: "BTC_ETH",
          subject: "update",
          type: "bid",
          price: "0.01924381",
          size: "0.00000000",
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 148,
          sequence: 818973992,
          currencyPair: "BTC_ETH",
          subject: "publicTrade",
          tradeID: "48555788",
          type: "sell",
          price: "0.01924381",
          size: "0.60000000",
          timestamp: 1580123594,
          epoch_ms: "1580123594000",
        },
      ];
      const messages = WebSocketClient.formatUpdate(rawPriceAggregatedBook);
      deepStrictEqual(messages, expectedMessages);
    });

    test(".formatPending() (buy)", () => {
      const rawPending: RawPendingOrder = [
        "p",
        78612171341,
        203,
        "1000.00000000",
        "1.00000000",
        "1",
        null,
        "1580123594000",
      ];
      const expectedPending: WsPendingOrder = {
        subject: "pending",
        orderNumber: 78612171341,
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        rate: "1000.00000000",
        amount: "1.00000000",
        type: "buy",
        clientOrderId: null,
        epoch_ms: "1580123594000",
      };
      const pending = WebSocketClient.formatPending(rawPending);
      deepStrictEqual(pending, expectedPending);
    });

    test(".formatPending() (sell)", () => {
      const rawPending: RawPendingOrder = [
        "p",
        78612171341,
        203,
        "1000.00000000",
        "1.00000000",
        "0",
        null,
        "1580123594000",
      ];
      const expectedPending: WsPendingOrder = {
        subject: "pending",
        orderNumber: 78612171341,
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        rate: "1000.00000000",
        amount: "1.00000000",
        type: "sell",
        clientOrderId: null,
        epoch_ms: "1580123594000",
      };
      const pending = WebSocketClient.formatPending(rawPending);
      deepStrictEqual(pending, expectedPending);
    });

    test(".formatNew() (buy)", () => {
      const rawNew: RawNewOrder = [
        "n",
        203,
        123212321,
        "1",
        "999.00000000",
        "1.00000000",
        "2020-01-27 11:33:21",
        "1.00000000",
        null,
      ];
      const expectedNew: WsNewOrder = {
        subject: "new",
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        orderNumber: 123212321,
        type: "buy",
        rate: "999.00000000",
        amount: "1.00000000",
        date: "2020-01-27 11:33:21",
        originalAmount: "1.00000000",
        clientOrderId: null,
      };
      const newOrder = WebSocketClient.formatNew(rawNew);
      deepStrictEqual(newOrder, expectedNew);
    });

    test(".formatNew() (sell)", () => {
      const rawNew: RawNewOrder = [
        "n",
        203,
        123212321,
        "0",
        "999.00000000",
        "1.00000000",
        "2020-01-27 11:33:21",
        "1.00000000",
        null,
      ];
      const expectedNew: WsNewOrder = {
        subject: "new",
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        orderNumber: 123212321,
        type: "sell",
        rate: "999.00000000",
        amount: "1.00000000",
        date: "2020-01-27 11:33:21",
        originalAmount: "1.00000000",
        clientOrderId: null,
      };
      const newOrder = WebSocketClient.formatNew(rawNew);
      deepStrictEqual(newOrder, expectedNew);
    });

    test(".formatBalance() (exchange)", () => {
      const rawBalance: RawBalance = ["b", 298, "e", "-1.00000000"];
      const expectedBalance: WsBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "exchange",
        amount: "-1.00000000",
      };
      const balance = WebSocketClient.formatBalance(rawBalance);
      deepStrictEqual(balance, expectedBalance);
    });

    test(".formatBalance() (margin)", () => {
      const rawBalance: RawBalance = ["b", 298, "m", "-1.00000000"];
      const expectedBalance: WsBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "margin",
        amount: "-1.00000000",
      };
      const balance = WebSocketClient.formatBalance(rawBalance);
      deepStrictEqual(balance, expectedBalance);
    });

    test(".formatBalance() (lending)", () => {
      const rawBalance: RawBalance = ["b", 298, "l", "-1.00000000"];
      const expectedBalance: WsBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "lending",
        amount: "-1.00000000",
      };
      const balance = WebSocketClient.formatBalance(rawBalance);
      deepStrictEqual(balance, expectedBalance);
    });

    test(".formatOrder() (canceled)", () => {
      const rawOrder: RawOrder = ["o", 123321123, "0.00000000", "c", null];
      const expectedOrder: WsOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "canceled",
        clientOrderId: null,
      };
      const order = WebSocketClient.formatOrder(rawOrder);
      deepStrictEqual(order, expectedOrder);
    });

    test(".formatOrder() (filled)", () => {
      const rawOrder: RawOrder = ["o", 123321123, "0.00000000", "f", null];
      const expectedOrder: WsOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "filled",
        clientOrderId: null,
      };
      const order = WebSocketClient.formatOrder(rawOrder);
      deepStrictEqual(order, expectedOrder);
    });

    test(".formatOrder() (self-trade)", () => {
      const rawOrder: RawOrder = ["o", 123321123, "0.00000000", "s", "123"];
      const expectedOrder: WsOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "self-trade",
        clientOrderId: "123",
      };
      const order = WebSocketClient.formatOrder(rawOrder);
      deepStrictEqual(order, expectedOrder);
    });

    test(".formatMarginUpdate()", () => {
      const rawUpdate: RawMarginUpdate = [
        "m",
        23432933,
        28,
        "-0.06000000",
        null,
      ];
      const expectedUpdate: WsMarginUpdate = {
        subject: "margin",
        orderNumber: 23432933,
        currency: Currencies[28] ?? "28",
        amount: "-0.06000000",
        clientOrderId: null,
      };
      const update = WebSocketClient.formatMarginUpdate(rawUpdate);
      deepStrictEqual(update, expectedUpdate);
    });

    test(".formatTrade()", () => {
      const rawTrade: RawTrade = [
        "t",
        12345,
        "0.03000000",
        "0.50000000",
        "0.00250000",
        0,
        6083059,
        "0.00000375",
        "2018-09-08 05:54:09",
        "12345",
        "0",
        "1580123594000",
      ];
      const expectedTrade: WsTrade = {
        subject: "trade",
        tradeID: 12345,
        rate: "0.03000000",
        amount: "0.50000000",
        feeMultiplier: "0.00250000",
        fundingType: 0,
        orderNumber: 6083059,
        fee: "0.00000375",
        date: "2018-09-08 05:54:09",
        clientOrderId: "12345",
        total_trade: "0",
        epoch_ms: "1580123594000",
      };
      const trade = WebSocketClient.formatTrade(rawTrade);
      deepStrictEqual(trade, expectedTrade);
    });

    test(".formatKill()", () => {
      const rawKill: RawKill = ["k", 12345, null];
      const expectedKill: WsKill = {
        subject: "killed",
        orderNumber: 12345,
        clientOrderId: null,
      };
      const kill = WebSocketClient.formatKill(rawKill);
      deepStrictEqual(kill, expectedKill);
    });

    test(".formatAccount()", () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const unnkownmessage = ["unnkownmessage"] as unknown;
      const rawAccountMessage = [
        1000,
        "",
        [
          [
            "p",
            78612171341,
            203,
            "1000.00000000",
            "1.00000000",
            "1",
            null,
            "1580123594000",
          ] as RawPendingOrder,
          [
            "n",
            203,
            123212321,
            "1",
            "999.00000000",
            "1.00000000",
            "2020-01-27 11:33:21",
            "1.00000000",
            null,
          ] as RawNewOrder,
          ["b", 298, "m", "-1.00000000"],
          ["o", 123321123, "0.00000000", "c", null],
          [
            "t",
            12345,
            "0.03000000",
            "0.50000000",
            "0.00250000",
            0,
            6083059,
            "0.00000375",
            "2018-09-08 05:54:09",
            "12345",
            "0",
            "1580123594000",
          ] as RawTrade,
          ["k", 12345, null],
          unnkownmessage,
        ],
      ] as RawAccountMessage;
      const expectedMessages: WsAccountMessage[] = [
        {
          channel_id: 1000,
          subject: "pending",
          orderNumber: 78612171341,
          currencyPairId: 203,
          currencyPair: "USDT_EOS",
          rate: "1000.00000000",
          amount: "1.00000000",
          type: "buy",
          clientOrderId: null,
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 1000,
          subject: "new",
          currencyPairId: 203,
          currencyPair: "USDT_EOS",
          orderNumber: 123212321,
          type: "buy",
          rate: "999.00000000",
          amount: "1.00000000",
          date: "2020-01-27 11:33:21",
          originalAmount: "1.00000000",
          clientOrderId: null,
        },
        {
          channel_id: 1000,
          subject: "balance",
          currencyId: 298,
          currency: "EOS",
          wallet: "margin",
          amount: "-1.00000000",
        },
        {
          channel_id: 1000,
          subject: "order",
          orderNumber: 123321123,
          newAmount: "0.00000000",
          orderType: "canceled",
          clientOrderId: null,
        },
        {
          channel_id: 1000,
          subject: "trade",
          tradeID: 12345,
          rate: "0.03000000",
          amount: "0.50000000",
          feeMultiplier: "0.00250000",
          fundingType: 0,
          orderNumber: 6083059,
          fee: "0.00000375",
          date: "2018-09-08 05:54:09",
          clientOrderId: "12345",
          total_trade: "0",
          epoch_ms: "1580123594000",
        },
        {
          channel_id: 1000,
          subject: "killed",
          orderNumber: 12345,
          clientOrderId: null,
        },
      ];
      const messages = WebSocketClient.formatAccount(rawAccountMessage);
      deepStrictEqual(messages, expectedMessages);
    });
  });

  suite("socket events", () => {
    suite("open", () => {
      test("emits `open`", async () => {
        const connect = new Promise<void>((resolve) => {
          client.once("open", () => {
            resolve();
          });
        });
        await client.connect();
        await connect;
      });

      test("emits `error` when a subscribe promise rejects", async () => {
        await client.connect();
        await client.disconnect();
        const message = "WebSocket is not open: readyState 3 (CLOSED)";
        const errorPromise = new Promise<void>((resolve, reject) => {
          client.once("error", (err) => {
            try {
              deepStrictEqual(err, new Error(message));
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        deepStrictEqual(client.ws?.emit("open"), true);
        await errorPromise;
      });

      test("subscribes to the channels", async () => {
        const channels = [1000, 1003];
        const otherClient = new WebSocketClient({ wsUri, channels });
        const connection = new Promise<void>((resolve, reject) => {
          server.once("connection", (ws) => {
            const command = "subscribe";
            ws.once("message", (data: string) => {
              ws.once("message", (otherData: string) => {
                try {
                  const channel = 1003;
                  deepStrictEqual(JSON.parse(otherData), {
                    command,
                    channel,
                  });
                  resolve();
                } catch (error) {
                  reject(error);
                }
              });
              const channel = 1000;
              try {
                deepStrictEqual(JSON.parse(data), { command, channel });
              } catch (error) {
                reject(error);
              }
            });
          });
        });
        await otherClient.connect();
        await connection;
      });
    });

    suite("close", () => {
      test("emits `close`", async () => {
        client.once("open", () => {
          client.ws?.emit("close");
        });
        const close = new Promise<void>((resolve) => {
          client.once("close", () => {
            resolve();
          });
        });
        await client.connect();
        await close;
      });
    });

    suite("message", () => {
      test("emits `error` when receiving an error message", async () => {
        const error = "Permission denied.";
        server.once("connection", (ws) => ws.send(JSON.stringify({ error })));

        const errorPromise = new Promise<void>((resolve, reject) => {
          client.once("error", (data) => {
            try {
              deepStrictEqual(data, { error });
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        });
        await client.connect();
        await errorPromise;
      });

      test("emits `error` when receiving an invalid JSON message", async () => {
        const error = "Permission denied.";
        server.once("connection", (ws) => ws.send(error));

        const errorPromise = new Promise<void>((resolve, reject) => {
          client.once("error", (data) => {
            try {
              ok(data instanceof SyntaxError);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        });
        await client.connect();
        await errorPromise;
      });

      test("emits `rawMessage`", async () => {
        const rawMessage: [number] = [1010];
        server.once("connection", (ws) => ws.send(JSON.stringify(rawMessage)));
        const raw = new Promise<void>((resolve) => {
          client.once("rawMessage", () => {
            client.once("message", () => {
              resolve();
            });
          });
        });
        await client.connect();
        await raw;
      });

      test("does not emit `rawMessage` (when `raw=false`)", async () => {
        const otherClient = new WebSocketClient({ wsUri, raw: false });
        const rawMessage: [number] = [1010];
        const raw = new Promise<void>((resolve, reject) => {
          otherClient.once("rawMessage", () =>
            reject(new Error("rawMessage was emitted"))
          );
          otherClient.once("message", () => {
            resolve();
          });
        });
        server.once("connection", (ws) => ws.send(JSON.stringify(rawMessage)));
        await otherClient.connect();
        await raw;
        await otherClient.disconnect();
      });

      test("Heartbeat", async () => {
        const rawHeartbeat: RawWsHeartbeat = [1010];
        const heartbeat: WsHeartbeat = {
          subject: "heartbeat",
          channel_id: 1010,
        };
        server.once("connection", (ws) =>
          ws.send(JSON.stringify(rawHeartbeat))
        );

        const message = new Promise<void>((resolve, reject) => {
          client.once("message", (data) => {
            try {
              deepStrictEqual(data, heartbeat);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await client.connect();
        await message;
      });

      test("Subscription acknowledgement", async () => {
        const rawAcknowledge: RawAcknowledgement = [1002, 1];
        const acknowledge: WsAcknowledgement = {
          subject: "subscribed",
          channel_id: 1002,
        };
        server.once("connection", (ws) =>
          ws.send(JSON.stringify(rawAcknowledge))
        );

        const message = new Promise<void>((resolve, reject) => {
          client.once("message", (data) => {
            try {
              deepStrictEqual(data, acknowledge);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });

        await client.connect();
        await message;
      });

      test("Ticker", async () => {
        const rawTicker: RawTickerMessage = [
          1002,
          null,
          [
            150,
            "0.00000098",
            "0.00000099",
            "0.00000098",
            "0.01030927",
            "23.24910068",
            "23685243.40788439",
            0,
            "0.00000100",
            "0.00000096",
          ],
        ];
        const ticker: WsTicker = {
          subject: "ticker",
          channel_id: 1002,
          currencyPairId: 150,
          currencyPair: "BTC_SC",
          last: "0.00000098",
          lowestAsk: "0.00000099",
          highestBid: "0.00000098",
          percentChange: "0.01030927",
          baseVolume: "23.24910068",
          quoteVolume: "23685243.40788439",
          isFrozen: false,
          high24hr: "0.00000100",
          low24hr: "0.00000096",
        };
        server.once("connection", (ws) => ws.send(JSON.stringify(rawTicker)));

        const message = new Promise<void>((resolve, reject) => {
          client.once("message", (data) => {
            try {
              deepStrictEqual(data, ticker);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await client.connect();
        await message;
      });

      test("Volume", async () => {
        const rawVolume: RawVolumeMessage = [
          1003,
          null,
          [
            "2018-11-07 16:26",
            5804,
            {
              BTC: "3418.409",
              ETH: "2645.921",
              USDT: "10832502.689",
              USDC: "1578020.908",
            },
          ],
        ];
        const volume: WsVolume = {
          subject: "volume",
          channel_id: 1003,
          time: "2018-11-07 16:26",
          users: 5804,
          volume: {
            BTC: "3418.409",
            ETH: "2645.921",
            USDT: "10832502.689",
            USDC: "1578020.908",
          },
        };
        server.once("connection", (ws) => ws.send(JSON.stringify(rawVolume)));

        const message = new Promise<void>((resolve, reject) => {
          client.once("message", (data) => {
            try {
              deepStrictEqual(data, volume);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
        await client.connect();
        await message;
      });

      test("Account notifications", async () => {
        const rawAccountMessage: RawAccountMessage = [
          1000,
          "",
          [
            [
              "p",
              78612171341,
              203,
              "1000.00000000",
              "1.00000000",
              "1",
              null,
              "1580123594000",
            ],
            [
              "n",
              203,
              123212321,
              "1",
              "999.00000000",
              "1.00000000",
              "2020-01-27 11:33:21",
              "1.00000000",
              null,
            ],
            ["b", 298, "m", "-1.00000000"],
            ["o", 123321123, "0.00000000", "c", null],
            ["m", 23432933, 10000, "-0.06000000", null],
            [
              "t",
              12345,
              "0.03000000",
              "0.50000000",
              "0.00250000",
              0,
              6083059,
              "0.00000375",
              "2018-09-08 05:54:09",
              "12345",
              "0",
              "1580123594000",
            ],
            ["k", 12345, null],
          ],
        ];
        const messages: WsAccountMessage[] = [
          {
            channel_id: 1000,
            subject: "pending",
            orderNumber: 78612171341,
            currencyPairId: 203,
            currencyPair: "USDT_EOS",
            rate: "1000.00000000",
            amount: "1.00000000",
            type: "buy",
            clientOrderId: null,
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 1000,
            subject: "new",
            currencyPairId: 203,
            currencyPair: "USDT_EOS",
            orderNumber: 123212321,
            type: "buy",
            rate: "999.00000000",
            amount: "1.00000000",
            date: "2020-01-27 11:33:21",
            originalAmount: "1.00000000",
            clientOrderId: null,
          },
          {
            channel_id: 1000,
            subject: "balance",
            currencyId: 298,
            currency: "EOS",
            wallet: "margin",
            amount: "-1.00000000",
          },
          {
            channel_id: 1000,
            subject: "order",
            orderNumber: 123321123,
            newAmount: "0.00000000",
            orderType: "canceled",
            clientOrderId: null,
          },
          {
            channel_id: 1000,
            subject: "margin",
            orderNumber: 23432933,
            currency: "10000",
            amount: "-0.06000000",
            clientOrderId: null,
          },
          {
            channel_id: 1000,
            subject: "trade",
            tradeID: 12345,
            rate: "0.03000000",
            amount: "0.50000000",
            feeMultiplier: "0.00250000",
            fundingType: 0,
            orderNumber: 6083059,
            fee: "0.00000375",
            date: "2018-09-08 05:54:09",
            clientOrderId: "12345",
            total_trade: "0",
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 1000,
            subject: "killed",
            orderNumber: 12345,
            clientOrderId: null,
          },
        ];
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawAccountMessage));
        });
        const message = new Promise<void>((resolve, reject) => {
          const verify = (i: number): void => {
            client.once("message", (data) => {
              try {
                deepStrictEqual(data, messages[i++]);
                if (i === messages.length) {
                  resolve();
                } else {
                  verify(i);
                }
              } catch (error) {
                reject(error);
              }
            });
          };

          verify(0);
        });
        await client.connect();
        await message;
      });

      test("Price aggregated book", async () => {
        const rawPriceAggregatedBook: RawPriceAggregatedBook = [
          148,
          818973992,
          [
            [
              "i",
              {
                currencyPair: "BTC_ETH",
                orderBook: [
                  {
                    "0.03119500": "8.87619723",
                    "0.03120486": "2.15539849",
                    "0.03120500": "50.78890000",
                    "3777.70000000": "0.00100000",
                    "4999.00000000": "0.05000000",
                    "5000.00000000": "0.20000000",
                  },
                  {
                    "0.03118500": "50.78940000",
                    "0.03117855": "10.55121501",
                    "0.03117841": "6.20027213",
                    "0.00000003": "20000.00000000",
                    "0.00000002": "670207.00000000",
                    "0.00000001": "1462262.00000000",
                  },
                ],
              },
              "1580123594000",
            ],
            ["o", 1, "0.01924381", "0.00000000", "1580123594000"],
            [
              "t",
              "48555788",
              0,
              "0.01924381",
              "0.60000000",
              1580123594,
              "1580123594000",
            ],
          ],
        ];
        const messages: WsBookMessage[] = [
          {
            channel_id: 148,
            sequence: 818973992,
            subject: "snapshot",
            currencyPair: "BTC_ETH",
            asks: {
              "0.03119500": "8.87619723",
              "0.03120486": "2.15539849",
              "0.03120500": "50.78890000",
              "3777.70000000": "0.00100000",
              "4999.00000000": "0.05000000",
              "5000.00000000": "0.20000000",
            },
            bids: {
              "0.03118500": "50.78940000",
              "0.03117855": "10.55121501",
              "0.03117841": "6.20027213",
              "0.00000003": "20000.00000000",
              "0.00000002": "670207.00000000",
              "0.00000001": "1462262.00000000",
            },
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 148,
            sequence: 818973992,
            currencyPair: "BTC_ETH",
            subject: "update",
            type: "bid",
            price: "0.01924381",
            size: "0.00000000",
            epoch_ms: "1580123594000",
          },
          {
            channel_id: 148,
            sequence: 818973992,
            currencyPair: "BTC_ETH",
            subject: "publicTrade",
            tradeID: "48555788",
            type: "sell",
            price: "0.01924381",
            size: "0.60000000",
            timestamp: 1580123594,
            epoch_ms: "1580123594000",
          },
        ];
        server.once("connection", (ws) => {
          ws.send(JSON.stringify(rawPriceAggregatedBook));
        });
        const message = new Promise<void>((resolve, reject) => {
          const verify = (i: number): void => {
            client.once("message", (data) => {
              try {
                deepStrictEqual(data, messages[i++]);
                if (i === messages.length) {
                  resolve();
                } else {
                  verify(i);
                }
              } catch (error) {
                reject(error);
              }
            });
          };

          verify(0);
        });
        await client.connect();
        await message;
      });
    });

    suite("error", () => {
      test("emits `error`", async () => {
        const error = new Error("Some error");
        client.once("open", () => {
          client.ws?.emit("error", error);
        });
        const errorPromise = new Promise<void>((resolve) => {
          client.once("error", (err) => {
            deepStrictEqual(err, error);
            resolve();
          });
        });
        await client.connect();
        await errorPromise;
      });

      test("with no error", async () => {
        const errorPromise = new Promise<void>((resolve, reject) => {
          client.once("open", () => {
            if (!client.ws) {
              reject(new Error("`socket` is not initialized"));
            } else {
              client.ws.emit("error");
              setImmediate(resolve);
            }
          });
          client.once("error", () => {
            reject(new Error("`error` was emitted"));
          });
        });
        await client.connect();
        await errorPromise;
      });
    });
  });

  test("passes authentication details through", async () => {
    const key = "poloniex-api-key";
    const secret = "poloniex-api-secret";
    const authClient = new WebSocketClient({ wsUri, key, secret });
    const nonce = 1;
    authClient.nonce = (): number => nonce;
    const connection = new Promise<void>((resolve, reject) => {
      server.once("connection", (ws) => {
        ws.once("message", (data: string) => {
          try {
            const [channel] = DefaultChannels;

            const form = new URLSearchParams({ nonce: `${nonce}` });
            const { sign } = SignRequest({
              key,
              secret,
              body: form.toString(),
            });
            deepStrictEqual(JSON.parse(data), {
              command: "subscribe",
              channel,
              payload: `nonce=${nonce}`,
              key,
              sign,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    });
    await authClient.connect();
    await connection;
    await authClient.disconnect();
  });
});
