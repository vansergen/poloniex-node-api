# Poloniex Node.js API [![CircleCI](https://circleci.com/gh/vansergen/poloniex-node-api.svg?style=svg)](https://circleci.com/gh/vansergen/poloniex-node-api) [![npm version](https://badge.fury.io/js/poloniex-node-api.svg)](https://badge.fury.io/js/poloniex-node-api)

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

### SignRequest

```javascript
const Poloniex = require('poloniex-node-api');
const auth = { key: 'apikey', secret: 'apisecret' };
const data = { form: { command: 'returnBalances', nonce: 154264078495300 } };
const { key, sign } = Poloniex.SignRequest(data);
console.log(sign);
```

### Test

```bash
npm test
```
