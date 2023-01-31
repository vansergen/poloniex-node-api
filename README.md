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

### Test

```bash
npm test
```

### Coverage

```bash
npm run coverage
```
