# Poloniex Node.js API [![CI Status](https://github.com/vansergen/poloniex-node-api/workflows/CI/badge.svg?branch=main)](https://github.com/vansergen/poloniex-node-api/actions/workflows/ci.yml?query=branch%3Amain) [![npm version](https://badge.fury.io/js/poloniex-node-api.svg)](https://badge.fury.io/js/poloniex-node-api) [![Coverage Status](https://coveralls.io/repos/github/vansergen/poloniex-node-api/badge.svg?branch=main)](https://coveralls.io/github/vansergen/poloniex-node-api?branch=main) [![Known Vulnerabilities](https://snyk.io/test/github/vansergen/poloniex-node-api/badge.svg)](https://snyk.io/test/github/vansergen/poloniex-node-api) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) ![NPM license](https://img.shields.io/npm/l/poloniex-node-api) ![node version](https://img.shields.io/node/v/poloniex-node-api) ![npm downloads](https://img.shields.io/npm/dt/poloniex-node-api) ![GitHub top language](https://img.shields.io/github/languages/top/vansergen/poloniex-node-api)

Node.js library for [Poloniex](https://docs.poloniex.com/).

## Installation

```bash
npm install poloniex-node-api
```

## Usage

### [Legacy API](https://docs.legacy.poloniex.com/)

See [here](./README.legacy.md)

### [PublicClient](https://docs.poloniex.com/#public-endpoints)

```typescript
import { PublicClient } from "poloniex-node-api";
const client = new PublicClient();
```

- [`getMarkets`](https://docs.poloniex.com/#public-endpoints-reference-data-symbol-information)

```typescript
const markets = await client.getMarkets();
```

- [`getMarket`](https://docs.poloniex.com/#public-endpoints-reference-data-symbol-information)

```typescript
const symbol = "ETH_BTC";
const volume = await client.getMarket({ symbol });
```

- [`getCurrency`](https://docs.poloniex.com/#public-endpoints-reference-data-currency-information)

```typescript
const currency = "BNB";
const currency_info = await client.getCurrency({ currency });
```

or

```typescript
const includeMultiChainCurrencies = true;
const all = await client.getCurrency({ includeMultiChainCurrencies });
```

- [`getSystemTime`](https://docs.poloniex.com/#public-endpoints-reference-data-system-timestamp)

```typescript
const time = await client.getSystemTime();
```

- [`getPrices`](https://docs.poloniex.com/#public-endpoints-market-data-prices)

```typescript
const prices = await client.getPrices();
```

- [`getPrice`](https://docs.poloniex.com/#public-endpoints-market-data-prices)

```typescript
const symbol = "ETH_BTC";
const price = await client.getPrice({ symbol });
```

- [`getMarkPrices`](https://docs.poloniex.com/#public-endpoints-market-data-mark-price)

```typescript
const prices = await client.getMarkPrices();
```

- [`getMarkPrice`](https://docs.poloniex.com/#public-endpoints-market-data-mark-price)

```typescript
const symbol = "ZEC_USDT";
const price = await client.getMarkPrice({ symbol });
```

- [`getMarkPriceComponents`](https://docs.poloniex.com/#public-endpoints-market-data-mark-price-components)

```typescript
const symbol = "ZEC_USDT";
const prices = await client.getMarkPriceComponents({ symbol });
```

- [`getOrderBook`](https://docs.poloniex.com/#public-endpoints-market-data-order-book)

```typescript
const symbol = "ETH_BTC";
const limit = 5;
const scale = "0.01";
const book = await client.getOrderBook({ symbol, limit, scale });
```

- [`getCandles`](https://docs.poloniex.com/#public-endpoints-market-data-candles)

```typescript
const symbol = "ETH_BTC";
const interval = "HOUR_1";
const limit = 2;
const endTime = Date.now();
const startTime = endTime - 1000 * 60 * 60 * 24;
const candles = await client.getOrderBook({
  symbol,
  interval,
  limit,
  startTime,
  endTime,
});
```

- [`getPublicTrades`](https://docs.poloniex.com/#public-endpoints-market-data-trades)

```typescript
const symbol = "ETH_BTC";
const limit = 2;
const trades = await client.getPublicTrades({ symbol, limit });
```

- [`getTickers`](https://docs.poloniex.com/#public-endpoints-market-data-ticker)

```typescript
const tickers = await client.getTickers();
```

- [`getTicker`](https://docs.poloniex.com/#public-endpoints-market-data-ticker)

```typescript
const symbol = "ETH_BTC";
const ticker = await client.getTicker({ symbol });
```

- [`getCollateral`](https://docs.poloniex.com/#public-endpoints-margin-collateral-info)

```typescript
const currency = "ETH";
const collateral = await client.getCollateral({ currency });
```

or

```typescript
const all = await client.getCollateral();
```

- [`getBorrowRates`](https://docs.poloniex.com/#public-endpoints-margin-borrow-rates-info)

```typescript
const symbol = "ETH_BTC";
const ticker = await client.getTicker({ symbol });
```

### [AuthenticatedClient](https://docs.poloniex.com/#authenticated-endpoints)

```typescript
import { AuthenticatedClient } from "poloniex-node-api";
const key = "poloniex-api-key";
const secret = "poloniex-api-secret";
const client = new AuthenticatedClient({ key, secret });
```

#### [Accounts](https://docs.poloniex.com/#authenticated-endpoints-accounts)

- [`getAccounts`](https://docs.poloniex.com/#authenticated-endpoints-accounts-account-information)

```typescript
const accounts = await client.getAccounts();
```

- [`getAccountBalances`](https://docs.poloniex.com/#authenticated-endpoints-accounts-all-account-balances)

```typescript
const balances = await client.getAccountBalances();
```

- [`getAccountActivity`](https://docs.poloniex.com/#authenticated-endpoints-accounts-account-activity)

```typescript
const activity = await client.getAccountActivity();
```

- [`transfer`](https://docs.poloniex.com/#authenticated-endpoints-accounts-accounts-transfer)

```typescript
const currency = "USDT";
const amount = "10.5";
const fromAccount = "SPOT";
const toAccount = "FUTURES";
const { transferId } = await client.transfer({
  currency,
  amout,
  fromAccount,
  toAccount,
});
```

- [`getAccountTransfers`](https://docs.poloniex.com/#authenticated-endpoints-accounts-accounts-transfer-records)

```typescript
const transfers = await client.getAccountTransfers();
```

- [`getFeeInfo`](https://docs.poloniex.com/#authenticated-endpoints-accounts-fee-info)

```typescript
const fee_info = await client.getFeeInfo();
```

#### [Wallets](https://docs.poloniex.com/#authenticated-endpoints-wallets)

- [`getWallets`](https://docs.poloniex.com/#authenticated-endpoints-wallets-deposit-addresses)

```typescript
const wallets = await client.getWallets();
```

- [`getWalletsActivity`](https://docs.poloniex.com/#authenticated-endpoints-wallets-wallets-activity-records)

```typescript
const { deposits, withdrawals } = await client.getWalletsActivity();
```

- [`newAddress`](https://docs.poloniex.com/#authenticated-endpoints-wallets-new-currency-address)

```typescript
const { address } = await client.newAddress();
```

- [`withdraw`](https://docs.poloniex.com/#authenticated-endpoints-wallets-withdraw-currency)

```typescript
const { withdrawalRequestsId } = await client.withdraw();
```

#### [Margin](https://docs.poloniex.com/#authenticated-endpoints-margin)

- [`getMargin`](https://docs.poloniex.com/#authenticated-endpoints-margin-account-margin)

```typescript
const info = await client.getMargin();
```

- [`getBorrowStatus`](https://docs.poloniex.com/#authenticated-endpoints-margin-borrow-status)

```typescript
const status = await client.getBorrowStatus();
```

- [`getMaxSize`](https://docs.poloniex.com/#authenticated-endpoints-margin-maximum-buy-sell-amount)

```typescript
const size = await client.getMaxSize();
```

#### [Orders](https://docs.poloniex.com/#authenticated-endpoints-orders)

- [`createOrder`](https://docs.poloniex.com/#authenticated-endpoints-orders-create-order)

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

- [`createOrders`](https://docs.poloniex.com/#authenticated-endpoints-orders-create-multiple-orders)

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

- [`replaceOrder`](https://docs.poloniex.com/#authenticated-endpoints-orders-cancel-replace-order

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
  { price, quantity }
);
```

- [`getOpenOrders`](https://docs.poloniex.com/#authenticated-endpoints-orders-open-orders)

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

- [`getOrder`](https://docs.poloniex.com/#authenticated-endpoints-orders-order-details)

```typescript
const id = "21934611974062080";
const order = await client.getOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "123";
const order = await client.getOrder({ clientOrderId });
```

- [`cancelOrder`](https://docs.poloniex.com/#authenticated-endpoints-orders-cancel-order-by-id)

```typescript
const id = "21934611974062080";
const order = await client.cancelOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "123";
const order = await client.cancelOrder({ clientOrderId });
```

- [`cancelOrders`](https://docs.poloniex.com/#authenticated-endpoints-orders-cancel-multiple-orders-by-ids)

```typescript
const orders = [{ id: "12345" }, { clientOrderId: "myId-1" }];
const results = await client.cancelOrders(orders);
```

- [`cancelAllOrders`](https://docs.poloniex.com/#authenticated-endpoints-orders-cancel-all-orders)

```typescript
const symbols = ["BTC_USDT", "ETH_USDT"];
const accountTypes = ["SPOT"];
const results = await client.cancelAllOrders({ symbols, accountTypes });
```

or (to cancel all orders)

```typescript
const results = await client.cancelAllOrders();
```

- [`killSwitch`](https://docs.poloniex.com/#authenticated-endpoints-orders-kill-switch)

```typescript
const timeout = 60;
const status = await client.killSwitch({ timeout });
```

- [`getKillSwitch`](https://docs.poloniex.com/#authenticated-endpoints-orders-kill-switch-status)

```typescript
const status = await client.getKillSwitch();
```

#### [Smart Orders](https://docs.poloniex.com/#authenticated-endpoints-smart-orders)

- [`createSmartOrder`](https://docs.poloniex.com/#authenticated-endpoints-smart-orders-create-order)

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

- [`replaceSmartOrder`](https://docs.poloniex.com/#authenticated-endpoints-smart-orders-cancel-replace-order

```typescript
const id = "234235233423";
const stopPrice = "18000";
const clientOrderId = "1234Abc";
const response = await client.replaceOrder(
  { id },
  { stopPrice, clientOrderId }
);
```

or by `clientOrderId`

```typescript
const clientOrderId = "1234Abc";
const price = "18000";
const quantity = "20";
const response = await client.replaceOrder(
  { clientOrderId },
  { stopPrice, quantity }
);
```

- [`getOpenSmartOrders`](https://docs.poloniex.com/#authenticated-endpoints-smart-orders-open-orders)

```typescript
const limit = 10;
const orders = await client.getOpenSmartOrders({ limit });
```

or

```typescript
const orders = await client.getOpenSmartOrders();
```

- [`getSmartOrder`](https://docs.poloniex.com/#authenticated-endpoints-smart-orders-cancel-order-by-id)

```typescript
const id = "14368195657859072";
const order = await client.getSmartOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "18113";
const order = await client.getSmartOrder({ clientOrderId });
```

- [`cancelSmartOrder`](https://docs.poloniex.com/#authenticated-endpoints-smart-orders-cancel-order-by-id)

```typescript
const id = "9876543";
const order = await client.cancelSmartOrder({ id });
```

or by `clientOrderId`

```typescript
const clientOrderId = "88888";
const order = await client.cancelSmartOrder({ clientOrderId });
```

- [`cancelSmartOrders`](https://docs.poloniex.com/#authenticated-endpoints-smart-orders-cancel-multiple-orders-by-id)

```typescript
const orders = [{ id: "12345" }, { clientOrderId: "myId-1" }];
const results = await client.cancelSmartOrders(orders);
```

- [`cancelAllSmartOrders`](https://docs.poloniex.com/#authenticated-endpoints-smart-orders-cancel-all-orders)

```typescript
const symbols = ["BTC_USDT", "ETH_USDT"];
const accountTypes = ["SPOT"];
const results = await client.cancelAllSmartOrders({ symbols, accountTypes });
```

or (to cancel all orders)

```typescript
const results = await client.cancelAllSmartOrders();
```

#### [Order history](https://docs.poloniex.com/#authenticated-endpoints-order-history)

- [`getOrders`](https://docs.poloniex.com/#authenticated-endpoints-order-history-orders-history)

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

#### [Trades](https://docs.poloniex.com/#authenticated-endpoints-trades)

- [`getTrades`](https://docs.poloniex.com/#authenticated-endpoints-trades-trade-history)

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

- [`getOrderTrades`](https://docs.poloniex.com/#authenticated-endpoints-trades-trades-by-order-id)

```typescript
const id = "30249408733945856";
const trades = await client.getOrderTrades({ id });
```

### [WebSocketClient](https://docs.poloniex.com/#overview-websockets)

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

- [connectPublicWS](https://docs.poloniex.com/#public-channels)

```typescript
await client.connectPublicWS();
```

- [connectPrivateWS](https://docs.poloniex.com/#authenticated-channels)

```typescript
await client.connectPrivateWS();
```

- [disconnectPublicWS](https://docs.poloniex.com/#public-channels)

```typescript
await client.disconnectPublicWS();
```

- [disconnectPrivateWS](https://docs.poloniex.com/#authenticated-channels)

```typescript
await client.disconnectPrivateWS();
```

- [auth](https://docs.poloniex.com/#authenticated-channels-subscriptions-authentication)

```typescript
await client.auth();
```

- [pingPublic](https://docs.poloniex.com/#overview-div-style-display-none-websockets-div-heartbeats)

```typescript
const ac = new AbortController();
setTimeout(() => {
  ac.abort();
}, 10000).unref();
await client.pingPublic({ signal: ac.signal });
```

- [pingPrivate](https://docs.poloniex.com/#overview-div-style-display-none-websockets-div-heartbeats)

```typescript
await client.pingPrivate();
```

- [unsubscribePublic](https://docs.poloniex.com/#overview-div-style-display-none-websockets-div-subscriptions-unsubscribe)

```typescript
await client.unsubscribePublic();
```

- [unsubscribePrivate](https://docs.poloniex.com/#overview-div-style-display-none-websockets-div-subscriptions-unsubscribe)

```typescript
await client.unsubscribePrivate();
```

- [getPublicSubscriptions](https://docs.poloniex.com/#overview-div-style-display-none-websockets-div-subscriptions-list-subscriptions)

```typescript
const { subscriptions } = await client.getPublicSubscriptions();
```

- [getPrivateSubscriptions](https://docs.poloniex.com/#overview-div-style-display-none-websockets-div-subscriptions-list-subscriptions)

```typescript
const { subscriptions } = await client.getPrivateSubscriptions();
```

- [`send`](https://docs.poloniex.com/#overview-div-style-display-none-websockets-div-subscriptions-list-subscriptions)

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

#### [Candlesticks](https://docs.poloniex.com/#public-channels-subscriptions-candlesticks)

- `subscribeCandles`

```typescript
await client.subscribeCandles();
```

- `unsubscribeCandles`

```typescript
await client.unsubscribeCandles();
```

- `candles`

```typescript
const channel = "candles_day_1";
for await (const candle of client.candles()) {
  console.log(candle);
}
```

#### [Trades](https://docs.poloniex.com/#public-channels-subscriptions-trades)

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

#### [Ticker](https://docs.poloniex.com/#public-channels-subscriptions-ticker)

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

#### [Book](https://docs.poloniex.com/#public-channels-subscriptions-book)

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

#### [Book Level 2](https://docs.poloniex.com/#public-channels-subscriptions-book-level-2)

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

#### [Orders](https://docs.poloniex.com/#authenticated-channels-subscriptions-orders)

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

#### [Balances](https://docs.poloniex.com/#authenticated-channels-subscriptions-balances)

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
