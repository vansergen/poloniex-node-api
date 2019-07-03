const PublicClient = require('./public.js');
const SignRequest = require('./signer.js');

class AuthenticatedClient extends PublicClient {
  /**
   * @param {Object} options
   * @param {string} options.key - The Key.
   * @param {boolean} options.secret - The Secret.
   * @param {string} [options.api_uri] - Overrides the default apiuri, if provided.
   * @param {number} [options.timeout] - Overrides the default timeout, if provided.
   * @param {string} [options.currencyPair] - If `currencyPair` is provided then it will be used in all future requests that require `currencyPair` but it is omitted (not applied to requests where `currencyPair` is optional).
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
    this._requireProperties(currency);

    return this.post({ command: 'generateNewAddress', currency });
  }

  /**
   * @param {Object} options
   * @param {number} options.start - The start date of the range window in UNIX timestamp format.
   * @param {number} options.end - The end date of the range window in UNIX timestamp format.
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
   * @param {string} [options.currencyPair='all'] - The major and minor currency that define this market.
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
   * @param {string} [options.currencyPair='all'] - The major and minor currency that define this market.
   * @param {number} [options.start] - The start date of the range window in UNIX timestamp format.
   * @param {number} [options.end] - The end date of the range window in UNIX timestamp format.
   * @param {number} [options.limit] - You may optionally limit the number of entries returned using the "limit" parameter, up to a maximum of 10,000. If the "limit" parameter is not specified, no more than 500 entries will be returned.
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
   * @param {Object} options
   * @param {number} options.orderNumber - The order number whose trades you wish to query.
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
   * @param {Object} options
   * @param {string} options.orderNumber - The identifier of the order to return.
   * @example
   * const trades = AuthenticatedClient.getOrderStatus({ orderNumber: 9623891284 });
   * @description Get the status of a given order.
   * @see {@link https://docs.poloniex.com/?shell#returnorderstatus|returnOrderStatus}
   */
  getOrderStatus({ orderNumber } = {}) {
    this._requireProperties(orderNumber);

    return this.post({ command: 'returnOrderStatus', orderNumber });
  }

  /**
   * @param {Object} options
   * @param {string} [options.currencyPair] - The major and minor currency defining the market where this buy order should be placed.
   * @param {number} options.rate - The rate to purchase one major unit for this trade.
   * @param {number} options.amount - The total amount of minor units offered in this buy order.
   * @param {number} [options.fillOrKill] - Set to `1` if this order should either fill in its entirety or be completely aborted.
   * @param {number} [options.immediateOrCancel] - Set to `1` if this order can be partially or completely filled, but any portion of the order that cannot be filled immediately will be canceled.
   * @param {number} [options.postOnly] - Set to `1` if you want this buy order to only be placed if no portion of it fills immediately.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const rate = 0.01;
   * const amount = 1;
   * const order = AuthenticatedClient.buy({ currencyPair, rate, amount });
   * @description Places a limit buy order.
   * @see {@link https://docs.poloniex.com/?shell#buy|buy}
   */
  buy({
    currencyPair = this.currencyPair,
    rate,
    amount,
    fillOrKill,
    immediateOrCancel,
    postOnly,
  } = {}) {
    this._requireProperties(currencyPair, rate, amount);

    return this.post({
      command: 'buy',
      currencyPair,
      rate,
      amount,
      fillOrKill,
      immediateOrCancel,
      postOnly,
    });
  }

  /**
   * @param {Object} options
   * @param {string} [options.currencyPair] - The major and minor currency defining the market where this buy order should be placed.
   * @param {number} options.rate - The rate to purchase one major unit for this trade.
   * @param {number} options.amount - The total amount of minor units offered in this sell order.
   * @param {number} [options.fillOrKill] - Set to `1` if this order should either fill in its entirety or be completely aborted.
   * @param {number} [options.immediateOrCancel] - Set to `1` if this order can be partially or completely filled, but any portion of the order that cannot be filled immediately will be canceled.
   * @param {number} [options.postOnly] - Set to `1` if you want this buy order to only be placed if no portion of it fills immediately.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const rate = 0.01;
   * const amount = 1;
   * const order = AuthenticatedClient.sell({ currencyPair, rate, amount });
   * @description Places a limit sell order.
   * @see {@link https://docs.poloniex.com/?shell#sell|sell}
   */
  sell({
    currencyPair = this.currencyPair,
    rate,
    amount,
    fillOrKill,
    immediateOrCancel,
    postOnly,
  } = {}) {
    this._requireProperties(currencyPair, rate, amount);

    return this.post({
      command: 'sell',
      currencyPair,
      rate,
      amount,
      fillOrKill,
      immediateOrCancel,
      postOnly,
    });
  }

  /**
   * @param {Object} options
   * @param {string} options.orderNumber - The identity number of the order to be canceled.
   * @example
   * const order = AuthenticatedClient.cancelOrder({ orderNumber: 514845991795 });
   * @description Cancel an order you have placed in a given market.
   * @see {@link https://docs.poloniex.com/?shell#cancelorder|cancelOrder}
   */
  cancelOrder({ orderNumber } = {}) {
    this._requireProperties(orderNumber);

    return this.post({ command: 'cancelOrder', orderNumber });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair] - The base and quote currency that define a market.
   * @example
   * const order = AuthenticatedClient.cancelAllOrders({ currencyPair: 'BTC_ETH' });
   * @description Cancel all open orders in a given market or, if no market is provided, all open orders in all markets.
   * @see {@link https://docs.poloniex.com/?shell#cancelallorders|cancelAllOrders}
   */
  cancelAllOrders({ currencyPair } = {}) {
    return this.post({ command: 'cancelAllOrders', currencyPair });
  }

  /**
   * @param {Object} options
   * @param {number} options.orderNumber - The identity number of the order to be canceled.
   * @param {number} options.rate - New rate.
   * @param {number} [options.amount] - If you wish to change the amount of the new order.
   * @param {number} [options.postOnly] - Set to `1` if you want this buy order to only be placed if no portion of it fills immediately.
   * @param {number} [options.immediateOrCancel] - Set to `1` if this order can be partially or completely filled, but any portion of the order that cannot be filled immediately will be canceled.
   * @example
   * const order = AuthenticatedClient.moveOrder({
   *   orderNumber: 514851026755,
   *   rate: 0.00015,
   * });
   * @description Cancels an order and places a new one of the same type in a single atomic transaction.
   * @see {@link https://docs.poloniex.com/?shell#moveorder|moveOrder}
   */
  moveOrder({ orderNumber, rate, amount, postOnly, immediateOrCancel } = {}) {
    this._requireProperties(orderNumber, rate);

    return this.post({
      command: 'moveOrder',
      orderNumber,
      rate,
      amount,
      postOnly,
      immediateOrCancel,
    });
  }

  /**
   * @param {Object} options
   * @param {string} options.currency
   * @param {number} options.amount
   * @param {string} options.address
   * @param {string|number} [options.paymentId] - For withdrawals which support payment IDs.
   * @param {string} [options.currencyToWithdrawAs] - Set to `USDTTRON` and set `currency` to `USDT` to withdraw `USDT-TRON`.
   * @example
   * const withdraw = AuthenticatedClient.withdraw({
   *   currency: 'ETH',
   *   amount: 2,
   *   address: '0x84a90e21d9d02e30ddcea56d618aa75ba90331ff',
   * });
   * @description Immediately place a withdrawal for a given currency.
   * @see {@link https://docs.poloniex.com/?shell#withdraw|withdraw}
   */
  withdraw({
    currency,
    amount,
    address,
    paymentId,
    currencyToWithdrawAs,
  } = {}) {
    this._requireProperties(currency, amount, address);

    return this.post({
      command: 'withdraw',
      currency,
      amount,
      address,
      paymentId,
      currencyToWithdrawAs,
    });
  }

  /**
   * @example
   * const fees = AuthenticatedClient.getFeeInfo();
   * @see {@link https://docs.poloniex.com/?shell#returnfeeinfo|returnFeeInfo}
   * @description Get your current trading fees and trailing 30-day volume in BTC.
   */
  getFeeInfo() {
    return this.post({ command: 'returnFeeInfo' });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.account] - `exchange`, `margin` or `lending`.
   * @example
   * const balances = AuthenticatedClient.getAvailableAccountBalances({
   *   account: 'exchange',
   * });
   * @see {@link https://docs.poloniex.com/?shell#returnavailableaccountbalances|returnAvailableAccountBalances}
   * @description Get your balances sorted by account.
   */
  getAvailableAccountBalances({ account } = {}) {
    return this.post({ command: 'returnAvailableAccountBalances', account });
  }

  /**
   * @example
   * const balances = AuthenticatedClient.getTradableBalances();
   * @see {@link https://docs.poloniex.com/?shell#returntradablebalances|returnTradableBalances}
   * @description Get your current tradable balances for each currency in each market for which margin trading is enabled.
   */
  getTradableBalances() {
    return this.post({ command: 'returnTradableBalances' });
  }

  /**
   * @param {Object} options
   * @param {string} options.currency - The currency to transfer.
   * @param {number} options.amount - The amount of assets to transfer in this request.
   * @param {string} options.fromAccount - The account from which this value should be moved.
   * @param {string} options.toAccount - The account to which this value should be moved.
   * @example
   * const transfer = AuthenticatedClient.transferBalance({
   *   currency: 'ETH',
   *   amount: 10,
   *   fromAccount: 'lending',
   *   toAccount: 'margin',
   * });
   * @see {@link https://docs.poloniex.com/?shell#transferbalance|transferBalance}
   * @description Transfer funds from one account to another.
   */
  transferBalance({ currency, amount, fromAccount, toAccount } = {}) {
    this._requireProperties(currency, amount, fromAccount, toAccount);

    return this.post({
      command: 'transferBalance',
      currency,
      amount,
      fromAccount,
      toAccount,
    });
  }

  /**
   * @example
   * const summary = AuthenticatedClient.getMarginAccountSummary();
   * @see {@link https://docs.poloniex.com/?shell#returnmarginaccountsummary|returnMarginAccountSummary}
   * @description Get a summary of your entire margin account.
   */
  getMarginAccountSummary() {
    return this.post({ command: 'returnMarginAccountSummary' });
  }

  /**
   * @param {Object} options
   * @param {string} [options.currencyPair] - The base and quote currency that define this market.
   * @param {number} options.rate - The number of base currency units to purchase one quote currency unit.
   * @param {number} options.amount - The amount of currency to buy in minor currency units.
   * @param {number} [options.lendingRate] - The interest rate you are willing to accept per day.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const rate = 0.01;
   * const amount = 1;
   * const order = AuthenticatedClient.marginBuy({ currencyPair, rate, amount });
   * @description Place a margin buy order in a given market.
   * @see {@link https://docs.poloniex.com/?shell#marginbuy|marginBuy}
   */
  marginBuy({
    currencyPair = this.currencyPair,
    rate,
    amount,
    lendingRate,
  } = {}) {
    this._requireProperties(currencyPair, rate, amount);

    return this.post({
      command: 'marginBuy',
      currencyPair,
      rate,
      amount,
      lendingRate,
    });
  }

  /**
   * @param {Object} options
   * @param {string} [options.currencyPair] - The base and quote currency that define this market.
   * @param {number} options.rate - The number of base currency units to purchase one quote currency unit.
   * @param {number} options.amount - The amount of currency to sell in minor currency units.
   * @param {number} [options.lendingRate] - The interest rate you are willing to accept per day.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const rate = 0.001;
   * const amount = 2;
   * const order = AuthenticatedClient.marginSell({ currencyPair, rate, amount });
   * @description Place a margin sell order in a given market.
   * @see {@link https://docs.poloniex.com/?shell#marginsell|marginSell}
   */
  marginSell({
    currencyPair = this.currencyPair,
    rate,
    amount,
    lendingRate,
  } = {}) {
    this._requireProperties(currencyPair, rate, amount);

    return this.post({
      command: 'marginSell',
      currencyPair,
      rate,
      amount,
      lendingRate,
    });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair='all'] - The major and minor currency that define this market.
   * @example
   * const position = AuthenticatedClient.getMarginPosition();
   * @description Get information about your margin position in a given market.
   * @see {@link https://docs.poloniex.com/?shell#getmarginposition|getMarginPosition}
   */
  getMarginPosition({ currencyPair = 'all' } = {}) {
    return this.post({ command: 'getMarginPosition', currencyPair });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair] - The major and minor currency that define this market.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const position = AuthenticatedClient.closeMarginPosition({ currencyPair });
   * @description Close your margin position in a given market using a market order.
   * @see {@link https://docs.poloniex.com/?shell#closemarginposition|closeMarginPosition}
   */
  closeMarginPosition({ currencyPair = this.currencyPair } = {}) {
    return this.post({ command: 'closeMarginPosition', currencyPair });
  }

  /**
   * @param {Object} options
   * @param {string} options.currency - Denotes the currency for this loan offer.
   * @param {number} options.amount - The total amount of currency offered.
   * @param {number} options.duration - The maximum duration of this loan in days (from 2 to 60, inclusive).
   * @param {number} options.autoRenew - Denotes if this offer should be reinstated with the same settings after having been taken.
   * @param {number} options.lendingRate - The interest rate.
   * @example
   * const currency = 'BTC';
   * const amount = 0.1;
   * const duration = 2;
   * const autoRenew = 0;
   * const lendingRate = 0.015;
   * const offer = await AuthenticatedClient.createLoanOffer({
   *   currency,
   *   amount,
   *   duration,
   *   autoRenew,
   *   lendingRate,
   * });
   * @description Create a loan offer for a given currency.
   * @see {@link https://docs.poloniex.com/?shell#createloanoffer|createLoanOffer}
   */
  createLoanOffer({ currency, amount, duration, autoRenew, lendingRate } = {}) {
    this._requireProperties(currency, amount, duration, autoRenew, lendingRate);

    return this.post({
      command: 'createLoanOffer',
      currency,
      amount,
      duration,
      autoRenew,
      lendingRate,
    });
  }

  /**
   * @param {Object} options
   * @param {string} options.orderNumber - The identification number of the offer to be canceled.
   * @example
   * const orderNumber = 1002013188;
   * const offer = await AuthenticatedClient.cancelLoanOffer({ orderNumber });
   * @description Cancel a loan offer.
   * @see {@link https://docs.poloniex.com/?shell#cancelloanoffer|cancelLoanOffer}
   */
  cancelLoanOffer({ orderNumber } = {}) {
    this._requireProperties(orderNumber);

    return this.post({ command: 'cancelLoanOffer', orderNumber });
  }

  /**
   * @example
   * const offers = AuthenticatedClient.getOpenLoanOffers();
   * @see {@link https://docs.poloniex.com/?shell#returnopenloanoffers|returnOpenLoanOffers}
   * @description Get your open loan offers for each currency.
   */
  getOpenLoanOffers() {
    return this.post({ command: 'returnOpenLoanOffers' });
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
