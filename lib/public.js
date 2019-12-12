const request = require("request-promise-native");
const { HEADERS } = require("./utilities");

class PublicClient {
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
          const error =
            "`options` is missing a required property: `" + key + "`";
          throw new Error(error);
        }
      }
    }
  }
}

module.exports = PublicClient;
