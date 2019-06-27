# Poloniex Node.js API

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
