const DEFAULT_TIMEOUT = 10000;
const API_LIMIT = 100;
const DEFAULT_PAIR = 'USDT_BTC';
const EXCHANGE_API_URL = 'https://poloniex.com';
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
  HEADERS,
};
