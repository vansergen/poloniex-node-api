const PublicClient = require('./public.js');
const SignRequest = require('./signer.js');

class AuthenticatedClient extends PublicClient {
  /**
   * @param {Object} options
   * @param {string} options.key - The Key.
   * @param {boolean} options.secret - The Secret.
   * @param {string} [options.api_uri] - Overrides the default apiuri, if provided.
   * @param {number} [options.timeout] - Overrides the default timeout, if provided.
   * @throws Will throw an error if incomplete authentication credentials are provided.
   * @example
   * const Poloniex = require('poloniex-node-api');
   * const AuthenticatedClient = new Poloniex.AuthenticatedClient({
   *   key: 'my-api-key',
   *   secret: 'my-api-secret',
   * });
   * @description Create AuthenticatedClient.
   */
  constructor({ key, secret, ...other }) {
    super(other);
    this._requireProperties(key, secret);

    this.key = key;
    this.secret = secret;
  }

  /**
   * @param {Object} options
   * @param {string} options.command
   * @example
   * AuthenticatedClient.post({
   *   command: 'generateNewAddress',
   *   currency: 'ETH',
   * })
   *   .then(data => {
   *     console.log(data);
   *   })
   *   .catch(error => {
   *     console.error(error);
   *   });
   * @description Make `POST` request.
   */
  post(options) {
    const { command } = options;
    this._requireProperties(command);

    const auth = { key: this.key, secret: this.secret };
    const reqOptions = { form: this._removeUndefined(options), method: 'POST' };
    reqOptions.timeout = this.timeout;
    reqOptions.form.nonce = this._nonce();
    reqOptions.url = this.api_uri + '/tradingApi';
    reqOptions.headers = SignRequest(auth, reqOptions);

    return this.request(reqOptions);
  }

  /**
   * @example
   * const balances = AuthenticatedClient.getBalances();
   * @see {@link https://docs.poloniex.com/?shell#returnbalances|returnBalances}
   * @description Get all of your balances available for trade after having deducted all open orders.
   */
  getBalances() {
    return this.post({ command: 'returnBalances' });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.account] - Set the `account` parameter to "all" to include your margin and lending accounts.
   * @example
   * const balances = AuthenticatedClient.getCompleteBalances({ account: 'all' });
   * @see {@link https://docs.poloniex.com/?shell#returncompletebalances|returnCompleteBalances}
   * @description Get all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance.
   */
  getCompleteBalances({ account } = {}) {
    return this.post({ command: 'returnCompleteBalances', account });
  }

  /**
   * @example
   * const addresses = AuthenticatedClient.getDepositAddresses();
   * @see {@link https://docs.poloniex.com/?shell#returndepositaddresses|returnDepositAddresses}
   * @description Get all of your deposit addresses.
   */
  getDepositAddresses() {
    return this.post({ command: 'returnDepositAddresses' });
  }

  /**
   * @param {Object} options
   * @param {string} options.currency - The currency to use for the deposit address.
   * @example
   * const addresses = AuthenticatedClient.getNewAddress({ currency: 'BTC' });
   * @see {@link https://docs.poloniex.com/?shell#generatenewaddress|generateNewAddress}
   * @description Generate a new deposit address.
   */
  getNewAddress({ currency } = {}) {
    return this.post({ command: 'generateNewAddress', currency });
  }

  /**
   * @param {Object} options
   * @param {string} options.start - The start date of the range window in UNIX timestamp format.
   * @param {string} options.end - The end date of the range window in UNIX timestamp format.
   * @example
   * const deposits = AuthenticatedClient.getDepositsWithdrawals({
   *   start: 1539952118,
   *   end: 1540318271,
   * });
   * @description Get your adjustment, deposit, and withdrawal history within a range window.
   * @see {@link https://docs.poloniex.com/?shell#returndepositswithdrawals|returnDepositsWithdrawals}
   */
  getDepositsWithdrawals({ start, end } = {}) {
    this._requireProperties(start, end);

    return this.post({ command: 'returnDepositsWithdrawals', start, end });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair] - The major and minor currency that define this market.
   * @example
   * const orders = AuthenticatedClient.getOpenOrders();
   * @description Get your open orders for a given market.
   * @see {@link https://docs.poloniex.com/?shell#returnopenorders|returnOpenOrders}
   */
  getOpenOrders({ currencyPair = 'all' } = {}) {
    return this.post({ command: 'returnOpenOrders', currencyPair });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair] - The major and minor currency that define this market.
   * @param {string} [options.start] - The start date of the range window in UNIX timestamp format.
   * @param {string} [options.end] - The end date of the range window in UNIX timestamp format.
   * @param {string} [options.limit] - You may optionally limit the number of entries returned using the "limit" parameter, up to a maximum of 10,000. If the "limit" parameter is not specified, no more than 500 entries will be returned.
   * @example
   * const trades = AuthenticatedClient.getHistoryTrades();
   * @description Get your trade history for a given market.
   * @see {@link https://docs.poloniex.com/?shell#returntradehistory-private|returnTradeHistory}
   */
  getHistoryTrades({ currencyPair = 'all', start, end, limit } = {}) {
    return this.post({
      command: 'returnTradeHistory',
      currencyPair,
      start,
      end,
      limit,
    });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.orderNumber] - The order number whose trades you wish to query.
   * @example
   * const trades = AuthenticatedClient.getOrderTrades({ orderNumber: 96238912841 });
   * @description Get all trades involving a given order.
   * @see {@link https://docs.poloniex.com/?shell#returntradehistory-private|returnOrderTrades}
   */
  getOrderTrades({ orderNumber } = {}) {
    this._requireProperties(orderNumber);
    return this.post({ command: 'returnOrderTrades', orderNumber });
  }

  /**
   * @private
   * @example
   * const nonce = AuthenticatedClient._nonce();
   * @description Get new nonce.
   */
  _nonce() {
    if (typeof this.nonce === 'function') {
      return this.nonce();
    }
    return !this.nonce ? (this.nonce = Date.now()) : ++this.nonce;
  }
}

module.exports = AuthenticatedClient;
