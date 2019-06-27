const request = require('request-promise');
const { HEADERS } = require('./utilities');

class PublicClient {
  /**
   * @example
   * const Poloniex = require('poloniex-node-api');
   * const publicClient = new Poloniex.PublicClient();
   * @description Create PublicClient.
   */
  constructor() {}

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
}

module.exports = PublicClient;
