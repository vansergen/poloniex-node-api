const crypto = require('crypto');
const querystring = require('querystring');

/**
 * @description SignRequest.
 * @param {Object} auth
 * @param {string} auth.key - The API key.
 * @param {string} auth.secret - The API secret.
 * @param {Object} [options={}] - Data to sign.
 * @example
 * const signature = Poloniex.SignRequest(
 *   { key: 'my-api-key', secret: 'my-api-secret' },
 *   { form: { command: 'returnBalances', nonce: 154264078495300 } }
 * );
 * @returns {Object} The object containg the key and the signature.
 */
const SignRequest = (auth, options = {}) => {
  let form = '';
  if (options.qs && Object.keys(options.qs).length) {
    form = '?' + querystring.stringify(options.qs);
  } else if (options.form) {
    form = querystring.stringify(options.form);
  }

  return {
    key: auth.key,
    sign: crypto
      .createHmac('sha512', auth.secret)
      .update(form)
      .digest('hex'),
  };
};

module.exports = SignRequest;
