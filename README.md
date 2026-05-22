# Poloniex Node.js API [![CI Status](https://github.com/vansergen/poloniex-node-api/workflows/CI/badge.svg?branch=main)](https://github.com/vansergen/poloniex-node-api/actions/workflows/ci.yml?query=branch%3Amain) [![npm version](https://badge.fury.io/js/poloniex-node-api.svg)](https://badge.fury.io/js/poloniex-node-api) [![Coverage Status](https://coveralls.io/repos/github/vansergen/poloniex-node-api/badge.svg?branch=main)](https://coveralls.io/github/vansergen/poloniex-node-api?branch=main) [![Known Vulnerabilities](https://snyk.io/test/github/vansergen/poloniex-node-api/badge.svg)](https://snyk.io/test/github/vansergen/poloniex-node-api) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) ![NPM license](https://img.shields.io/npm/l/poloniex-node-api) ![node version](https://img.shields.io/node/v/poloniex-node-api) ![npm downloads](https://img.shields.io/npm/dt/poloniex-node-api) ![GitHub top language](https://img.shields.io/github/languages/top/vansergen/poloniex-node-api)

Node.js library for [Poloniex](https://api-docs.poloniex.com/spot).

## Installation

```bash
npm install poloniex-node-api
```

## Usage

### [PublicClient](https://api-docs.poloniex.com/spot/api/public/reference-data)

```typescript
import { PublicClient } from "poloniex-node-api";
const client = new PublicClient();
```

- [`getMarkets`](https://api-docs.poloniex.com/spot/api/public/reference-data#symbol-information)

```typescript
const markets = await client.getMarkets();
```

- [`getMarket`](https://api-docs.poloniex.com/spot/api/public/reference-data#symbol-information)

```typescript
const symbol = "ETH_BTC";
const volume = await client.getMarket({ symbol });
```

- [`getCurrency`](https://api-docs.poloniex.com/spot/api/public/reference-data#currency-information)

```typescript
const currency = "BNB";
const currency_info = await client.getCurrency({ currency });
```

or

```typescript
const includeMultiChainCurrencies = true;
const all = await client.getCurrency({ includeMultiChainCurrencies });
```

- [`getCurrencyV2`](https://api-docs.poloniex.com/spot/api/public/reference-data#currencyv2-information)

```typescript
const coin = "BNB";
const currency_v2 = await client.getCurrencyV2({ coin });
```

or

```typescript
const all = await client.getCurrencyV2();
```

- [`getSystemTime`](https://api-docs.poloniex.com/spot/api/public/reference-data#system-timestamp)

```typescript
const time = await client.getSystemTime();
```

- [`getPrices`](https://api-docs.poloniex.com/spot/api/public/market-data#prices)

```typescript
const prices = await client.getPrices();
```

- [`getPrice`](https://api-docs.poloniex.com/spot/api/public/market-data#prices)

```typescript
const symbol = "ETH_BTC";
const price = await client.getPrice({ symbol });
```

- [`getMarkPrices`](https://api-docs.poloniex.com/spot/api/public/market-data#mark-price)

```typescript
const prices = await client.getMarkPrices();
```

- [`getMarkPrice`](https://api-docs.poloniex.com/spot/api/public/market-data#mark-price)

```typescript
const symbol = "ZEC_USDT";
const price = await client.getMarkPrice({ symbol });
```

- [`getMarkPriceComponents`](https://api-docs.poloniex.com/spot/api/public/market-data#mark-price-components)

```typescript
const symbol = "ZEC_USDT";
const prices = await client.getMarkPriceComponents({ symbol });
```

- [`getOrderBook`](https://api-docs.poloniex.com/spot/api/public/market-data#order-book)

```typescript
const symbol = "ETH_BTC";
const limit = 5;
const scale = "0.01";
const book = await client.getOrderBook({ symbol, limit, scale });
```

- [`getCandles`](https://api-docs.poloniex.com/spot/api/public/market-data#candles)

```typescript
const symbol = "ETH_BTC";
const interval = "HOUR_1";
const limit = 2;
const endTime = Date.now();
const startTime = endTime - 1000 * 60 * 60 * 24;
const candles = await client.getCandles({
  symbol,
  interval,
  limit,
  startTime,
  endTime,
});
```

- [`getPublicTrades`](https://api-docs.poloniex.com/spot/api/public/market-data#trades)

```typescript
const symbol = "ETH_BTC";
const limit = 2;
const trades = await client.getPublicTrades({ symbol, limit });
```

- [`getTickers`](https://api-docs.poloniex.com/spot/api/public/market-data#ticker)

```typescript
const tickers = await client.getTickers();
```

- [`getTicker`](https://api-docs.poloniex.com/spot/api/public/market-data#ticker)

```typescript
const symbol = "ETH_BTC";
const ticker = await client.getTicker({ symbol });
```

- [`getCollateral`](https://api-docs.poloniex.com/spot/api/public/margin#collateral-info)

```typescript
const currency = "ETH";
const collateral = await client.getCollateral({ currency });
```

or

```typescript
const all = await client.getCollateral();
```

- [`getBorrowRates`](https://api-docs.poloniex.com/spot/api/public/margin#borrow-rates-info)

```typescript
const rates = await client.getBorrowRates();
```

### [AuthenticatedClient](https://api-docs.poloniex.com/spot/api/private/account)

```typescript
import { AuthenticatedClient } from "poloniex-node-api";
const key = "poloniex-api-key";
const secret = "poloniex-api-secret";
const client = new AuthenticatedClient({ key, secret });
```

#### [Accounts](https://api-docs.poloniex.com/spot/api/private/account)

- [`getAccounts`](https://api-docs.poloniex.com/spot/api/private/account#account-information)

```typescript
const accounts = await client.getAccounts();
```

- [`getAccountBalances`](https://api-docs.poloniex.com/spot/api/private/account#all-account-balances)

```typescript
const balances = await client.getAccountBalances();
```

- [`getAccountActivity`](https://api-docs.poloniex.com/spot/api/private/account#account-activity)

```typescript
const activity = await client.getAccountActivity();
```

- [`transfer`](https://api-docs.poloniex.com/spot/api/private/account#accounts-transfer)

```typescript
const currency = "USDT";
const amount = "10.5";
const fromAccount = "SPOT";
const toAccount = "FUTURES";
const { transferId } = await client.transfer({
  currency,
  amount,
  fromAccount,
  toAccount,
});
```

- [`getAccountTransfers`](https://api-docs.poloniex.com/spot/api/private/account#accounts-transfer-records)

```typescript
const transfers = await client.getAccountTransfers();
```

- [`getAccountTransfer`](https://api-docs.poloniex.com/spot/api/private/account#accounts-transfer-records)

```typescript
const id = "23421267";
const transfer = await client.getAccountTransfer({ id });
```

- [`getFeeInfo`](https://api-docs.poloniex.com/spot/api/private/account#fee-info)

```typescript
const fee_info = await client.getFeeInfo();
```

- [`getInterestHistory`](https://api-docs.poloniex.com/spot/api/private/account#interest-history)

```typescript
const startTime = Date.now() - 1000 * 60 * 60 * 24 * 7;
const endTime = Date.now();
const history = await client.getInterestHistory({ startTime, endTime });
```

#### [Wallets](https://api-docs.poloniex.com/spot/api/private/wallet)

- [`getWallets`](https://api-docs.poloniex.com/spot/api/private/wallet#deposit-addresses)

```typescript
const wallets = await client.getWallets();
```

- [`getWalletsActivity`](https://api-docs.poloniex.com/spot/api/private/wallet#wallets-activity-records)

```typescript
const start = Date.now() - 1000 * 60 * 60 * 24;
const end = Date.now();
const { deposits, withdrawals } = await client.getWalletsActivity({
  start,
  end,
});
```

- [`newAddress`](https://api-docs.poloniex.com/spot/api/private/wallet#new-currency-address)

```typescript
const currency = "TRX";
const { address } = await client.newAddress({ currency });
```

- [`withdraw`](https://api-docs.poloniex.com/spot/api/private/wallet#withdraw-currency)

```typescript
const currency = "ETH";
const amount = "1.50";
const address = "0xbb8d0d7c346daecc2380dabaa91f3ccf8ae232fb4";
const { withdrawalRequestsId } = await client.withdraw({
  currency,
  amount,
  address,
});
```

- [`withdrawV2`](https://api-docs.poloniex.com/spot/api/private/wallet#withdraw-currency-v2)

```typescript
const coin = "USDT";
const network = "TRX";
const amount = "100";
const address = "TXkDNMJe3b6JDRxfCgXHmKs8xGTSFB3Vkk";
const { withdrawalRequestsId } = await client.withdrawV2({
  coin,
  network,
  amount,
  address,
});
```

#### [Margin](https://api-docs.poloniex.com/spot/api/private/margin)

- [`getMargin`](https://api-docs.poloniex.com/spot/api/private/margin#account-margin)

```typescript
const info = await client.getMargin();
```

- [`getBorrowStatus`](https://api-docs.poloniex.com/spot/api/private/margin#borrow-status)

```typescript
const status = await client.getBorrowStatus();
```

- [`getMaxSize`](https://api-docs.poloniex.com/spot/api/private/margin#maximum-buy-sell-amount)

```typescript
const size = await client.getMaxSize();
```

#### [Orders](https://api-docs.poloniex.com/spot/api/private/order)

- [`createOrder`](https://api-docs.poloniex.com/spot/api/private/order#create-order)

```typescript
const symbol = "BTC_USDT";
const type = "LIMIT";
const quantity = "100";
const side = "BUY";
const price = "40000.50000";
const timeInForce = "IOC";
const clientOrderId = "1234Abc";
const { id, clientOrderId } = await client.createOrder({
  symbol,
  type,
  quantity,
  side,
  price,
  timeInForce,
  clientOrderId,
});
```

or

```typescript
const symbol = "BTC_USDT";
const quantity = "100";
const side = "BUY";
const { id } = await client.createOrder({ symbol, quantity, side });
```

- [`createOrders`](https://api-docs.poloniex.com/spot/api/private/order#create-multiple-orders)

```typescript
const orders = [
  { symbol: "BTC_USDT", amount: "100", side: "BUY" },
  {
    symbol: "BTC_USDT",
    type: "LIMIT",
    quantity: "100",
    side: "BUY",
    price: "40000.50000",
    timeInForce: "IOC",
    clientOrderId: "1234Abc",
  },
  { symbol: "ETH_USDT", amount: "1000", side: "BUY" },
  {
    symbol: "TRX_USDT",
    type: "LIMIT",
    quantity: "15000",
    side: "SELL",
    price: "0.0623423423",
    timeInForce: "IOC",
    clientOrderId: "456Xyz",
  },
];
const response = await client.createOrders(orders);
```

- [`replaceOrder`](https://api-docs.poloniex.com/spot/api/private/order#cancel-replace-order)

```typescript
const id = "234235233423";
const price = "18000";
const clientOrderId = "1234";
const response = await client.replaceOrder({ id }, { price, clientOrderId });
```

or

```typescript
const clientOrderId = "1234Abc";
const price = "18000";
const quantity = "20";
const response = await client.replaceOrder(
  { clientOrderId },
  { price, quantity },
);
```

- [`getOpenOrders`](https://api-docs.poloniex.com/spot/api/private/order#open-orders)

```typescript
const symbol = "ELON_USDC";
const side = "SELL";
const direction = "PRE";
const limit = 10;
const orders = await client.getOpenOrders({ symbol, side, direction, limit });
```

or

```typescript
const orders = await client.getOpenOrders();
```

- [`getOrder`](https://api-docs.poloniex.com/spot/api/private/order#order-details)

```typescript
const id = "21934611974062080";
const order = await client.getOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "123";
const order = await client.getOrder({ clientOrderId });
```

- [`cancelOrder`](https://api-docs.poloniex.com/spot/api/private/order#cancel-order-by-id)

```typescript
const id = "21934611974062080";
const order = await client.cancelOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "123";
const order = await client.cancelOrder({ clientOrderId });
```

- [`cancelOrders`](https://api-docs.poloniex.com/spot/api/private/order#cancel-multiple-orders-by-ids)

```typescript
const orders = [{ id: "12345" }, { clientOrderId: "myId-1" }];
const results = await client.cancelOrders(orders);
```

- [`cancelAllOrders`](https://api-docs.poloniex.com/spot/api/private/order#cancel-all-orders)

```typescript
const symbols = ["BTC_USDT", "ETH_USDT"];
const accountTypes = ["SPOT"];
const results = await client.cancelAllOrders({ symbols, accountTypes });
```

or (to cancel all orders)

```typescript
const results = await client.cancelAllOrders();
```

- [`killSwitch`](https://api-docs.poloniex.com/spot/api/private/order#kill-switch)

```typescript
const timeout = 60;
const status = await client.killSwitch({ timeout });
```

- [`getKillSwitch`](https://api-docs.poloniex.com/spot/api/private/order#kill-switch-status)

```typescript
const status = await client.getKillSwitch();
```

#### [Smart Orders](https://api-docs.poloniex.com/spot/api/private/smart-order)

- [`createSmartOrder`](https://api-docs.poloniex.com/spot/api/private/smart-order#create-order)

```typescript
const symbol = "BTC_USDT";
const side = "BUY";
const type = "STOP_LIMIT";
const quantity = "100";
const price = "60100.00";
const timeInForce = "FOK";
const stopPrice = "60000.00";
const clientOrderId = "999999910";
const { id, clientOrderId } = await client.createSmartOrder({
  symbol,
  side,
  type,
  quantity,
  price,
  timeInForce,
  stopPrice,
  clientOrderId,
});
```

- [`replaceSmartOrder`](https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-replace-order)

```typescript
const id = "234235233423";
const stopPrice = "18000";
const clientOrderId = "1234Abc";
const response = await client.replaceSmartOrder(
  { id },
  { stopPrice, clientOrderId },
);
```

or by `clientOrderId`

```typescript
const clientOrderId = "1234Abc";
const stopPrice = "18000";
const quantity = "20";
const response = await client.replaceSmartOrder(
  { clientOrderId },
  { stopPrice, quantity },
);
```

- [`getOpenSmartOrders`](https://api-docs.poloniex.com/spot/api/private/smart-order#open-orders)

```typescript
const limit = 10;
const orders = await client.getOpenSmartOrders({ limit });
```

or

```typescript
const orders = await client.getOpenSmartOrders();
```

- [`getSmartOrder`](https://api-docs.poloniex.com/spot/api/private/smart-order#order-details)

```typescript
const id = "14368195657859072";
const order = await client.getSmartOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "18113";
const order = await client.getSmartOrder({ clientOrderId });
```

- [`cancelSmartOrder`](https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-order-by-id)

```typescript
const id = "9876543";
const order = await client.cancelSmartOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "88888";
const order = await client.cancelSmartOrder({ clientOrderId });
```

- [`cancelSmartOrders`](https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-multiple-orders-by-id)

```typescript
const orders = [{ id: "12345" }, { clientOrderId: "myId-1" }];
const results = await client.cancelSmartOrders(orders);
```

- [`cancelAllSmartOrders`](https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-all-orders)

```typescript
const symbols = ["BTC_USDT", "ETH_USDT"];
const accountTypes = ["SPOT"];
const results = await client.cancelAllSmartOrders({ symbols, accountTypes });
```

or (to cancel all orders)

```typescript
const results = await client.cancelAllSmartOrders();
```

#### [Order history](https://api-docs.poloniex.com/spot/api/private/order-history)

- [`getOrders`](https://api-docs.poloniex.com/spot/api/private/order-history#orders-history)

```typescript
const type = ["MARKET", "LIMIT"];
const side = "BUY";
const symbol = "TRX_USDC";
const states = ["FILLED", "PARTIALLY_CANCELED"];
const limit = 10;
const hideCancel = true;
const startTime = 1649106321040;
const endTime = 1649427963598;
const orders = await client.getOrders({
  type,
  side,
  symbol,
  states,
  limit,
  hideCancel,
  startTime,
  endTime,
});
```

- [`getSmartOrderHistory`](https://api-docs.poloniex.com/spot/api/private/order-history#smart-orders-history)

```typescript
const type = ["STOP", "STOP_LIMIT"];
const side = "BUY";
const symbol = "BTC_USDT";
const states = ["FILLED", "CANCELED"];
const limit = 10;
const startTime = 1649106321040;
const endTime = 1649427963598;
const orders = await client.getSmartOrderHistory({
  type,
  side,
  symbol,
  states,
  limit,
  startTime,
  endTime,
});
```

#### [Trades](https://api-docs.poloniex.com/spot/api/private/trade)

- [`getTrades`](https://api-docs.poloniex.com/spot/api/private/trade#trade-history)

```typescript
const limit = 10;
const endTime = 1648635115535;
const startTime = endTime - 1000 * 60 * 60;
const direction = "PRE";
const symbols = ["BTC_USDT", "ETH_USDT"];
const trades = await client.getTrades({
  limit,
  startTime,
  endTime,
  direction,
  symbols,
});
```

- [`getOrderTrades`](https://api-docs.poloniex.com/spot/api/private/trade#trades-by-order-id)

```typescript
const id = "30249408733945856";
const trades = await client.getOrderTrades({ id });
```

### [WebSocketClient](https://api-docs.poloniex.com/spot/websocket)

```typescript
const key = "<POLONIEX API KEY>";
const secret = "<POLONIEX API SECRET>";
const client = new WebSocketClient({ key, secret })
  .on("message", (msg) => {
    console.log("Message:\t", msg);
  })
  .on("error", (error) => {
    console.log("Error:\t", error);
  });
```

- [connectPublicWS](https://api-docs.poloniex.com/spot/websocket)

```typescript
await client.connectPublicWS();
```

- [connectPrivateWS](https://api-docs.poloniex.com/spot/websocket/authentication)

```typescript
await client.connectPrivateWS();
```

- [disconnectPublicWS](https://api-docs.poloniex.com/spot/websocket)

```typescript
await client.disconnectPublicWS();
```

- [disconnectPrivateWS](https://api-docs.poloniex.com/spot/websocket/authentication)

```typescript
await client.disconnectPrivateWS();
```

- [auth](https://api-docs.poloniex.com/spot/websocket/authentication)

```typescript
await client.auth();
```

- [pingPublic](https://api-docs.poloniex.com/spot/websocket#heartbeats)

```typescript
const ac = new AbortController();
setTimeout(() => {
  ac.abort();
}, 10000).unref();
await client.pingPublic({ signal: ac.signal });
```

- [pingPrivate](https://api-docs.poloniex.com/spot/websocket#heartbeats)

```typescript
await client.pingPrivate();
```

- [unsubscribePublic](https://api-docs.poloniex.com/spot/websocket#unsubscribe)

```typescript
await client.unsubscribePublic();
```

- [unsubscribePrivate](https://api-docs.poloniex.com/spot/websocket#unsubscribe)

```typescript
await client.unsubscribePrivate();
```

- [getPublicSubscriptions](https://api-docs.poloniex.com/spot/websocket#list-subscriptions)

```typescript
const { subscriptions } = await client.getPublicSubscriptions();
```

- [getPrivateSubscriptions](https://api-docs.poloniex.com/spot/websocket#list-subscriptions)

```typescript
const { subscriptions } = await client.getPrivateSubscriptions();
```

- [`send`](https://api-docs.poloniex.com/spot/websocket#subscriptions)

```typescript
const payload = {
  event: "subscribe",
  channel: ["candles_minute_1", "ticker"],
  symbols: ["BTC_USDT", "ETH_USDT"],
};
await client.send(payload, "public");
```

or

```typescript
const payload = {
  event: "subscribe",
  channel: ["orders", "balances"],
  symbols: ["all"],
};
await client.send(payload, "private");
```

#### [Candlesticks](https://api-docs.poloniex.com/spot/websocket/market-data#candlesticks)

- `subscribeCandles`

```typescript
const channel = "candles_day_1";
await client.subscribeCandles({ channel });
```

- `unsubscribeCandles`

```typescript
const channel = "candles_day_1";
await client.unsubscribeCandles({ channel });
```

- `candles`

```typescript
const channel = "candles_day_1";
for await (const candle of client.candles({ channel })) {
  console.log(candle);
}
```

#### [Trades](https://api-docs.poloniex.com/spot/websocket/market-data#trades)

- `subscribeTrades`

```typescript
const symbols = ["BTC_USDT", "ETH_USDT"];
await client.subscribeTrades({ symbols });
```

- `unsubscribeTrades`

```typescript
const symbols = ["BTC_USDT"];
await client.unsubscribeTrades({ symbols });
```

- `trades`

```typescript
for await (const trade of client.trades()) {
  console.log(trade);
}
```

#### [Ticker](https://api-docs.poloniex.com/spot/websocket/market-data#ticker)

- `subscribeTicker`

```typescript
const symbols = "all";
await client.subscribeTicker({ symbols });
```

- `unsubscribeTicker`

```typescript
const symbols = "all";
await client.unsubscribeTicker({ symbols });
```

- `tickers`

```typescript
for await (const ticker of client.tickers()) {
  console.log(ticker);
}
```

#### [Book](https://api-docs.poloniex.com/spot/websocket/market-data#book)

- `subscribeBook`

```typescript
await client.subscribeBook();
```

- `unsubscribeBook`

```typescript
const symbols = "all";
await client.unsubscribeBook({ symbols });
```

- `books`

```typescript
const depth = 10;
for await (const book of client.books({ depth })) {
  console.log(book);
}
```

#### [Book Level 2](https://api-docs.poloniex.com/spot/websocket/market-data#book-level-2)

- `subscribeLv2Book`

```typescript
const symbols = ["BTC_USDT"];
await client.subscribeLv2Book({ symbols });
```

- `unsubscribeLv2Book`

```typescript
const symbols = "all";
await client.unsubscribeLv2Book({ symbols });
```

- `booksLv2`

```typescript
for await (const book of client.booksLv2()) {
  console.log(book);
}
```

#### [Orders](https://api-docs.poloniex.com/spot/websocket/order)

- `subscribeOrders`

```typescript
const symbols = "all";
await client.subscribeOrders({ symbols });
```

- `unsubscribeOrders`

```typescript
const symbols = "all";
await client.unsubscribeOrders({ symbols });
```

- `orders`

```typescript
for await (const order of client.orders()) {
  console.log(order);
}
```

#### [Balances](https://api-docs.poloniex.com/spot/websocket/balance)

- `subscribeBalances`

```typescript
await client.subscribeBalances();
```

- `unsubscribeBalances`

```typescript
await client.unsubscribeBalances();
```

- `balances`

```typescript
for await (const balance of client.balances()) {
  console.log(balance);
}
```

### Test

```bash
npm test
```

### Coverage

```bash
npm run coverage
```
