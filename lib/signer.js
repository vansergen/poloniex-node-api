const crypto = require('crypto');
const querystring = require('querystring');

/**
 * @private
 * @description SignRequest.
 * @param {Object} auth
 * @param {string} auth.key - The API key.
 * @param {string} auth.secret - The API secret.
 * @param {Object} options
 * @param {Object} options.form - The form to sign.
 * @example
 * const auth = { key: 'my-api-key', secret: 'my-api-secret' };
 * const data = { form: { command: 'returnBalances', nonce: 154264078495300 } };
 * const signature = SignRequest(auth, data);
 * @returns {Object} The object containg the key and the signature.
 */
const SignRequest = (auth, options) => {
  return {
    key: auth.key,
    sign: crypto
      .createHmac('sha512', auth.secret)
      .update(querystring.stringify(options.form))
      .digest('hex'),
  };
};

module.exports = SignRequest;
