const assert = require('assert');
const nock = require('nock');

const Poloniex = require('../index.js');
const { EXCHANGE_API_URL } = require('../lib/utilities');

const key = 'poloniex-api-key';
const secret = 'poloniex-api-secret';

const authClient = new Poloniex.AuthenticatedClient({
  key: key,
  secret: secret,
});

suite('AuthenticatedClient', () => {
  teardown(() => nock.cleanAll());

  test('.constructor() (throws error with incomplete credentials)', done => {
    try {
      new Poloniex.AuthenticatedClient({ key: key });
    } catch (error) {
      if (error.message === '`options` is missing a required property`') {
        done();
      }
    }
    assert.fail();
  });

  test('.constructor() (passes options to PublicClient)', () => {
    const newApi = 'https://new-poloniex-api-url.com';
    const newTimeout = 9000;
    const client = new Poloniex.AuthenticatedClient({
      key: key,
      currencyPair: 'BTC_ETH',
      secret: secret,
      timeout: newTimeout,
      api_uri: newApi,
    });
    assert.deepEqual(client.key, key);
    assert.deepEqual(client.secret, secret);
    assert.deepEqual(client.currencyPair, 'BTC_ETH');
    assert.deepEqual(client.api_uri, newApi);
    assert.deepEqual(client.timeout, newTimeout);
  });

  test('.getBalances()', done => {
    const balances = {
      BTC: '1.23456789',
      DASH: '0.00000000',
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', { command: 'returnBalances', nonce: nonce })
      .times(1)
      .reply(200, balances);

    authClient
      .getBalances()
      .then(data => {
        assert.deepEqual(data, balances);
        done();
      })
      .catch(error => assert.fail(error));
  });
});
