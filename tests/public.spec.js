const assert = require('assert');
const nock = require('nock');

const Poloniex = require('../index.js');
const publicClient = new Poloniex.PublicClient();
const { EXCHANGE_API_URL, DEFAULT_TIMEOUT } = require('../lib/utilities');

suite('PublicClient', () => {
  teardown(() => nock.cleanAll());

  test('.constructor()', () => {
    assert.deepEqual(publicClient.api_uri, EXCHANGE_API_URL);
    assert.deepEqual(publicClient.timeout, DEFAULT_TIMEOUT);
  });

  test('.constructor() (with custom parameters)', () => {
    const newApi = 'https://new-poloniex-api-url.com';
    const newTimeout = 9000;
    const newClient = new Poloniex.PublicClient({
      api_uri: newApi,
      timeout: newTimeout,
    });
    assert.deepEqual(newClient.api_uri, newApi);
    assert.deepEqual(newClient.timeout, newTimeout);
  });

  test('.request() (handles errors)', done => {
    const data = { error: 'some error' };
    nock(EXCHANGE_API_URL)
      .get('/public')
      .times(1)
      .reply(400, data);

    publicClient
      .request({ method: 'GET', url: EXCHANGE_API_URL + '/public' })
      .then(() => assert.fail('Should have thrown an error'))
      .catch(error => {
        assert.deepEqual(error.message, '400 - {"error":"some error"}');
        assert.deepEqual(error.statusCode, 400);
        assert.deepEqual(error.error, data);
        done();
      });
  });
});
