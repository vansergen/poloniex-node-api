const PublicClient = require("./public.js");

class AuthenticatedClient extends PublicClient {
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
