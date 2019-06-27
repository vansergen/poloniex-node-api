const DEFAULT_TIMEOUT = 10000;
const EXCHANGE_API_URL = 'https://poloniex.com';
const HEADERS = {
  'User-Agent': 'poloniex-node-api-client',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

module.exports = { DEFAULT_TIMEOUT, EXCHANGE_API_URL, HEADERS };
