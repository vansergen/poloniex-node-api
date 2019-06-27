const DEFAULT_TIMEOUT = 10000;
const API_LIMIT = 100;
const DEFAULT_PAIR = 'USDT_BTC';
const EXCHANGE_API_URL = 'https://poloniex.com';
const EXCHANGE_WS_URL = 'wss://api2.poloniex.com';
const CURRENCIES = require('./currencies.js');
const DEFAULT_CHANNELS = [121];
const CURRENCYPAIR = id =>
  Object.keys(CURRENCIES).find(key => {
    return CURRENCIES[key].id === id;
  });
const HEADERS = {
  'User-Agent': 'poloniex-node-api-client',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

module.exports = {
  API_LIMIT,
  DEFAULT_PAIR,
  DEFAULT_TIMEOUT,
  EXCHANGE_API_URL,
  EXCHANGE_WS_URL,
  CURRENCIES,
  CURRENCYPAIR,
  DEFAULT_CHANNELS,
  HEADERS,
};
