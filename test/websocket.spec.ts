import * as assert from "assert";
import { WebsocketClient, WsUri, DefaultChannels, SignRequest } from "../index";
import { Server } from "ws";

const port = 10000;
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

  test(".disconnect()", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    server.on("connection", ws => {
      ws.once("message", data => {
        const [channel] = DefaultChannels;
        const command = "subscribe";
        assert.deepStrictEqual(JSON.parse(data), { command, channel });
        client.disconnect();
      });
    });
    client.once("close", () => server.close(done));
    client.connect();
  });

  test(".subscribe()", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    const channelToSubscribe = 1003;
    server.on("connection", ws => {
      ws.once("message", data => {
        const [channel] = DefaultChannels;
        const command = "subscribe";
        assert.deepStrictEqual(JSON.parse(data), { command, channel });
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

  test(".unsubscribe()", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    const channelToUnsubscribe = 1003;
    server.on("connection", ws => {
      ws.once("message", data => {
        const [channel] = DefaultChannels;
        const command = "subscribe";
        assert.deepStrictEqual(JSON.parse(data), { command, channel });
        ws.once("message", data => {
          const channel = channelToUnsubscribe;
          const command = "unsubscribe";
          assert.deepStrictEqual(JSON.parse(data), { command, channel });
          server.close(done);
        });
        client.unsubscribe(channelToUnsubscribe);
      });
    });
    client.connect();
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

  test("emits errors when receiving an error message", done => {
    const server = new Server({ port });
    const client = new WebsocketClient({ wsUri });
    const error = "Permission denied.";
    server.once("connection", ws => {
      ws.send(JSON.stringify({ error }));
    });
    client.once("error", data => {
      assert.deepStrictEqual(data, { error });
      server.close(done);
    });
    client.connect();
  });
});
