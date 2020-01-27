import * as assert from "assert";
import {
  WebsocketClient,
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
  RawTrade,
  WsTrade,
  RawKill,
  WsKill,
  RawAccountMessage,
  WsAccountMessage
} from "../index";
import { Server, OPEN, CONNECTING, CLOSING, CLOSED } from "ws";

const port = 10009;
const wsUri = "ws://localhost:" + port;

suite("WebsocketClient", () => {
  test("constructor", () => {
    const key = "poloniexapikey";
    const secret = "poloniexapisecret";
    const raw = true;
    const websocket = new WebsocketClient({ key, secret, raw });
    assert.deepStrictEqual(websocket.channels, DefaultChannels);
    assert.deepStrictEqual(websocket.raw, raw);
    assert.deepStrictEqual(websocket.wsUri, WsUri);
    assert.deepStrictEqual(websocket.key, key);
    assert.deepStrictEqual(websocket.secret, secret);
  });

  test(".nonce()", () => {
    const client = new WebsocketClient();
    const nonce = client.nonce();
    assert.ok(Date.now() - nonce < 100);
  });

  test("constructor (with no arguments)", () => {
    const websocket = new WebsocketClient();
    assert.deepStrictEqual(websocket.channels, DefaultChannels);
    assert.deepStrictEqual(websocket.raw, true);
    assert.deepStrictEqual(websocket.wsUri, WsUri);
    assert.deepStrictEqual(websocket.key, undefined);
    assert.deepStrictEqual(websocket.secret, undefined);
  });

  test(".connect() (subscribes to the default channel)", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    server.on("connection", ws => {
      ws.once("message", data => {
        const [channel] = DefaultChannels;
        const command = "subscribe";
        assert.deepStrictEqual(JSON.parse(data), { command, channel });
        server.close(done);
      });
    });
    client.connect();
  });

  test(".connect() (when `readyState` is `OPEN`)", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    client.connect();
    client.on("open", () => {
      if (!client.socket) {
        assert.fail("Websocket is not initialized");
      }
      assert.deepStrictEqual(client.socket.readyState, OPEN);
      client.connect();
      server.close(done);
    });
  });

  test(".connect() (when `readyState` is `CONNECTING`)", done => {
    function verifyClient(info: object, cb: Function): void {
      setTimeout(() => cb(true) && info, 0);
    }
    const server = new Server({ port, verifyClient });
    const client = new WebsocketClient({ wsUri });
    client.connect();
    if (!client.socket) {
      assert.fail("Websocket is not initialized");
    }
    assert.deepStrictEqual(client.socket.readyState, CONNECTING);
    const error = new Error("Could not connect. State: 0");
    assert.throws(() => client.connect(), error);
    client.on("open", () => server.close(done));
  });

  test(".connect() (when `readyState` is `CLOSING`)", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    client.on("open", () => {
      client.disconnect();
      if (!client.socket) {
        assert.fail("Websocket is not initialized");
      }
      assert.deepStrictEqual(client.socket.readyState, CLOSING);
      const error = new Error("Could not connect. State: 2");
      assert.throws(() => client.connect(), error);
      client.on("close", () => server.close(done));
    });
    client.connect();
  });

  test(".disconnect()", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    client.once("open", client.disconnect);
    client.once("close", () => server.close(done));
    client.connect();
  });

  test(".disconnect() (when socket is not initialized)", () => {
    new WebsocketClient({ wsUri }).disconnect();
  });

  test(".disconnect() (when `readyState` is `CLOSED`)", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    client.on("open", () => client.disconnect());
    client.on("close", () => {
      if (!client.socket) {
        assert.fail("Websocket is not initialized");
      }
      assert.deepStrictEqual(client.socket.readyState, CLOSED);
      client.disconnect();
      server.close(done);
    });
    client.connect();
  });

  test(".disconnect() (when `readyState` is `CONNECTING`)", done => {
    function verifyClient(info: object, cb: Function): void {
      setTimeout(() => cb(true) && info, 0);
    }
    const server = new Server({ port, verifyClient });
    const client = new WebsocketClient({ wsUri });
    client.connect();
    if (!client.socket) {
      assert.fail("Websocket is not initialized");
    }
    assert.deepStrictEqual(client.socket.readyState, CONNECTING);
    const error = new Error("Could not disconnect. State: 0");
    assert.throws(() => client.disconnect(), error);
    client.on("open", () => server.close(done));
  });

  test(".disconnect() (when `readyState` is `CLOSING`)", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    client.on("open", () => {
      client.disconnect();
      if (!client.socket) {
        assert.fail("Websocket is not initialized");
      }
      assert.deepStrictEqual(client.socket.readyState, CLOSING);
      const error = new Error("Could not disconnect. State: 2");
      assert.throws(() => client.disconnect(), error);
      client.on("close", () => server.close(done));
    });
    client.connect();
  });

  test(".subscribe()", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    const channelToSubscribe = 1003;
    server.on("connection", ws => {
      ws.once("message", () => {
        const command = "subscribe";
        ws.once("message", data => {
          const channel = channelToSubscribe;
          assert.deepStrictEqual(JSON.parse(data), { command, channel });
          server.close(done);
        });
        client.subscribe(channelToSubscribe);
      });
    });
    client.connect();
  });

  test(".subscribe() (when `socket` is not initialized)", done => {
    const client = new WebsocketClient({ wsUri });
    const error = new Error("Websocket is not initialized");
    assert.throws(() => client.subscribe(1002), error);
    done();
  });

  test(".unsubscribe()", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    const channel = 1003;
    server.on("connection", ws => {
      ws.once("message", () => {
        ws.once("message", data => {
          const command = "unsubscribe";
          assert.deepStrictEqual(JSON.parse(data), { command, channel });
          server.close(done);
        });
        client.unsubscribe(channel);
      });
    });
    client.connect();
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
          "0.00000096"
        ]
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
        low24hr: "0.00000096"
      };
      const ticker = WebsocketClient.formatTicker(rawTicker);
      assert.deepStrictEqual(ticker, expectedTicker);
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
          "0.00000096"
        ]
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
        low24hr: "0.00000096"
      };
      const ticker = WebsocketClient.formatTicker(rawTicker);
      assert.deepStrictEqual(ticker, expectedTicker);
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
            USDC: "1578020.908"
          }
        ]
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
          USDC: "1578020.908"
        }
      };
      const volume = WebsocketClient.formatVolume(rawVolume);
      assert.deepStrictEqual(volume, expectedVolume);
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
              "5000.00000000": "0.20000000"
            },
            {
              "0.03118500": "50.78940000",
              "0.03117855": "10.55121501",
              "0.03117841": "6.20027213",
              "0.00000003": "20000.00000000",
              "0.00000002": "670207.00000000",
              "0.00000001": "1462262.00000000"
            }
          ]
        }
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
          "5000.00000000": "0.20000000"
        },
        bids: {
          "0.03118500": "50.78940000",
          "0.03117855": "10.55121501",
          "0.03117841": "6.20027213",
          "0.00000003": "20000.00000000",
          "0.00000002": "670207.00000000",
          "0.00000001": "1462262.00000000"
        }
      };
      const snapshot = WebsocketClient.formatSnapshot(rawSnapshot);
      assert.deepStrictEqual(snapshot, expectedSnapshot);
    });

    test(".formatPublicTrade() (buy)", () => {
      const rawTrade: RawPublicTrade = [
        "t",
        "48555788",
        1,
        "0.01924381",
        "0.60000000",
        1580123594
      ];
      const expectedTrade: WsPublicTrade = {
        subject: "publicTrade",
        tradeID: "48555788",
        type: "buy",
        price: "0.01924381",
        size: "0.60000000",
        timestamp: 1580123594
      };
      const trade = WebsocketClient.formatPublicTrade(rawTrade);
      assert.deepStrictEqual(trade, expectedTrade);
    });

    test(".formatPublicTrade() (sell)", () => {
      const rawTrade: RawPublicTrade = [
        "t",
        "48555788",
        0,
        "0.01924381",
        "0.60000000",
        1580123594
      ];
      const expectedTrade: WsPublicTrade = {
        subject: "publicTrade",
        tradeID: "48555788",
        type: "sell",
        price: "0.01924381",
        size: "0.60000000",
        timestamp: 1580123594
      };
      const trade = WebsocketClient.formatPublicTrade(rawTrade);
      assert.deepStrictEqual(trade, expectedTrade);
    });

    test(".formatBookUpdate() (bid)", () => {
      const rawUpdate: RawBookUpdate = ["o", 1, "0.01924381", "0.00000000"];
      const expectedUpdate: WsBookUpdate = {
        subject: "update",
        type: "bid",
        price: "0.01924381",
        size: "0.00000000"
      };
      const update = WebsocketClient.formatBookUpdate(rawUpdate);
      assert.deepStrictEqual(update, expectedUpdate);
    });

    test(".formatBookUpdate() (ask)", () => {
      const rawUpdate: RawBookUpdate = ["o", 0, "0.01924381", "0.00000000"];
      const expectedUpdate: WsBookUpdate = {
        subject: "update",
        type: "ask",
        price: "0.01924381",
        size: "0.00000000"
      };
      const update = WebsocketClient.formatBookUpdate(rawUpdate);
      assert.deepStrictEqual(update, expectedUpdate);
    });

    test(".formatHeartbeat()", () => {
      const rawHeartbeat: RawWsHeartbeat = [1010];
      const expectedHeartbeat: WsHeartbeat = {
        subject: "heartbeat",
        channel_id: 1010
      };
      const heartbeat = WebsocketClient.formatHeartbeat(rawHeartbeat);
      assert.deepStrictEqual(heartbeat, expectedHeartbeat);
    });

    test(".formatAcknowledge() (subscribe)", () => {
      const rawAcknowledge: RawAcknowledgement = [1002, 1];
      const expectedAcknowledge: WsAcknowledgement = {
        subject: "subscribed",
        channel_id: 1002
      };
      const acknowledge = WebsocketClient.formatAcknowledge(rawAcknowledge);
      assert.deepStrictEqual(acknowledge, expectedAcknowledge);
    });

    test(".formatAcknowledge() (unsubscribed)", () => {
      const rawAcknowledge: RawAcknowledgement = [1002, 0];
      const expectedAcknowledge: WsAcknowledgement = {
        subject: "unsubscribed",
        channel_id: 1002
      };
      const acknowledge = WebsocketClient.formatAcknowledge(rawAcknowledge);
      assert.deepStrictEqual(acknowledge, expectedAcknowledge);
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
                  "5000.00000000": "0.20000000"
                },
                {
                  "0.03118500": "50.78940000",
                  "0.03117855": "10.55121501",
                  "0.03117841": "6.20027213",
                  "0.00000003": "20000.00000000",
                  "0.00000002": "670207.00000000",
                  "0.00000001": "1462262.00000000"
                }
              ]
            }
          ],
          ["o", 1, "0.01924381", "0.00000000"],
          ["t", "48555788", 0, "0.01924381", "0.60000000", 1580123594]
        ]
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
            "5000.00000000": "0.20000000"
          },
          bids: {
            "0.03118500": "50.78940000",
            "0.03117855": "10.55121501",
            "0.03117841": "6.20027213",
            "0.00000003": "20000.00000000",
            "0.00000002": "670207.00000000",
            "0.00000001": "1462262.00000000"
          }
        },
        {
          channel_id: 148,
          sequence: 818973992,
          currencyPair: "BTC_ETH",
          subject: "update",
          type: "bid",
          price: "0.01924381",
          size: "0.00000000"
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
          timestamp: 1580123594
        }
      ];
      const messages = WebsocketClient.formatUpdate(rawPriceAggregatedBook);
      assert.deepStrictEqual(messages, expectedMessages);
    });

    test(".formatPending() (buy)", () => {
      const rawPending: RawPendingOrder = [
        "p",
        78612171341,
        203,
        "1000.00000000",
        "1.00000000",
        "1",
        null
      ];
      const expectedPending: WsPendingOrder = {
        subject: "pending",
        orderNumber: 78612171341,
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        rate: "1000.00000000",
        amount: "1.00000000",
        type: "buy",
        clientOrderId: null
      };
      const pending = WebsocketClient.formatPending(rawPending);
      assert.deepStrictEqual(pending, expectedPending);
    });

    test(".formatPending() (sell)", () => {
      const rawPending: RawPendingOrder = [
        "p",
        78612171341,
        203,
        "1000.00000000",
        "1.00000000",
        "0",
        null
      ];
      const expectedPending: WsPendingOrder = {
        subject: "pending",
        orderNumber: 78612171341,
        currencyPairId: 203,
        currencyPair: "USDT_EOS",
        rate: "1000.00000000",
        amount: "1.00000000",
        type: "sell",
        clientOrderId: null
      };
      const pending = WebsocketClient.formatPending(rawPending);
      assert.deepStrictEqual(pending, expectedPending);
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
        null
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
        clientOrderId: null
      };
      const newOrder = WebsocketClient.formatNew(rawNew);
      assert.deepStrictEqual(newOrder, expectedNew);
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
        null
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
        clientOrderId: null
      };
      const newOrder = WebsocketClient.formatNew(rawNew);
      assert.deepStrictEqual(newOrder, expectedNew);
    });

    test(".formatBalance() (exchange)", () => {
      const rawBalance: RawBalance = ["b", 298, "e", "-1.00000000"];
      const expectedBalance: WsBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "exchange",
        amount: "-1.00000000"
      };
      const balance = WebsocketClient.formatBalance(rawBalance);
      assert.deepStrictEqual(balance, expectedBalance);
    });

    test(".formatBalance() (margin)", () => {
      const rawBalance: RawBalance = ["b", 298, "m", "-1.00000000"];
      const expectedBalance: WsBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "margin",
        amount: "-1.00000000"
      };
      const balance = WebsocketClient.formatBalance(rawBalance);
      assert.deepStrictEqual(balance, expectedBalance);
    });

    test(".formatBalance() (lending)", () => {
      const rawBalance: RawBalance = ["b", 298, "l", "-1.00000000"];
      const expectedBalance: WsBalance = {
        subject: "balance",
        currencyId: 298,
        currency: "EOS",
        wallet: "lending",
        amount: "-1.00000000"
      };
      const balance = WebsocketClient.formatBalance(rawBalance);
      assert.deepStrictEqual(balance, expectedBalance);
    });

    test(".formatOrder() (canceled)", () => {
      const rawOrder: RawOrder = ["o", 123321123, "0.00000000", "c", null];
      const expectedOrder: WsOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "canceled",
        clientOrderId: null
      };
      const order = WebsocketClient.formatOrder(rawOrder);
      assert.deepStrictEqual(order, expectedOrder);
    });

    test(".formatOrder() (filled)", () => {
      const rawOrder: RawOrder = ["o", 123321123, "0.00000000", "f", null];
      const expectedOrder: WsOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "filled",
        clientOrderId: null
      };
      const order = WebsocketClient.formatOrder(rawOrder);
      assert.deepStrictEqual(order, expectedOrder);
    });

    test(".formatOrder() (self-trade)", () => {
      const rawOrder: RawOrder = ["o", 123321123, "0.00000000", "s", "123"];
      const expectedOrder: WsOrder = {
        subject: "order",
        orderNumber: 123321123,
        newAmount: "0.00000000",
        orderType: "self-trade",
        clientOrderId: "123"
      };
      const order = WebsocketClient.formatOrder(rawOrder);
      assert.deepStrictEqual(order, expectedOrder);
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
        "12345"
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
        clientOrderId: "12345"
      };
      const trade = WebsocketClient.formatTrade(rawTrade);
      assert.deepStrictEqual(trade, expectedTrade);
    });

    test(".formatKill()", () => {
      const rawKill: RawKill = ["k", 12345, null];
      const expectedKill: WsKill = {
        subject: "killed",
        orderNumber: 12345,
        clientOrderId: null
      };
      const kill = WebsocketClient.formatKill(rawKill);
      assert.deepStrictEqual(kill, expectedKill);
    });

    test(".formatAccount()", () => {
      const rawAccountMessage: RawAccountMessage = [
        1000,
        "",
        [
          ["p", 78612171341, 203, "1000.00000000", "1.00000000", "1", null],
          [
            "n",
            203,
            123212321,
            "1",
            "999.00000000",
            "1.00000000",
            "2020-01-27 11:33:21",
            "1.00000000",
            null
          ],
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
            "12345"
          ],
          ["k", 12345, null]
        ]
      ];
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
          clientOrderId: null
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
          clientOrderId: null
        },
        {
          channel_id: 1000,
          subject: "balance",
          currencyId: 298,
          currency: "EOS",
          wallet: "margin",
          amount: "-1.00000000"
        },
        {
          channel_id: 1000,
          subject: "order",
          orderNumber: 123321123,
          newAmount: "0.00000000",
          orderType: "canceled",
          clientOrderId: null
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
          clientOrderId: "12345"
        },
        {
          channel_id: 1000,
          subject: "killed",
          orderNumber: 12345,
          clientOrderId: null
        }
      ];
      const messages = WebsocketClient.formatAccount(rawAccountMessage);
      assert.deepStrictEqual(messages, expectedMessages);
    });
  });

  suite(".socket listeners", () => {
    suite(".onOpen()", () => {
      test("emits `open`", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        client.on("open", () => server.close(done));
        client.connect();
      });

      test("subscribes to the channels", done => {
        const server = new Server({ port });
        const channels = [1000, 1003];
        const client = new WebsocketClient({ wsUri, channels });
        server.on("connection", ws => {
          const command = "subscribe";
          ws.once("message", data => {
            ws.once("message", data => {
              const channel = 1003;
              assert.deepStrictEqual(JSON.parse(data), { command, channel });
              server.close(done);
            });
            const channel = 1000;
            assert.deepStrictEqual(JSON.parse(data), { command, channel });
          });
        });
        client.connect();
      });
    });

    suite(".onClose()", () => {
      test("emits `close`", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        client.once("open", () => {
          if (!client.socket) {
            assert.fail("`socket` is not initialized");
          } else {
            client.socket.emit("close");
          }
        });
        client.once("close", () => server.close(done));
        client.connect();
      });
    });

    suite(".onMessage()", () => {
      test("emits `error` when receiving an error message", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        const error = "Permission denied.";
        server.once("connection", ws => ws.send(JSON.stringify({ error })));
        client.once("error", data => {
          assert.deepStrictEqual(data, { error });
          server.close(done);
        });
        client.connect();
      });

      test("emits `rawMessage`", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        const rawMessage: [number] = [1010];
        client.once("rawMessage", () => server.close(done));
        server.on("connection", ws => ws.send(JSON.stringify(rawMessage)));
        client.connect();
      });

      test("emits `rawMessage`", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri, raw: false });
        const rawMessage: [number] = [1010];
        client.once("rawMessage", () => assert.fail("rawMessage was emitted"));
        client.once("open", () => setTimeout(() => server.close(done), 50));
        server.on("connection", ws => ws.send(JSON.stringify(rawMessage)));
        client.connect();
      });

      test("Heartbeat", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        const rawHeartbeat: RawWsHeartbeat = [1010];
        const heartbeat: WsHeartbeat = {
          subject: "heartbeat",
          channel_id: 1010
        };
        server.on("connection", ws => ws.send(JSON.stringify(rawHeartbeat)));
        client.on("message", message => {
          assert.deepStrictEqual(message, heartbeat);
          server.close(done);
        });
        client.connect();
      });

      test("Subscription acknowledgement", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        const rawAcknowledge: RawAcknowledgement = [1002, 1];
        const acknowledge: WsAcknowledgement = {
          subject: "subscribed",
          channel_id: 1002
        };
        server.on("connection", ws => ws.send(JSON.stringify(rawAcknowledge)));
        client.on("message", message => {
          assert.deepStrictEqual(message, acknowledge);
          server.close(done);
        });
        client.connect();
      });

      test("Ticker", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
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
            "0.00000096"
          ]
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
          low24hr: "0.00000096"
        };
        server.on("connection", ws => ws.send(JSON.stringify(rawTicker)));
        client.on("message", message => {
          assert.deepStrictEqual(message, ticker);
          server.close(done);
        });
        client.connect();
      });

      test("Volume", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
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
              USDC: "1578020.908"
            }
          ]
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
            USDC: "1578020.908"
          }
        };
        server.on("connection", ws => ws.send(JSON.stringify(rawVolume)));
        client.on("message", message => {
          assert.deepStrictEqual(message, volume);
          server.close(done);
        });
        client.connect();
      });

      test("Account notifications", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        const rawAccountMessage: RawAccountMessage = [
          1000,
          "",
          [
            ["p", 78612171341, 203, "1000.00000000", "1.00000000", "1", null],
            [
              "n",
              203,
              123212321,
              "1",
              "999.00000000",
              "1.00000000",
              "2020-01-27 11:33:21",
              "1.00000000",
              null
            ],
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
              "12345"
            ],
            ["k", 12345, null]
          ]
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
            clientOrderId: null
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
            clientOrderId: null
          },
          {
            channel_id: 1000,
            subject: "balance",
            currencyId: 298,
            currency: "EOS",
            wallet: "margin",
            amount: "-1.00000000"
          },
          {
            channel_id: 1000,
            subject: "order",
            orderNumber: 123321123,
            newAmount: "0.00000000",
            orderType: "canceled",
            clientOrderId: null
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
            clientOrderId: "12345"
          },
          {
            channel_id: 1000,
            subject: "killed",
            orderNumber: 12345,
            clientOrderId: null
          }
        ];
        let i = 0;
        server.on("connection", ws =>
          ws.send(JSON.stringify(rawAccountMessage))
        );
        client.on("message", message => {
          assert.deepStrictEqual(message, messages[i++]);
          if (i === messages.length) {
            server.close(done);
          }
        });
        client.connect();
      });

      test("Price aggregated book", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
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
                    "5000.00000000": "0.20000000"
                  },
                  {
                    "0.03118500": "50.78940000",
                    "0.03117855": "10.55121501",
                    "0.03117841": "6.20027213",
                    "0.00000003": "20000.00000000",
                    "0.00000002": "670207.00000000",
                    "0.00000001": "1462262.00000000"
                  }
                ]
              }
            ],
            ["o", 1, "0.01924381", "0.00000000"],
            ["t", "48555788", 0, "0.01924381", "0.60000000", 1580123594]
          ]
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
              "5000.00000000": "0.20000000"
            },
            bids: {
              "0.03118500": "50.78940000",
              "0.03117855": "10.55121501",
              "0.03117841": "6.20027213",
              "0.00000003": "20000.00000000",
              "0.00000002": "670207.00000000",
              "0.00000001": "1462262.00000000"
            }
          },
          {
            channel_id: 148,
            sequence: 818973992,
            currencyPair: "BTC_ETH",
            subject: "update",
            type: "bid",
            price: "0.01924381",
            size: "0.00000000"
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
            timestamp: 1580123594
          }
        ];
        let i = 0;
        server.on("connection", ws =>
          ws.send(JSON.stringify(rawPriceAggregatedBook))
        );
        client.on("message", message => {
          assert.deepStrictEqual(message, messages[i++]);
          if (i === messages.length) {
            server.close(done);
          }
        });
        client.connect();
      });
    });

    suite(".onError()", () => {
      test("emits `error`", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        const error = new Error("Some error");
        client.once("open", () => {
          if (!client.socket) {
            assert.fail("`socket` is not initialized");
          } else {
            client.socket.emit("error", error);
          }
        });
        client.once("error", err => {
          assert.deepStrictEqual(err, error);
          server.close(done);
        });
        client.connect();
      });

      test("with no error", done => {
        const server = new Server({ port });
        const client = new WebsocketClient({ wsUri });
        client.once("open", () => {
          if (!client.socket) {
            assert.fail("`socket` is not initialized");
          } else {
            client.socket.emit("error");
          }
        });
        client.once("error", () => {
          assert.fail("`error` was emitted");
        });
        client.connect();
        setTimeout(() => server.close(done), 10);
      });
    });
  });

  test("passes authentication details through", done => {
    const key = "poloniex-api-key";
    const secret = "poloniex-api-secret";
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri, key, secret });
    const nonce = 1;
    client.nonce = (): number => nonce;
    server.on("connection", ws => {
      ws.once("message", data => {
        const [channel] = DefaultChannels;
        const { sign } = SignRequest({ key, secret, form: { nonce } });
        assert.deepStrictEqual(JSON.parse(data), {
          command: "subscribe",
          channel,
          payload: "nonce=" + nonce.toString(),
          key,
          sign
        });
        server.close(done);
      });
    });
    client.connect();
  });
});
