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

  test('.getTickers()', done => {
    const tickers = {
      USDT_BTC: {
        id: 121,
        last: '9162.76459012',
        lowestAsk: '9162.76459012',
        highestBid: '9151.76341041',
        percentChange: '0.04079405',
        baseVolume: '9649722.16546198',
        quoteVolume: '1064.67078796',
        isFrozen: '0',
        high24hr: '9325.00000000',
        low24hr: '8732.23922667',
      },
      BTC_ETH: {
        id: 148,
        last: '0.02963883',
        lowestAsk: '0.02963878',
        highestBid: '0.02963850',
        percentChange: '-0.02552059',
        baseVolume: '255.46245681',
        quoteVolume: '8544.98856973',
        isFrozen: '0',
        high24hr: '0.03079000',
        low24hr: '0.02938000',
      },
    };
    nock(EXCHANGE_API_URL)
      .get('/public?command=returnTicker')
      .times(1)
      .reply(200, tickers);

    publicClient
      .getTickers()
      .then(data => {
        assert.deepEqual(data, tickers);
        done();
      })
      .catch(error => assert.fail(error));
  });
});
