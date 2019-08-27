const Websocket = require('ws');
const SignRequest = require('./signer.js');
const EventEmitter = require('events');
const { EXCHANGE_WS_URL, DEFAULT_CHANNELS } = require('./utilities.js');
const CURRENCIES = require('./currencies.json');
const CURRENCYPAIRS = require('./currencypairs.json');

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
    if (typeof channels === 'number') {
      channels = [channels];
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
          throw new Error('Could not connect (CONNECTING)');
        case Websocket.OPEN:
          return;
        case Websocket.CLOSING:
          throw new Error('Could not connect (CLOSING)');
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
        throw new Error('Could not disconnect (CONNECTING)');
      case Websocket.CLOSING:
        throw new Error('Could not disconnect (CLOSING)');
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

  static formatTicker([
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
      currencyPair: CURRENCYPAIRS[id],
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

  static formatVolume([time, users, volume]) {
    return { time, users, volume };
  }

  static formatUpdate(update) {
    const [id] = update;
    if (id === 'o') {
      const [, type, price, size] = update;
      return {
        subject: 'update',
        type: type ? 'buy' : 'sell',
        price,
        size,
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
        subject: 'publicTrade',
        tradeID,
        type: type ? 'buy' : 'sell',
        price,
        size,
        timestamp,
      };
    }
  }

  static formatAccount(update) {
    const [type] = update;
    if (type === 'b') {
      const [, id, wallet, amount] = update;
      return {
        subject: 'balance',
        currencyId: id,
        currency: CURRENCIES[id],
        wallet,
        amount,
      };
    } else if (type === 'n') {
      const [
        ,
        id,
        orderNumber,
        orderType,
        rate,
        amount,
        date,
        originalAmount,
        clientOrderId,
      ] = update;
      return {
        subject: 'new',
        id,
        currencyPair: CURRENCYPAIRS[id],
        orderNumber,
        type: orderType ? 'buy' : 'sell',
        rate,
        amount,
        date,
        originalAmount,
        clientOrderId,
      };
    } else if (type === 'o') {
      const [, orderNumber, newAmount, orderType, clientOrderId] = update;
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
        clientOrderId,
      };
    } else if (type === 'p') {
      const [
        ,
        orderNumber,
        id,
        rate,
        amount,
        orderType,
        clientOrderId,
      ] = update;
      return {
        subject: 'pending',
        orderNumber,
        currencyPair: CURRENCYPAIRS[id],
        rate,
        amount,
        type: orderType ? 'buy' : 'sell',
        clientOrderId,
      };
    } else if (type === 't') {
      const [
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
      ] = update;
      return {
        subject: 'trade',
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
    } else if (type === 'k') {
      const [, orderNumber, clientOrderId] = update;
      return { subject: 'killed', orderNumber, clientOrderId };
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

    if (jsondata.error) {
      return this.onError(jsondata);
    }

    const [channel_id, sequence, update] = jsondata;
    const message = { channel_id, sequence };

    if (channel_id === 1010) {
      message.subject = 'heartbeat';
    } else if (!update) {
      message.subject = sequence ? 'subscribed' : 'unsubscribed';
    } else if (channel_id === 1002) {
      message.subject = 'ticker';
      Object.assign(message, WebsocketClient.formatTicker(update));
    } else if (channel_id === 1003) {
      message.subject = 'volume';
      Object.assign(message, WebsocketClient.formatVolume(update));
    } else {
      for (let u of update) {
        this.emit(
          'message',
          Object.assign(
            channel_id === 1000
              ? WebsocketClient.formatAccount(u)
              : WebsocketClient.formatUpdate(u),
            message
          )
        );
      }
      return;
    }

    this.emit('message', message);
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
    return (this.nonce = Date.now());
  }
}

module.exports = WebsocketClient;
