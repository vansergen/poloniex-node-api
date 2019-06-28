const Websocket = require('ws');
const SignRequest = require('./signer.js');
const EventEmitter = require('events');
const {
  EXCHANGE_WS_URL,
  CURRENCYPAIR,
  DEFAULT_CHANNELS,
} = require('./utilities');

class WebsocketClient extends EventEmitter {
  /**
   * @param {Object} [options={}]
   * @param {string} [options.api_uri] - Overrides the default apiuri, if provided.
   * @param {boolean} [options.raw] - Unformatted messages will be emitted, if set to `true`.
   * @param {Array.<string|number>|string|number} [options.channels] - Channel id or an array of channel ids.
   * @param {string} [options.key] - Poliniex API key.
   * @param {string} [options.secret] - Poliniex API secret.
   * @example
   * const websocket = new Poloniex.WebsocketClient();
   * @see {@link https://docs.poloniex.com/?shell#websocket-api|websocket}
   * @description Create WebsocketClient.
   */
  constructor({ api_uri, raw, channels, key, secret } = {}) {
    super();
    this.websocketURI = api_uri ? api_uri : EXCHANGE_WS_URL;
    this.raw = raw ? true : false;
    if (typeof channels === 'string') {
      channels = channels ? [channels] : DEFAULT_CHANNELS;
    }
    this.channels = channels && channels.length ? channels : DEFAULT_CHANNELS;
    if (key && secret) {
      this.key = key;
      this.secret = secret;
    }
  }

  /**
   * @description Connect to the websocket.
   * @throws Will throw an error if it is not disconnected.
   * @example
   * websocket.connect();
   */
  connect() {
    if (this.socket) {
      switch (this.socket.readyState) {
        case Websocket.CONNECTING:
        case Websocket.OPEN:
          return;
        case Websocket.CLOSING:
          throw new Error('Could not connect (not disconnected)');
      }
    }

    this.socket = new Websocket(this.websocketURI);
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.on('open', this.onOpen.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
  }

  /**
   * @description Disconnect from the websocket.
   * @throws Will throw an error if it is not connected.
   * @example
   * websocket.disconnect();
   */
  disconnect() {
    if (!this.socket) {
      return;
    }
    switch (this.socket.readyState) {
      case Websocket.CONNECTING:
        throw new Error('Could not disconnect (not connected)');
      case Websocket.CLOSING:
      case Websocket.CLOSED:
        return;
    }

    this.socket.close();
  }

  _sendSubscription(subscription) {
    const message = subscription;

    if (this.key) {
      const nonce = this._nonce();
      message.payload = 'nonce=' + nonce;
      const auth = { key: this.key, secret: this.secret };
      const signature = SignRequest(auth, { form: { nonce: nonce } });
      Object.assign(message, signature);
    }

    this.socket.send(JSON.stringify(message));
  }

  /**
   * @param {(string|number)} channel - Channel id.
   * @example
   * websocket.subscribe(channel_id);
   * @description Subscribes to the specified channel.
   */
  subscribe(channel) {
    this._sendSubscription({ command: 'subscribe', channel });
  }

  /**
   * @param {(string|number)} channel - Channel id.
   * @example
   * websocket.subscribe(channel_id);
   * @description Unsubscribes from the specified channel.
   */
  unsubscribe(channel) {
    this._sendSubscription({ command: 'unsubscribe', channel });
  }

  _formatTicker([
    id,
    last,
    lowestAsk,
    highestBid,
    percentChange,
    baseVolume,
    quoteVolume,
    isFrozen,
    high24hr,
    low24hr,
  ]) {
    return {
      id,
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen,
      high24hr,
      low24hr,
    };
  }

  _formatVolume([time, users, volume]) {
    return { time, users, volume };
  }

  _formatUpdate(update) {
    const [id] = update;
    if (id === 'o') {
      const [, type, price, size] = update;
      return {
        subject: 'update',
        type: type ? 'buy' : 'sell',
        price: price,
        size: size,
      };
    } else if (id === 'i') {
      const [, book] = update;
      const [asks, bids] = book.orderBook;
      return {
        subject: 'snapshot',
        currencyPair: book.currencyPair,
        asks,
        bids,
      };
    } else if (id === 't') {
      const [, tradeID, type, price, size, timestamp] = update;
      return {
        subject: 'trade',
        tradeID: tradeID,
        type: type ? 'buy' : 'sell',
        price: price,
        size: size,
        timestamp: timestamp,
      };
    }
  }

  _formatAccount(update) {
    const [id] = update;
    if (id === 'b') {
      const [, id, wallet, amount] = update;
      return {
        subject: 'balance',
        id,
        currencyPair: CURRENCYPAIR(id),
        wallet,
        amount,
      };
    } else if (id === 'n') {
      const [, id, orderNumber, orderType, rate, amount, date] = update;
      return {
        subject: 'new',
        id,
        currencyPair: CURRENCYPAIR(id),
        orderNumber,
        type: orderType ? 'buy' : 'sell',
        rate,
        amount,
        date,
      };
    } else if (id === 'o') {
      const [, orderNumber, newAmount, orderType] = update;
      return {
        subject: 'order',
        orderNumber,
        newAmount,
        orderType:
          orderType === 'f'
            ? 'filled'
            : orderType === 'c'
            ? 'canceled'
            : 'self-trade',
      };
    }
  }

  /**
   * @private
   * @fires WebsocketClient#open
   */
  onOpen() {
    this.emit('open');
    for (let channel of this.channels) {
      this.subscribe(channel);
    }
  }

  /**
   * @private
   * @fires WebsocketClient#close
   */
  onClose() {
    this.emit('close');
  }

  /**
   * @private
   * @fires WebsocketClient#message
   * @fires WebsocketClient#raw
   */
  onMessage(data) {
    const jsondata = JSON.parse(data);
    if (this.raw) {
      this.emit('raw', jsondata);
    }
    if (jsondata.type === 'error') {
      this.onError(jsondata);
    } else {
      const [channel_id, sequence, update] = jsondata;
      const message = { channel_id, sequence };

      if (channel_id === 1010) {
        message.subject = 'heartbeat';
      } else if (!update) {
        message.subject = sequence ? 'subscribed' : 'unsubscribed';
      } else if (channel_id === 1002) {
        message.subject = 'ticker';
        Object.assign(message, this._formatTicker(update));
        message.currencyPair = CURRENCYPAIR(message.id);
      } else if (channel_id === 1003) {
        message.subject = 'volume';
        Object.assign(message, this._formatVolume(update));
      } else {
        for (let u of update) {
          this.emit(
            'message',
            Object.assign(
              channel_id === 1000
                ? this._formatAccount(u)
                : this._formatUpdate(u),
              message
            )
          );
        }
        return;
      }

      this.emit('message', message);
    }
  }

  /**
   * @private
   * @fires WebsocketClient#error
   */
  onError(error) {
    if (!error) {
      return;
    }
    this.emit('error', error);
  }

  /**
   * @private
   * @description Get new nonce.
   */
  _nonce() {
    if (typeof this.nonce === 'function') {
      return this.nonce();
    }
    return !this.nonce ? (this.nonce = Date.now()) : ++this.nonce;
  }
}

module.exports = WebsocketClient;
