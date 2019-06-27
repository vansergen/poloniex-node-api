const request = require('request-promise');
const { EXCHANGE_API_URL, DEFAULT_TIMEOUT, HEADERS } = require('./utilities');

class PublicClient {
  /**
   * @param {Object} [options={}]
   * @param {string} [options.api_uri] - Overrides the default apiuri, if provided.
   * @param {number} [options.timeout] - Overrides the default timeout, if provided.
   * @example
   * const Poloniex = require('poloniex-node-api');
   * const publicClient = new Poloniex.PublicClient();
   * @description Create PublicClient.
   */
  constructor({ api_uri = EXCHANGE_API_URL, timeout = DEFAULT_TIMEOUT } = {}) {
    this.api_uri = api_uri;
    this.timeout = timeout;
  }

  /**
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

    const reqOptions = { qs: options, timeout: this.timeout, method: 'GET' };
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
}

module.exports = PublicClient;
