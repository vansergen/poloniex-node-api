const assert = require('assert');

const Poloniex = require('../index.js');

const signer = Poloniex.SignRequest;

suite('SignRequest', () => {
  test('correct signature', () => {
    const auth = { key: 'my-key', secret: 'my-secret' };
    const options = { command: 'returnBalances', nonce: 154264078495300 };

    const expectedSignature = {
      key: 'my-key',
      sign:
        'bdc6e7e6cb09defc78ca52bb0d019d595cc1d90b7f3dee9c03b59c388aae4cd3650f4c342d7277c3b11adbf6c55d3ea0f6f54b97f3defb597cd558b7efa81817',
    };
    const signtature = signer(auth, options);
    assert.deepEqual(signtature, expectedSignature);
  });
});
