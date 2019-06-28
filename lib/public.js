const request = require('request-promise');
const {
  EXCHANGE_API_URL,
  DEFAULT_TIMEOUT,
  API_LIMIT,
  DEFAULT_PAIR,
  HEADERS,
} = require('./utilities');

class PublicClient {
  /**
   * @param {Object} [options={}]
   * @param {string} [options.currencyPair] - If `currencyPair` is provided then it will be used in all future requests that require `currencyPair` but it is omitted (not applied to requests where `currencyPair` is optional).
   * @param {string} [options.api_uri] - Overrides the default apiuri, if provided.
   * @param {number} [options.timeout] - Overrides the default timeout, if provided.
   * @example
   * const Poloniex = require('poloniex-node-api');
   * const publicClient = new Poloniex.PublicClient({ currencyPair: 'BTC_ETH' });
   * @description Create PublicClient.
   */
  constructor({ currencyPair, api_uri, timeout } = {}) {
    this.currencyPair = currencyPair || DEFAULT_PAIR;
    this.api_uri = api_uri ? api_uri : EXCHANGE_API_URL;
    this.timeout = timeout || DEFAULT_TIMEOUT;
  }

  /**
   * @private
   * @param {Object} options
   * @param {string} options.command
   * @example
   * publicClient
   *   .get({ command: 'returnOrderBook', currencyPair: 'USDT_BTC', depth: 25 })
   *   .then(data => {
   *     console.log(data);
   *   })
   *   .catch(error => {
   *     console.error(error);
   *   });
   * @throws Will throw an error if `options.command` is undefined.
   * @description Make `GET` request.
   */
  get(options) {
    const { command } = options;
    this._requireProperties(command);

    const reqOptions = { qs: this._removeUndefined(options), method: 'GET' };
    reqOptions.timeout = this.timeout;
    reqOptions.url = this.api_uri + '/public';

    return this.request(reqOptions);
  }

  /**
   * @param {Object} [options]
   * @example
   * publicClient
   *   .request({
   *     method: 'GET',
   *     qs: {
   *       command: 'returnTicker',
   *     },
   *     url: 'https://poloniex.com/public',
   *   })
   *   .then(data => {
   *     console.log(data);
   *   })
   *   .catch(error => {
   *     console.error(error);
   *   });
   * @description Make a request.
   */
  request(options) {
    options.json = true;
    options.headers = options.headers || {};
    Object.assign(options.headers, HEADERS);
    return new Promise((resolve, reject) => {
      request(options)
        .then(data => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        })
        .catch(error => reject(error));
    });
  }

  cb(method, callback, options) {
    try {
      this[method]
        .call(this, options)
        .then(data => callback(null, data))
        .catch(error => callback(error));
    } catch (error) {
      callback(error);
    }
  }

  /**
   * @example
   * const tickers = await publicClient.getTickers();
   * @description Retrieves summary information for each currency pair listed on the exchange.
   * @see {@link https://docs.poloniex.com/?shell#returnticker|returnTicker}
   */
  getTickers() {
    return this.get({ command: 'returnTicker' });
  }

  /**
   * @example
   * const volume = await publicClient.getVolume();
   * @description Retrieves the 24-hour volume for all markets as well as totals for primary currencies.
   * @see {@link https://docs.poloniex.com/?shell#return24hvolume|return24hVolume}
   */
  getVolume() {
    return this.get({ command: 'return24hVolume' });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair='all'] - A pair like `BTC_ETH` or `all`.
   * @param {number} [options.depth] - Max depth is `100`.
   * @example
   * const book = await publicClient.getOrderBook({
   *   depth: 25,
   *   currencyPair: 'USDT_ZEC',
   * });
   * @see {@link https://docs.poloniex.com/?shell#returnorderbook|returnOrderBook}
   * @description Get the order book for a given market.
   */
  getOrderBook({ currencyPair = 'all', depth = API_LIMIT } = {}) {
    return this.get({ command: 'returnOrderBook', currencyPair, depth });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair] - If `currencyPair` is not provided then the default currencyPair will be used.
   * @param {number} [options.start] - UNIX timestamp.
   * @param {number} [options.end] - UNIX timestamp.
   * @example
   * const history = await publicClient.getTradeHistory({
   *   currencyPair: 'USDT_ZEC',
   *   start: 1410158328,
   *   end: 1410488343,
   * });
   * @see {@link https://docs.poloniex.com/?shell#returntradehistory-public|returnTradeHistory}
   * @description Get the past 200 trades for a given market, or up to 1,000 trades between a range `start` and `end`.
   */
  getTradeHistory({ currencyPair = this.currencyPair, start, end } = {}) {
    return this.get({
      command: 'returnTradeHistory',
      currencyPair,
      start,
      end,
    });
  }

  /**
   * @param {Object} options
   * @param {string} [options.currencyPair] - If `currencyPair` is not provided then the default currencyPair will be used.
   * @param {number} options.period - Candlestick period in seconds. Valid values are 300, 900, 1800, 7200, 14400, and 86400.
   * @param {number} options.start - UNIX timestamp.
   * @param {number} options.end - UNIX timestamp.
   * @example
   * const publicClient = new Poloniex.PublicClient({ currencyPair: 'BTC_DASH' });
   * const candles = await publicClient.getChartData({
   *   start: 1546300800,
   *   end: 1546646400,
   *   period: 14400,
   * });
   * @see {@link https://docs.poloniex.com/?shell#returnchartdata|returnChartData}
   * @description Get candlestick chart data.
   */
  getChartData({ currencyPair = this.currencyPair, period, start, end } = {}) {
    this._requireProperties(period, start, end);

    return this.get({
      command: 'returnChartData',
      currencyPair,
      period,
      start,
      end,
    });
  }

  /**
   * @example
   * const currencies = await publicClient.getCurrencies();
   * @see {@link https://docs.poloniex.com/?shell#returncurrencies|returnCurrencies}
   * @description Get information about currencies.
   */
  getCurrencies() {
    return this.get({ command: 'returnCurrencies' });
  }

  /**
   * @param {Object} options
   * @param {string} options.currency
   * @example
   * const loans = publicClient.getLoanOrders({ currency: 'BTC' });
   * @see {@link https://docs.poloniex.com/?shell#returnloanorders|returnLoanOrders}
   * @description Get the list of loan offers and demands for a given currency.
   */
  getLoanOrders({ currency } = {}) {
    this._requireProperties(currency);

    return this.get({ command: 'returnLoanOrders', currency });
  }

  /**
   * @private
   * @param {...*} [properties]
   * @example
   * const { a, b, c } = { a: 0, b: 0 };
   * this._requireProperties(a, b, c);
   * @throws Will throw an error if one of the `properties` is undefined.
   */
  _requireProperties(...properties) {
    for (let property of properties) {
      if (property === undefined) {
        throw new Error('`options` is missing a required property`');
      }
    }
  }

  _removeUndefined(object) {
    let newObject = object;
    for (let key of Object.keys(object)) {
      if (object[key] === undefined) {
        delete newObject[key];
      }
    }
    return newObject;
  }
}

module.exports = PublicClient;
