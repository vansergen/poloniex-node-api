const DEFAULT_TIMEOUT = 10000;
const API_LIMIT = 100;
const EXCHANGE_API_URL = 'https://poloniex.com';
const HEADERS = {
  'User-Agent': 'poloniex-node-api-client',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

module.exports = { API_LIMIT, DEFAULT_TIMEOUT, EXCHANGE_API_URL, HEADERS };
