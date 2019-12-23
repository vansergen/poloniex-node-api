const PublicClient = require("./public.js");

class AuthenticatedClient extends PublicClient {
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
