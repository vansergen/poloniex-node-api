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
    const reqOptions = { form: options, timeout: this.timeout, method: 'POST' };
    reqOptions.form.nonce = this._nonce();
    reqOptions.url = this.api_uri + '/tradingApi';
    reqOptions.headers = SignRequest(auth, reqOptions);

    return this.request(reqOptions);
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
