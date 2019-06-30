# Poloniex Node.js API [![CircleCI](https://circleci.com/gh/vansergen/poloniex-node-api.svg?style=svg)](https://circleci.com/gh/vansergen/poloniex-node-api) [![GitHub version](https://badge.fury.io/gh/vansergen%2Fpoloniex-node-api.svg)](https://badge.fury.io/gh/vansergen%2Fpoloniex-node-api) [![npm version](https://badge.fury.io/js/poloniex-node-api.svg)](https://badge.fury.io/js/poloniex-node-api) [![languages](https://img.shields.io/github/languages/top/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api) [![dependency status](https://img.shields.io/librariesio/github/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api) [![repo size](https://img.shields.io/github/repo-size/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api) [![npm downloads](https://img.shields.io/npm/dt/poloniex-node-api.svg)](https://www.npmjs.com/package/poloniex-node-api) [![license](https://img.shields.io/github/license/vansergen/poloniex-node-api.svg)](https://github.com/vansergen/poloniex-node-api/blob/master/LICENSE)

Node.js library for [Poloniex](https://docs.poloniex.com/).

## Installation

```bash
npm install poloniex-node-api
```

## Usage

### PublicClient

```javascript
const Poloniex = require('poloniex-node-api');
const publicClient = new Poloniex.PublicClient();
```

- [`getTickers`](https://docs.poloniex.com/?shell#returnticker)

```javascript
publicClient
  .getTickers()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

- [`getVolume`](https://docs.poloniex.com/?shell#return24hvolume)

```javascript
publicClient
  .getVolume()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

- [`getOrderBook`](https://docs.poloniex.com/?shell#returnorderbook)

```javascript
publicClient
  .getOrderBook({ currencyPair: 'USDT_BTC', depth: 25 })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

- [`getTradeHistory`](https://docs.poloniex.com/?shell#returntradehistory-public)

```javascript
publicClient
  .getTradeHistory({
    currencyPair: 'USDT_BTC',
    start: 1410158341,
    end: 1410499372,
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

- [`getChartData`](https://docs.poloniex.com/?shell#returnchartdata)

```javascript
publicClient
  .getChartData({
    currencyPair: 'BTC_XMR',
    period: 14400,
    start: 1546300800,
    end: 1546646400,
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

- [`getCurrencies`](https://docs.poloniex.com/?shell#returncurrencies)

```javascript
try {
  const currencies = await publicClient.getCurrencies();
  console.log(currencies);
} catch (error) {
  console.error(error);
}
```

- [`getLoanOrders`](https://docs.poloniex.com/?shell#returnloanorders)

```javascript
try {
  const loans = await publicClient.getLoanOrders({ currency: 'USDT' });
  console.log(currencies);
} catch (error) {
  console.error(error);
}
```

- `cb`

```javascript
const callback = (error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
};
publicClient.cb('getLoanOrders', callback, { currency: 'BTC' });
```

- `request`

```javascript
publicClient
  .request({
    method: 'GET',
    qs: {
      command: 'return24hVolume',
    },
    url: 'https://poloniex.com/public',
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

### AuthenticatedClient

```javascript
const key = 'poloniexapikey';
const secret = 'poloniexapisecret';
const Poloniex = require('poloniex-node-api');
const AuthenticatedClient = new Poloniex.AuthenticatedClient({ key, secret });
```

- [`getBalances`](https://docs.poloniex.com/?shell#returnbalances)

```javascript
const balances = await AuthenticatedClient.getBalances();
```

- [`getCompleteBalances`](https://docs.poloniex.com/?shell#returncompletebalances)

```javascript
const account = 'all';
const balances = await AuthenticatedClient.getCompleteBalances({ account });
```

- [`getDepositAddresses`](https://docs.poloniex.com/?shell#returndepositaddresses)

```javascript
const addresses = await AuthenticatedClient.getDepositAddresses();
```

- [`getNewAddress`](https://docs.poloniex.com/?shell#generatenewaddress)

```javascript
const addresses = await AuthenticatedClient.getNewAddress({ currency: 'ZEC' });
```

- [`getDepositsWithdrawals`](https://docs.poloniex.com/?shell#returndepositswithdrawals)

```javascript
const deposits_withdrawals = await AuthenticatedClient.getDepositsWithdrawals({
  start: 1539954535,
  end: 1540314535,
});
```

- [`getOpenOrders`](https://docs.poloniex.com/?shell#returnopenorders)

```javascript
const currencyPair = 'BTC_DASH';
const orders = await AuthenticatedClient.getOpenOrders({ currencyPair });
```

- [`getHistoryTrades`](https://docs.poloniex.com/?shell#returntradehistory-private)

```javascript
const currencyPair = 'BTC_ETC';
const trades = await AuthenticatedClient.getHistoryTrades({ currencyPair });
```

- [`getOrderTrades`](https://docs.poloniex.com/?shell#returntradehistory-private)

```javascript
const orderNumber = 96238912842;
const trades = await AuthenticatedClient.getOrderTrades({ orderNumber });
```

- [`getOrderStatus`](https://docs.poloniex.com/?shell#returnorderstatus)

```javascript
const orderNumber = 96238912842;
const trades = await AuthenticatedClient.getOrderStatus({ orderNumber });
```

- `post`

```javascript
AuthenticatedClient.post({ command: 'returnCompleteBalances' });
```

### WebsocketClient

```javascript
const key = 'poloniexapikey';
const secret = 'poloniexapisecret';
const channels = [1000, 'BTC_DOGE'];
const Poloniex = require('poloniex-node-api');
const websocket = new Poloniex.WebsocketClient({ key, secret, channels });
websocket.on('open', () => {
  console.log('open');
});
websocket.on('close', () => {
  console.log('close');
});
websocket.on('error', error => {
  console.error(error);
});
websocket.on('message', message => {
  console.log(message);
});
```

- `connect`

```javascript
websocket.connect();
```

- `disconnect`

```javascript
websocket.disconnect();
```

- `subscribe`

```javascript
websocket.subscribe(1003);
```

- `unsubscribe`

```javascript
websocket.unsubscribe('BTC_ZEC');
```

### SignRequest

```javascript
const Poloniex = require('poloniex-node-api');
const auth = { key: 'apikey', secret: 'apisecret' };
const data = { form: { command: 'returnBalances', nonce: 154264078495300 } };
const { key, sign } = Poloniex.SignRequest(auth, data);
console.log(sign);
```

### Test

```bash
npm test
```
