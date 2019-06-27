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

- `get`

```javascript
publicClient
  .get({ command: 'returnCurrencies' })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
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

### Test

```bash
npm test
```
