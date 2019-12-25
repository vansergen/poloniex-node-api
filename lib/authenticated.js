const PublicClient = require("./public.js");

class AuthenticatedClient extends PublicClient {
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
