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

  test('.getCompleteBalances()', done => {
    const balances = {
      BTC: {
        available: '0.00000000',
        onOrders: '0.00000000',
        btcValue: '0.00000000',
      },
      USDT: {
        available: '0.00000000',
        onOrders: '0.00000000',
        btcValue: '0.00000000',
      },
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', { command: 'returnCompleteBalances', nonce: nonce })
      .times(1)
      .reply(200, balances);

    authClient
      .getCompleteBalances()
      .then(data => {
        assert.deepEqual(data, balances);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getCompleteBalances() (with parameters)', done => {
    const options = { account: 'all' };
    const balances = {
      BTC: {
        available: '0.00000000',
        onOrders: '0.00000000',
        btcValue: '0.00000000',
      },
      USDT: {
        available: '0.00000000',
        onOrders: '0.00000000',
        btcValue: '0.00000000',
      },
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'returnCompleteBalances',
        account: 'all',
        nonce: nonce,
      })
      .times(1)
      .reply(200, balances);

    authClient
      .getCompleteBalances(options)
      .then(data => {
        assert.deepEqual(data, balances);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getDepositAddresses()', done => {
    const addresses = {
      BCH: '1FhCkdKeMGa621mCpAtFYzeVfUBnHbooLj',
      BTC: '131rdg5Rzn6BFufnnQaHhVa5ZtRU1J2EZR',
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', { command: 'returnDepositAddresses', nonce: nonce })
      .times(1)
      .reply(200, addresses);

    authClient
      .getDepositAddresses()
      .then(data => {
        assert.deepEqual(data, addresses);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getNewAddress()', done => {
    const options = { currency: 'ETH' };
    const address = {
      success: 1,
      response: '0xa6f0dacc33c7f63e137e0106ed71cc20b4b931af',
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'generateNewAddress',
        nonce: nonce,
        currency: 'ETH',
      })
      .times(1)
      .reply(200, address);

    authClient
      .getNewAddress(options)
      .then(data => {
        assert.deepEqual(data, address);
        done();
      })
      .catch(error => assert.fail(error));
  });
});
