const PublicClient = require("./public.js");

class AuthenticatedClient extends PublicClient {
  /**
   * @example
   * const fees = authClient.getFeeInfo();
   * @see {@link https://docs.poloniex.com/?shell#returnfeeinfo|returnFeeInfo}
   * @description Get your current trading fees and trailing 30-day volume in BTC.
   */
  getFeeInfo() {
    return this.post({ command: "returnFeeInfo" });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.account] - `exchange`, `margin` or `lending`.
   * @example
   * const balances = authClient.getAvailableAccountBalances({
   *   account: 'exchange',
   * });
   * @see {@link https://docs.poloniex.com/?shell#returnavailableaccountbalances|returnAvailableAccountBalances}
   * @description Get your balances sorted by account.
   */
  getAvailableAccountBalances({ account } = {}) {
    return this.post({ command: "returnAvailableAccountBalances", account });
  }

  /**
   * @example
   * const balances = authClient.getTradableBalances();
   * @see {@link https://docs.poloniex.com/?shell#returntradablebalances|returnTradableBalances}
   * @description Get your current tradable balances for each currency in each market for which margin trading is enabled.
   */
  getTradableBalances() {
    return this.post({ command: "returnTradableBalances" });
  }

  /**
   * @param {Object} options
   * @param {string} options.currency - The currency to transfer.
   * @param {number} options.amount - The amount of assets to transfer in this request.
   * @param {string} options.fromAccount - The account from which this value should be moved.
   * @param {string} options.toAccount - The account to which this value should be moved.
   * @example
   * const transfer = authClient.transferBalance({
   *   currency: 'ETH',
   *   amount: 10,
   *   fromAccount: 'lending',
   *   toAccount: 'margin',
   * });
   * @see {@link https://docs.poloniex.com/?shell#transferbalance|transferBalance}
   * @description Transfer funds from one account to another.
   */
  transferBalance({ currency, amount, fromAccount, toAccount } = {}) {
    AuthenticatedClient.filterProperties({
      currency,
      amount,
      fromAccount,
      toAccount
    });

    return this.post({
      command: "transferBalance",
      currency,
      amount,
      fromAccount,
      toAccount
    });
  }

  /**
   * @example
   * const summary = authClient.getMarginAccountSummary();
   * @see {@link https://docs.poloniex.com/?shell#returnmarginaccountsummary|returnMarginAccountSummary}
   * @description Get a summary of your entire margin account.
   */
  getMarginAccountSummary() {
    return this.post({ command: "returnMarginAccountSummary" });
  }

  /**
   * @param {Object} options
   * @param {string} [options.currencyPair] - The base and quote currency that define this market.
   * @param {number} options.rate - The number of base currency units to purchase one quote currency unit.
   * @param {number} options.amount - The amount of currency to buy in minor currency units.
   * @param {number} [options.lendingRate] - The interest rate you are willing to accept per day.
   * @param {number} [options.clientOrderId] - 64-bit Integer value used for tracking order. Must be unique across all open orders for each account.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const rate = 0.01;
   * const amount = 1;
   * const order = authClient.marginBuy({ currencyPair, rate, amount });
   * @description Place a margin buy order in a given market.
   * @see {@link https://docs.poloniex.com/?shell#marginbuy|marginBuy}
   */
  marginBuy({
    currencyPair = this.currencyPair,
    rate,
    amount,
    lendingRate,
    clientOrderId
  } = {}) {
    AuthenticatedClient.filterProperties({ currencyPair, rate, amount });

    return this.post({
      command: "marginBuy",
      currencyPair,
      rate,
      amount,
      lendingRate,
      clientOrderId
    });
  }

  /**
   * @param {Object} options
   * @param {string} [options.currencyPair] - The base and quote currency that define this market.
   * @param {number} options.rate - The number of base currency units to purchase one quote currency unit.
   * @param {number} options.amount - The amount of currency to sell in minor currency units.
   * @param {number} [options.lendingRate] - The interest rate you are willing to accept per day.
   * @param {number} [options.clientOrderId] - 64-bit Integer value used for tracking order. Must be unique across all open orders for each account.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const rate = 0.001;
   * const amount = 2;
   * const order = authClient.marginSell({ currencyPair, rate, amount });
   * @description Place a margin sell order in a given market.
   * @see {@link https://docs.poloniex.com/?shell#marginsell|marginSell}
   */
  marginSell({
    currencyPair = this.currencyPair,
    rate,
    amount,
    lendingRate,
    clientOrderId
  } = {}) {
    AuthenticatedClient.filterProperties({ currencyPair, rate, amount });

    return this.post({
      command: "marginSell",
      currencyPair,
      rate,
      amount,
      lendingRate,
      clientOrderId
    });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair='all'] - The major and minor currency that define this market.
   * @example
   * const position = authClient.getMarginPosition();
   * @description Get information about your margin position in a given market.
   * @see {@link https://docs.poloniex.com/?shell#getmarginposition|getMarginPosition}
   */
  getMarginPosition({ currencyPair = "all" } = {}) {
    return this.post({ command: "getMarginPosition", currencyPair });
  }

  /**
   * @param {Object} [options]
   * @param {string} [options.currencyPair] - The major and minor currency that define this market.
   * @example
   * const currencyPair = 'BTC_ETH';
   * const position = authClient.closeMarginPosition({ currencyPair });
   * @description Close your margin position in a given market using a market order.
   * @see {@link https://docs.poloniex.com/?shell#closemarginposition|closeMarginPosition}
   */
  closeMarginPosition({ currencyPair = this.currencyPair } = {}) {
    return this.post({ command: "closeMarginPosition", currencyPair });
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
   * const offer = await authClient.createLoanOffer({
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
    AuthenticatedClient.filterProperties({
      currency,
      amount,
      duration,
      autoRenew,
      lendingRate
    });

    return this.post({
      command: "createLoanOffer",
      currency,
      amount,
      duration,
      autoRenew,
      lendingRate
    });
  }

  /**
   * @param {Object} options
   * @param {string} options.orderNumber - The identification number of the offer to be canceled.
   * @example
   * const orderNumber = 1002013188;
   * const offer = await authClient.cancelLoanOffer({ orderNumber });
   * @description Cancel a loan offer.
   * @see {@link https://docs.poloniex.com/?shell#cancelloanoffer|cancelLoanOffer}
   */
  cancelLoanOffer({ orderNumber } = {}) {
    AuthenticatedClient.filterProperties({ orderNumber });

    return this.post({ command: "cancelLoanOffer", orderNumber });
  }

  /**
   * @example
   * const offers = authClient.getOpenLoanOffers();
   * @see {@link https://docs.poloniex.com/?shell#returnopenloanoffers|returnOpenLoanOffers}
   * @description Get your open loan offers for each currency.
   */
  getOpenLoanOffers() {
    return this.post({ command: "returnOpenLoanOffers" });
  }

  /**
   * @example
   * const loans = await authClient.getActiveLoans();
   * @description Get your active loans for each currency.
   * @see {@link https://docs.poloniex.com/#returnactiveloans|returnActiveLoans}
   */
  getActiveLoans() {
    return this.post({ command: "returnActiveLoans" });
  }

  /**
   * @param {Object} [options]
   * @param {number} [options.start] - The date in Unix timestamp format of the start of the window.
   * @param {number} [options.end] - The date in Unix timestamp format of the end of the window.
   * @param {number} [options.limit] - `limit` may also be specified to limit the number of rows returned.
   * @example
   * const history = await authClient.getLendingHistory();
   * @description Get your lending history.
   * @see {@link https://docs.poloniex.com/#returnlendinghistory|returnLendingHistory}
   */
  getLendingHistory({ start, end, limit } = {}) {
    return this.post({ command: "returnLendingHistory", start, end, limit });
  }

  /**
   * @param {Object} options
   * @param {number} options.orderNumber - The identifier of the order you want to toggle.
   * @example
   * const result = authClient.toggleAutoRenew({ orderNumber: 1002013188 });
   * @description Toggle the autoRenew setting on an active loan
   * @see {@link https://docs.poloniex.com/#toggleautorenew|toggleAutoRenew}
   */
  toggleAutoRenew({ orderNumber } = {}) {
    AuthenticatedClient.filterProperties({ orderNumber });

    return this.post({ command: "toggleAutoRenew", orderNumber });
  }
}

module.exports = AuthenticatedClient;
