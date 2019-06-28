const assert = require('assert');
const wsserver = require('./lib/ws.js');

const Poloniex = require('../index.js');

const { EXCHANGE_WS_URL, DEFAULT_CHANNELS } = require('../lib/utilities');

const port = 56365;

suite('WebsocketClient', () => {
  test('.constructor()', () => {
    const client = new Poloniex.WebsocketClient({
      raw: true,
      key: 'somekey',
    });
    assert.deepEqual(client.websocketURI, EXCHANGE_WS_URL);
    assert.deepEqual(client.raw, true);
    assert.deepEqual(client.key, undefined);
    assert.deepEqual(client.secret, undefined);
  });

  test('connects to the default channel', done => {
    const server = wsserver(port, () => {
      const client = new Poloniex.WebsocketClient({
        api_uri: 'ws://localhost:' + port,
      });
      client.connect();
    });
    server.on('connection', socket => {
      socket.on('message', data => {
        const msg = JSON.parse(data);
        const [channel] = DEFAULT_CHANNELS;
        assert.deepEqual(msg.command, 'subscribe');
        assert.deepEqual(msg.channel, channel);
        server.close();
        done();
      });
    });
  });

  test('subscribes to the specified channels', done => {
    let client;
    const channels = [1000, 1002, 1003, 148];
    const server = wsserver(port, () => {
      client = new Poloniex.WebsocketClient({
        api_uri: 'ws://localhost:' + port,
        channels: channels,
      });
      client.connect();
    });
    server.on('connection', socket => {
      let subscribed = [];
      socket.on('message', data => {
        const msg = JSON.parse(data);
        assert.deepEqual(msg.command, 'subscribe');
        assert.ok(channels.includes(msg.channel));
        subscribed.push(msg.channel);
        if (subscribed.length === channels.length) {
          server.close();
          done();
        }
      });
    });
  });

  test('unsubscribes from a channel', done => {
    let client;
    const server = wsserver(port, () => {
      client = new Poloniex.WebsocketClient({
        api_uri: 'ws://localhost:' + port,
      });
      client.connect();
    });
    server.on('connection', socket => {
      socket.once('message', data => {
        const msg = JSON.parse(data);
        assert.deepEqual(msg.command, 'subscribe');

        socket.on('message', data => {
          const msg = JSON.parse(data);
          assert.deepEqual(msg.command, 'unsubscribe');
          assert.deepEqual(msg.channel, 148);

          server.close();
          done();
        });
        client.unsubscribe(148);
      });
    });
  });

  test('subscribes to a channel', done => {
    let client;
    const channel = 148;
    const server = wsserver(port, () => {
      client = new Poloniex.WebsocketClient({
        api_uri: 'ws://localhost:' + port,
      });
      client.connect();
    });
    server.on('connection', socket => {
      socket.once('message', data => {
        const msg = JSON.parse(data);
        assert.deepEqual(msg.command, 'subscribe');

        socket.on('message', data => {
          const msg = JSON.parse(data);
          assert.deepEqual(msg.command, 'subscribe');
          assert.deepEqual(msg.channel, channel);

          server.close();
          done();
        });
        client.subscribe(channel);
      });
    });
  });

  test('passes authentication details through', done => {
    const key = 'poloniex-api-key';
    const secret = 'poloniex-api-secret';
    const server = wsserver(port, () => {
      const client = new Poloniex.WebsocketClient({
        api_uri: 'ws://localhost:' + port,
        key: key,
        secret: secret,
      });
      client.nonce = () => 1;
      client.connect();
    });
    server.on('connection', socket => {
      socket.on('message', data => {
        const msg = JSON.parse(data);
        assert.deepEqual(msg.command, 'subscribe');
        assert.deepEqual(msg.key, key);
        assert.deepEqual(msg.payload, 'nonce=1');
        assert(msg.sign);
        server.close();
        done();
      });
    });
  });

  test('emits errors when receiving an error message', done => {
    const server = wsserver(port, () => {
      const client = new Poloniex.WebsocketClient({
        api_uri: 'ws://localhost:' + port,
      });

      client.once('error', err => {
        assert.deepEqual(err.message, 'error message');
        assert.deepEqual(err.reason, 'error reason');
        done();
      });
      client.connect();
    });

    server.once('connection', socket => {
      socket.send(
        JSON.stringify({
          type: 'error',
          message: 'error message',
          reason: 'error reason',
        })
      );
      socket.on('message', () => {
        server.close();
      });
    });
  });
});
