const request = require("request-promise-native");
const {
  EXCHANGE_API_URL,
  DEFAULT_TIMEOUT,
  API_LIMIT,
  DEFAULT_PAIR,
  HEADERS
} = require("./utilities");

/**
 * @callback Callback
 * @param error
 * @param data
 */

class PublicClient {
  /**
   * @param {Object} [options={}]
   * @param {string} [options.currencyPair] - If `currencyPair` is provided then it will be used in all future requests that require `currencyPair` but it is omitted (not applied to requests where `currencyPair` is optional).
   * @param {string} [options.api_uri] - Overrides the default apiuri, if provided.
   * @param {number} [options.timeout] - Overrides the default timeout, if provided.
   * @example
   * const { PublicClient } = require('poloniex-node-api');
   * const currencyPair = 'BTC_DASH';
   * const publicClient = new PublicClient({ currencyPair });
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
  get({ ...qs } = {}) {
    const { command } = qs;
    PublicClient.filterProperties({ command });
    PublicClient.filterProperties(qs, true);

    const reqOptions = { qs, url: this.api_uri + "/public", method: "GET" };

    return this.request(reqOptions);
  }

  /**
   * @private
   * @param {Object} options
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
    options.timeout = this.timeout;
    Object.assign(options.headers, HEADERS);
    return new Promise((resolve, reject) => {
      request(options)
        .then(data => {
          if (data.error) {
            reject(data.error);
          } else if (!data.success && data.result && data.result.error) {
            reject(data.result.error);
          } else {
            resolve(data);
          }
        })
        .catch(error => reject(error.error || error));
    });
  }

  /**
   * @example
   * const tickers = await publicClient.getTickers();
   * @description Retrieves summary information for each currency pair listed on the exchange.
   * @see {@link https://docs.poloniex.com/?shell#returnticker|returnTicker}
   */
  getTickers() {
    return this.get({ command: "returnTicker" });
  }

  /**
   * @example
   * const volume = await publicClient.getVolume();
   * @description Retrieves the 24-hour volume for all markets as well as totals for primary currencies.
   * @see {@link https://docs.poloniex.com/?shell#return24hvolume|return24hVolume}
   */
  getVolume() {
    return this.get({ command: "return24hVolume" });
  }

  /**
   * @param {Object} [options={}]
   * @param {string} [options.currencyPair='all'] - A pair like `BTC_ETH` or `all`.
   * @param {number} [options.depth] - Max depth is `100`.
   * @example
   * const books = await publicClient.getOrderBook();
   * @see {@link https://docs.poloniex.com/?shell#returnorderbook|returnOrderBook}
   * @description Get the order book for a given market.
   */
  getOrderBook({ currencyPair = "all", depth = API_LIMIT } = {}) {
    return this.get({ command: "returnOrderBook", currencyPair, depth });
  }

  /**
   * @param {Object} [options={}]
   * @param {string} [options.currencyPair] - If `currencyPair` is not provided then the default currencyPair will be used.
   * @param {number} [options.start] - UNIX timestamp.
   * @param {number} [options.end] - UNIX timestamp.
   * @example
   * const history = await publicClient.getTradeHistory();
   * @see {@link https://docs.poloniex.com/?shell#returntradehistory-public|returnTradeHistory}
   * @description Get the past 200 trades for a given market, or up to 1,000 trades between a range `start` and `end`.
   */
  getTradeHistory({ currencyPair = this.currencyPair, start, end } = {}) {
    return this.get({
      command: "returnTradeHistory",
      currencyPair,
      start,
      end
    });
  }

  /**
   * @param {Object} options={}
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
    PublicClient.filterProperties({ period, start, end });

    return this.get({
      command: "returnChartData",
      currencyPair,
      period,
      start,
      end
    });
  }

  /**
   * @example
   * const currencies = await publicClient.getCurrencies();
   * @see {@link https://docs.poloniex.com/?shell#returncurrencies|returnCurrencies}
   * @description Get information about currencies.
   */
  getCurrencies() {
    return this.get({ command: "returnCurrencies" });
  }

  /**
   * @param {Object} options
   * @param {string} options.currency
   * @example
   * const loans = await publicClient.getLoanOrders({ currency: 'BTC' });
   * @see {@link https://docs.poloniex.com/?shell#returnloanorders|returnLoanOrders}
   * @description Get the list of loan offers and demands for a given currency.
   */
  getLoanOrders({ currency } = {}) {
    PublicClient.filterProperties({ currency });

    return this.get({ command: "returnLoanOrders", currency });
  }

  /**
   * @static
   * @private
   * @param {Object} [options={}]
   * @param {boolean} [remove=false]
   * @example
   * const { a, b, c } = { a: 0, b: 0 };
   * PublicClient.filterProperties({ a, b, c });
   * @example
   * const options = { a: 0, b: 0, c: undefined };
   * PublicClient.filterProperties(options, true);
   * @throws Will throw an error if one of the `properties` is undefined and `remove` is set to false.
   */
  static filterProperties(options = {}, remove = false) {
    const keys = Object.keys(options);
    for (const key of keys) {
      if (options[key] === undefined) {
        if (remove) {
          delete options[key];
        } else {
          const error = "`options` is missing a required property: `" + key + "`";
          throw new Error(error);
        }
      }
    }
  }
}

module.exports = PublicClient;
