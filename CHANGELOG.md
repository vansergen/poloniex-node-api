# Changelog

## [3.0.0](https://github.com/vansergen/poloniex-node-api/compare/v2.0.4...v3.0.0) (2020-12-20)

### ⚠ BREAKING CHANGES

- drop Node `<12.20.0` support
- the main methods of the `WebsocketClient` class return promises
- update AuthenticatedClient
- class `PublicClient` extends `FetchClient`
- pass `body` as string

### Features

- add extended currencies ([64461d6](https://github.com/vansergen/poloniex-node-api/commit/64461d676923f10a6dd125517e9f28bccee4223c))
- add margin position update support to `WebsocketClient` ([9d7766f](https://github.com/vansergen/poloniex-node-api/commit/9d7766fd8628445aa239f6ff147a36724f3c777c))
- add the `clientOrderId` property to `Order` ([7a402e5](https://github.com/vansergen/poloniex-node-api/commit/7a402e531b0711d7167e4eeae3bd06629ceb64b2))

### Bug Fixes

- do not format unnkown messages as a `killed` message ([6956c84](https://github.com/vansergen/poloniex-node-api/commit/6956c847e4ba9e85ca37ef46e7d80c40c997a18e))
- rename the interface `Currencies` to `ICurrencies` ([82875e4](https://github.com/vansergen/poloniex-node-api/commit/82875e4d30aad20c886b0ded12e0fdcba5265cae))
- update AuthenticatedClient ([51a9df3](https://github.com/vansergen/poloniex-node-api/commit/51a9df34be4ccebb8fec7f3f079d49c8ff1e4f49))
- update currencies ([6039e76](https://github.com/vansergen/poloniex-node-api/commit/6039e760a92d588f83215135489a5c3a8794c8d9))
- update currency pairs ([e09ee85](https://github.com/vansergen/poloniex-node-api/commit/e09ee85b0c1fa74c0bfcf221042d9bc27d2cf700))
- update interfaces ([485d451](https://github.com/vansergen/poloniex-node-api/commit/485d451c7b7cf72b6730a09f9b9f206ac0d117ae))
- upgrade @types/ws from 7.2.6 to 7.2.7 ([e4b6ba1](https://github.com/vansergen/poloniex-node-api/commit/e4b6ba162ed351bbcac4588774c8bb339e6aee3c))
- upgrade @types/ws from 7.2.7 to 7.2.8 ([365c8e3](https://github.com/vansergen/poloniex-node-api/commit/365c8e3e62a60820dbb3136f7928495248770395))

### Performance Improvements

- class `PublicClient` extends `FetchClient` ([b4bd1ef](https://github.com/vansergen/poloniex-node-api/commit/b4bd1ef08ba405811497a59d5a503093ad42a309))
- drop Node `<14.15.3` support ([e4245a4](https://github.com/vansergen/poloniex-node-api/commit/e4245a49bd57f7c3772fbf933a7a3c8b50952d2e))
- pass `body` as string ([7c70743](https://github.com/vansergen/poloniex-node-api/commit/7c70743c0ea207b40c6d19e842ae560d66aa89e9))
- the main methods of the `WebsocketClient` class return promises ([403ddef](https://github.com/vansergen/poloniex-node-api/commit/403ddef5e7fa9d69b0f9d131c49e6e3193da1ace))

### Dependencies

- update `@types/ws` to `v7.4.0` ([35e20b1](https://github.com/vansergen/poloniex-node-api/commit/35e20b143753bbd6533cec0fc9b746d1a3a83152))
- update `rpc-request` to `v5.0.0` ([9dcd30c](https://github.com/vansergen/poloniex-node-api/commit/9dcd30c6bf2b5ed710c95c594e8eb787c3c32881))
- update `ws` to `v7.4.1` ([dc7cd92](https://github.com/vansergen/poloniex-node-api/commit/dc7cd929eca4a72bfab7468f8697aa7883fe597f))

### Miscellaneous Chores

- drop Node `<12.20.0` support ([b6786c7](https://github.com/vansergen/poloniex-node-api/commit/b6786c70afbfeba300900dada8dfefbd96807be8))