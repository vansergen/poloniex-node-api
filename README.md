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

- [`buy`](https://docs.poloniex.com/?shell#buy)

```javascript
const currencyPair = 'BTC_ETH';
const rate = 0.01;
const amount = 1;
const order = await AuthenticatedClient.buy({ currencyPair, rate, amount });
```

- [`sell`](https://docs.poloniex.com/?shell#sell)

```javascript
const currencyPair = 'BTC_ETH';
const rate = 10;
const amount = 1;
const order = await AuthenticatedClient.sell({ currencyPair, rate, amount });
```

- [`cancelOrder`](https://docs.poloniex.com/?shell#cancelorder)

```javascript
const orderNumber = 514845991795;
const order = await AuthenticatedClient.cancelOrder({ orderNumber });
```

- [`cancelAllOrders`](https://docs.poloniex.com/?shell#cancelallorders)

```javascript
const currencyPair = 'BTC_ETH';
const orders = await AuthenticatedClient.cancelAllOrders({ currencyPair });
```

- [`moveOrder`](https://docs.poloniex.com/?shell#moveorder)

```javascript
const orderNumber = 514851026755;
const rate = 0.00015;
const result = await AuthenticatedClient.moveOrder({ rate, orderNumber });
```

- [`withdraw`](https://docs.poloniex.com/?shell#withdraw)

```javascript
const currency = 'EOS';
const amount = 1000;
const address = 'eos-address';
const paymentId = 1234567890;
const result = await AuthenticatedClient.withdraw({
  currency,
  amount,
  address,
  paymentId,
});
```

- [`getFeeInfo`](https://docs.poloniex.com/?shell#returnfeeinfo)

```javascript
const fees = await AuthenticatedClient.getFeeInfo();
```

- [`getAvailableAccountBalances`](https://docs.poloniex.com/?shell#returnavailableaccountbalances)

```javascript
const balances = AuthenticatedClient.getAvailableAccountBalances();
```

- [`getTradableBalances`](https://docs.poloniex.com/?shell#returntradablebalances)

```javascript
const balances = AuthenticatedClient.getTradableBalances();
```

- [`transferBalance`](https://docs.poloniex.com/?shell#transferbalance)

```javascript
const currency = 'BTC';
const amount = 0.5;
const fromAccount = 'lending';
const toAccount = 'exchange';
const transfer = AuthenticatedClient.transferBalance({
  currency,
  amount,
  fromAccount,
  toAccount,
});
```

- [`getMarginAccountSummary`](https://docs.poloniex.com/?shell#returnmarginaccountsummary)

```javascript
const summary = await AuthenticatedClient.getMarginAccountSummary();
```

- [`marginBuy`](https://docs.poloniex.com/?shell#marginbuy)

```javascript
const currencyPair = 'BTC_ETH';
const rate = 0.01;
const amount = 1;
const lendingRate = 0.01;
const order = await AuthenticatedClient.marginBuy({
  currencyPair,
  rate,
  amount,
  lendingRate,
});
```

- [`marginSell`](https://docs.poloniex.com/?shell#marginsell)

```javascript
const currencyPair = 'BTC_ETH';
const rate = 10;
const amount = 1;
const lendingRate = 0.015;
const order = await AuthenticatedClient.marginSell({
  currencyPair,
  rate,
  amount,
  lendingRate,
});
```

- [`getMarginPosition`](https://docs.poloniex.com/?shell#getmarginposition)

```javascript
const currencyPair = 'BTC_ETH';
const position = await AuthenticatedClient.getMarginPosition({ currencyPair });
```

- [`closeMarginPosition`](https://docs.poloniex.com/?shell#closemarginposition)

```javascript
const currencyPair = 'BTC_ETH';
const position = await AuthenticatedClient.closeMarginPosition({
  currencyPair,
});
```

- [`createLoanOffer`](https://docs.poloniex.com/?shell#createloanoffer)

```javascript
const currency = 'BTC';
const amount = 0.1;
const duration = 2;
const autoRenew = 0;
const lendingRate = 0.015;
const offer = await AuthenticatedClient.createLoanOffer({
  currency,
  amount,
  duration,
  autoRenew,
  lendingRate,
});
```

- [`cancelLoanOffer`](https://docs.poloniex.com/?shell#cancelloanoffer)

```javascript
const orderNumber = 1002013188;
const offer = await AuthenticatedClient.cancelLoanOffer({ orderNumber });
```

- [`getOpenLoanOffers`](https://docs.poloniex.com/?shell#returnopenloanoffers)

```javascript
const offers = await AuthenticatedClient.getOpenLoanOffers();
```

- [`getActiveLoans`](https://docs.poloniex.com/#returnactiveloans)

```javascript
const loans = await AuthenticatedClient.getActiveLoans();
```

- [`getLendingHistory`](https://docs.poloniex.com/#returnlendinghistory)

```javascript
const start = 1483228800;
const end = 1483315200;
const limits = 100;
const history = await AuthenticatedClient.getLendingHistory({
  start,
  end,
  limits,
});
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
