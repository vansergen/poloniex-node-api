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

  test('.getDepositsWithdrawals()', done => {
    const options = { start: 1529425667, end: 1560961667 };
    const deposits_withdrawals = {
      adjustments: [],
      deposits: [],
      withdrawals: [
        {
          withdrawalNumber: 64529364,
          currency: 'DASH',
          address: 'DASH-address',
          amount: '43.00000001',
          fee: '0.00100000',
          timestamp: 1542658352,
          status: 'COMPLETE: tx-id',
          ipAddress: '192.168.0.1',
          canCancel: 0,
          canResendEmail: 0,
          paymentID: null,
        },
      ],
    };
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'returnDepositsWithdrawals',
        nonce: nonce,
        start: options.start,
        end: options.end,
      })
      .times(1)
      .reply(200, deposits_withdrawals);

    authClient
      .getDepositsWithdrawals(options)
      .then(data => {
        assert.deepEqual(data, deposits_withdrawals);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getOpenOrders()', done => {
    const orders = [];
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'returnOpenOrders',
        currencyPair: 'all',
        nonce: nonce,
      })
      .times(1)
      .reply(200, orders);

    authClient
      .getOpenOrders()
      .then(data => {
        assert.deepEqual(data, orders);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getHistoryTrades()', done => {
    const trades = [
      {
        globalTradeID: 394700861,
        tradeID: 45210354,
        date: '2018-10-23 18:01:58',
        type: 'buy',
        rate: '0.03117266',
        amount: '0.00000652',
        total: '0.00000020',
        orderNumber: '104768235093',
      },
    ];
    const nonce = 1560742707669;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'returnTradeHistory',
        currencyPair: 'all',
        nonce: nonce,
      })
      .times(1)
      .reply(200, trades);

    authClient
      .getHistoryTrades()
      .then(data => {
        assert.deepEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getOrderTrades()', done => {
    const trades = [
      {
        globalTradeID: 394127362,
        tradeID: 13536351,
        currencyPair: 'BTC_STR',
        type: 'buy',
        rate: '0.00003432',
        amount: '3696.05342780',
        total: '0.12684855',
        fee: '0.00200000',
        date: '2018-10-16 17:03:43',
      },
      {
        globalTradeID: 394127361,
        tradeID: 13536350,
        currencyPair: 'BTC_STR',
        type: 'buy',
        rate: '0.00003432',
        amount: '3600.53748129',
        total: '0.12357044',
        fee: '0.00200000',
        date: '2018-10-16 17:03:43',
      },
    ];
    const orderNumber = 9623891284;
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', { command: 'returnOrderTrades', orderNumber, nonce })
      .times(1)
      .reply(200, trades);

    authClient
      .getOrderTrades({ orderNumber })
      .then(data => {
        assert.deepEqual(data, trades);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.getOrderStatus()', done => {
    const response = {
      result: {
        '6071071': {
          status: 'Open',
          rate: '0.40000000',
          amount: '1.00000000',
          currencyPair: 'BTC_ETH',
          date: '2018-10-17 17:04:50',
          total: '0.40000000',
          type: 'buy',
          startingAmount: '1.00000',
        },
      },
      success: 1,
    };
    const orderNumber = 96238912841;
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', { command: 'returnOrderStatus', orderNumber, nonce })
      .times(1)
      .reply(200, response);

    authClient
      .getOrderStatus({ orderNumber })
      .then(data => {
        assert.deepEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.buy()', done => {
    const currencyPair = 'BTC_ETH';
    const rate = 0.01;
    const amount = 1;
    const response = {
      orderNumber: '514845991795',
      resultingTrades: [
        {
          amount: '3.0',
          date: '2018-10-25 23:03:21',
          rate: '0.0002',
          total: '0.0006',
          tradeID: '251834',
          type: 'buy',
        },
      ],
      fee: '0.01000000',
      currencyPair: 'BTC_ETH',
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'buy',
        currencyPair,
        rate,
        amount,
        nonce,
      })
      .times(1)
      .reply(200, response);

    authClient
      .buy({ currencyPair, rate, amount })
      .then(data => {
        assert.deepEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.buy(with default currencyPair)', done => {
    const currencyPair = 'BTC_ETH';
    const client = new Poloniex.AuthenticatedClient({
      key,
      secret,
      currencyPair,
    });

    const rate = 0.01;
    const amount = 1;
    const response = {
      orderNumber: '514845991795',
      resultingTrades: [
        {
          amount: '3.0',
          date: '2018-10-25 23:03:21',
          rate: '0.0002',
          total: '0.0006',
          tradeID: '251834',
          type: 'buy',
        },
      ],
      fee: '0.01000000',
      currencyPair: 'BTC_ETH',
    };
    const nonce = 154264078495300;
    client.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'buy',
        currencyPair,
        rate,
        amount,
        nonce,
      })
      .times(1)
      .reply(200, response);

    client
      .buy({ rate, amount })
      .then(data => {
        assert.deepEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });

  test('.sell()', done => {
    const currencyPair = 'BTC_ETH';
    const rate = 10;
    const amount = 1;
    const response = {
      orderNumber: '514845991926',
      resultingTrades: [
        {
          amount: '1.0',
          date: '2018-10-25 23:03:21',
          rate: '10.0',
          total: '10.0',
          tradeID: '251869',
          type: 'sell',
        },
      ],
      fee: '0.01000000',
      currencyPair: 'BTC_ETH',
    };
    const nonce = 154264078495300;
    authClient.nonce = () => nonce;

    nock(EXCHANGE_API_URL)
      .post('/tradingApi', {
        command: 'sell',
        currencyPair,
        rate,
        amount,
        nonce,
      })
      .times(1)
      .reply(200, response);

    authClient
      .sell({ currencyPair, rate, amount })
      .then(data => {
        assert.deepEqual(data, response);
        done();
      })
      .catch(error => assert.fail(error));
  });
});
