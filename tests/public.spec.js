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
        assert.deepEqual(error, data);
        done();
      });
  });

  test('.cb()', () => {
    const response = { response: 1 };
    const options = { method: 'GET', url: EXCHANGE_API_URL + '/public' };
    const _method = 'request';
    nock(EXCHANGE_API_URL)
      .get('/public')
      .times(2)
      .reply(200, response);

    const cbreq = new Promise((resolve, reject) => {
      const callback = (error, data) => {
        if (error) {
          reject(error);
        } else {
          assert.deepEqual(data, response);
          resolve(data);
        }
      };
      publicClient.cb({ _method, ...options }, callback);
    });

    const preq = publicClient
      .request(options)
      .then(data => assert.deepEqual(data, response))
      .catch(error => assert.fail(error));
    return Promise.all([cbreq, preq]);
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

  test('.getVolume()', done => {
    const volume = {
      USDT_BTC: { USDT: '7161846.98235853', BTC: '790.32984132' },
      USDT_ETH: { USDT: '895368.56029939', ETH: '3331.80491546' },
      totalETH: '370.77305935',
      totalBTC: '1845.83395826',
      totalUSDT: '11287088.18195494',
    };
    nock(EXCHANGE_API_URL)
      .get('/public?command=return24hVolume')
      .times(1)
      .reply(200, volume);

    publicClient
      .getVolume()
      .then(data => {
        assert.deepEqual(data, volume);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getOrderBook()', done => {
    const book = {
      USDT_BTC: {
        asks: [['9297.44488770', 0.143181], ['9298.08427869', 0.0001161]],
        bids: [['9297.24540399', 1.46374898], ['9297.24540398', 0.0443]],
        isFrozen: '0',
        seq: 376097564,
      },
      BTC_ETH: {
        asks: [['0.02930568', 0.56225405], ['0.02931998', 1]],
        bids: [['0.02930505', 0.00011779], ['0.02929320', 25]],
        isFrozen: '0',
        seq: 711985070,
      },
    };
    nock(EXCHANGE_API_URL)
      .get('/public?command=returnOrderBook&currencyPair=all&depth=100')
      .times(1)
      .reply(200, book);

    publicClient
      .getOrderBook()
      .then(data => {
        assert.deepEqual(data, book);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getOrderBook() (with parameters)', done => {
    const book = {
      asks: [
        ['135.58999999', 7.90480727],
        ['135.59000000', 3.04610694],
        ['135.59662720', 0.00883215],
      ],
      bids: [
        ['134.72221617', 1.3],
        ['134.72221012', 12.4],
        ['134.72220998', 90.22],
      ],
      isFrozen: '0',
      seq: 295173803,
    };
    const options = { currencyPair: 'USDT_LTC', depth: 3 };
    nock(EXCHANGE_API_URL)
      .get('/public?command=returnOrderBook&currencyPair=USDT_LTC&depth=3')
      .times(1)
      .reply(200, book);

    publicClient
      .getOrderBook(options)
      .then(data => {
        assert.deepEqual(data, book);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getTradeHistory()', done => {
    const trades = [
      {
        globalTradeID: 420170516,
        tradeID: 27129920,
        date: '2019-06-17 15:25:18',
        type: 'buy',
        rate: '9257.23051444',
        amount: '0.01394711',
        total: '129.11161228',
        orderNumber: 277619132092,
      },
      {
        globalTradeID: 420170477,
        tradeID: 27129919,
        date: '2019-06-17 15:24:19',
        type: 'sell',
        rate: '9257.18336240',
        amount: '0.07792262',
        total: '721.34398141',
        orderNumber: 277619040184,
      },
      {
        globalTradeID: 420170476,
        tradeID: 27129918,
        date: '2019-06-17 15:24:18',
        type: 'sell',
        rate: '9257.18336240',
        amount: '0.00259138',
        total: '23.98887982',
        orderNumber: 277619039185,
      },
    ];
    nock(EXCHANGE_API_URL)
      .get('/public?command=returnTradeHistory&currencyPair=USDT_BTC')
      .times(1)
      .reply(200, trades);

    publicClient
      .getTradeHistory()
      .then(data => {
        assert.deepEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getTradeHistory() (with parameters)', done => {
    const options = { start: 1560783670, end: 1560783719 };
    const trades = [
      {
        globalTradeID: 420168521,
        tradeID: 47110335,
        date: '2019-06-17 15:01:58',
        type: 'sell',
        rate: '0.02924282',
        amount: '0.32220457',
        total: '0.00942217',
        orderNumber: 605151881509,
      },
      {
        globalTradeID: 420168418,
        tradeID: 47110334,
        date: '2019-06-17 15:01:10',
        type: 'sell',
        rate: '0.02925860',
        amount: '1.00000000',
        total: '0.02925860',
        orderNumber: 605151487903,
      },
    ];
    nock(EXCHANGE_API_URL)
      .get(
        '/public?command=returnTradeHistory&currencyPair=BTC_ETH&start=1560783670&end=1560783719'
      )
      .times(1)
      .reply(200, trades);

    const client = new Poloniex.PublicClient({ currencyPair: 'BTC_ETH' });

    client
      .getTradeHistory(options)
      .then(data => {
        assert.deepEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getChartData()', done => {
    const candles = [
      {
        date: 1560613059,
        high: 8809.26970927,
        low: 8809.26970927,
        open: 8809.26970927,
        close: 8809.26970927,
        volume: 0,
        quoteVolume: 0,
        weightedAverage: 8809.26970927,
      },
      {
        date: 1560643200,
        high: 9325,
        low: 8759.37683497,
        open: 8809.49125799,
        close: 8968.92286817,
        volume: 11929575.934481,
        quoteVolume: 1317.2708549,
        weightedAverage: 9056.28169795,
      },
      {
        date: 1560729600,
        high: 9390.83903896,
        low: 8949.00000001,
        open: 8963.50269782,
        close: 9157.79085762,
        volume: 3895287.1624447,
        quoteVolume: 423.63287478,
        weightedAverage: 9194.95958491,
      },
    ];
    const options = {
      period: 86400,
      start: 1560613059,
      end: 1560785858,
    };
    nock(EXCHANGE_API_URL)
      .get(
        '/public?command=returnChartData&currencyPair=USDT_BTC&period=86400&start=1560613059&end=1560785858'
      )
      .times(1)
      .reply(200, candles);

    publicClient
      .getChartData(options)
      .then(data => {
        assert.deepEqual(data, candles);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getCurrencies()', done => {
    const currencies = {
      BTC: {
        id: 28,
        name: 'Bitcoin',
        humanType: 'BTC Clone',
        currencyType: 'address',
        txFee: '0.00050000',
        minConf: 1,
        depositAddress: null,
        disabled: 0,
        delisted: 0,
        frozen: 0,
        isGeofenced: 0,
      },
      USDT: {
        id: 214,
        name: 'Tether USD',
        humanType: 'Sweep to Main Account',
        currencyType: 'address',
        txFee: '10.00000000',
        minConf: 2,
        depositAddress: null,
        disabled: 0,
        delisted: 0,
        frozen: 0,
        isGeofenced: 0,
      },
    };
    nock(EXCHANGE_API_URL)
      .get('/public?command=returnCurrencies')
      .times(1)
      .reply(200, currencies);

    publicClient
      .getCurrencies()
      .then(data => {
        assert.deepEqual(data, currencies);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getLoanOrders()', done => {
    const options = { currency: 'BTC' };
    const loans = {
      offers: [
        { rate: '0.00005900', amount: '0.01961918', rangeMin: 2, rangeMax: 2 },
        { rate: '0.00006000', amount: '62.24928418', rangeMin: 2, rangeMax: 2 },
      ],
      demands: [
        { rate: '0.02000000', amount: '0.00100014', rangeMin: 2, rangeMax: 2 },
        { rate: '0.00001000', amount: '0.04190154', rangeMin: 2, rangeMax: 2 },
      ],
    };
    nock(EXCHANGE_API_URL)
      .get('/public?command=returnLoanOrders&currency=BTC')
      .times(1)
      .reply(200, loans);

    publicClient
      .getLoanOrders(options)
      .then(data => {
        assert.deepEqual(data, loans);
        done();
      })
      .catch(error => assert.fail(error));
  });
});
