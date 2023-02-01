# Changelog

## [6.0.1](https://github.com/vansergen/poloniex-node-api/compare/v6.0.0...v6.0.1) (2023-02-01)

### Bug Fixes

- **types:** update the `types` path ([9c50469](https://github.com/vansergen/poloniex-node-api/commit/9c5046967962551232f07c82ce7b7b9ae18fe592))
- **types:** update WebSocket events ([7a282f1](https://github.com/vansergen/poloniex-node-api/commit/7a282f11e799cafa3e485f0a6bb03fb524934044))

## [6.0.0](https://github.com/vansergen/poloniex-node-api/compare/v5.0.5...v6.0.0) (2023-01-31)

### ⚠ BREAKING CHANGES

- drop Node `<16.19.0` support
- move legacy API to the `legacy` path

### Features

- add `AuthenticatedClient` ([975a126](https://github.com/vansergen/poloniex-node-api/commit/975a1263db5794cae9cdc4b2bb544280a5e74149))
- add `PublicClient` ([7566a78](https://github.com/vansergen/poloniex-node-api/commit/7566a7826466d4fb912695eee1604ab1000d43a5))
- add `WebSocketClient` ([e0412cb](https://github.com/vansergen/poloniex-node-api/commit/e0412cb7b01854a8b1f5043525115a2b86161960))

### Performance Improvements

- drop Node `<16.19.0` support ([5e692c9](https://github.com/vansergen/poloniex-node-api/commit/5e692c9714f6552ab889432c45d2f0451b14520f))

### Code Refactoring

- move legacy API to the `legacy` path ([c79a34f](https://github.com/vansergen/poloniex-node-api/commit/c79a34f90b856989d7db28f67d13bf83f76abdc3))

## [5.0.5](https://github.com/vansergen/poloniex-node-api/compare/v5.0.4...v5.0.5) (2023-01-23)

### Dependencies

- bump rpc-request from 7.1.0 to 7.1.1 ([d865b55](https://github.com/vansergen/poloniex-node-api/commit/d865b55fad6df2c84f2246e345b5b6edd2dfd27a))

## [5.0.4](https://github.com/vansergen/poloniex-node-api/compare/v5.0.3...v5.0.4) (2023-01-12)

### Dependencies

- bump rpc-request from 6.0.2 to 7.1.0 ([9107349](https://github.com/vansergen/poloniex-node-api/commit/9107349ca747c959fb324de6aae6ecea25a534d8))

## [5.0.3](https://github.com/vansergen/poloniex-node-api/compare/v5.0.2...v5.0.3) (2023-01-11)

### Bug Fixes

- update `Currencies` ([a2b51a2](https://github.com/vansergen/poloniex-node-api/commit/a2b51a23613ade6a7bfeef0e4da76abc45435fa2))
- update `CurrencyPairs` ([adf46a7](https://github.com/vansergen/poloniex-node-api/commit/adf46a7e12f59586820f821e37654e5e9573ec28))

### Dependencies

- update ws from 8.8.0 to 8.12.0 ([b5cf923](https://github.com/vansergen/poloniex-node-api/commit/b5cf923cb044524c38b8ecb3abf18d12563aeed0))

### [5.0.2](https://github.com/vansergen/poloniex-node-api/compare/v5.0.1...v5.0.2) (2022-06-26)

### Bug Fixes

- update `Currencies` ([1e4ff3a](https://github.com/vansergen/poloniex-node-api/commit/1e4ff3a6c095f329c9dd6e1f5ffa2085aa1eb204))
- update `CurrencyPairs` ([c4c8dcf](https://github.com/vansergen/poloniex-node-api/commit/c4c8dcf4ba9840ad38303f50611c359f20444a0d))

### Dependencies

- upgrade `rpc-request` to `v6.0.2` ([8126dfb](https://github.com/vansergen/poloniex-node-api/commit/8126dfb68e1efc6efab6314b5968593d8f5b9bc5))
- upgrade `ws` to `v8.8.0` ([a8a2c37](https://github.com/vansergen/poloniex-node-api/commit/a8a2c37dba74eb82028f4ee3e6b4c0d7bb80de27))

### [5.0.1](https://github.com/vansergen/poloniex-node-api/compare/v5.0.0...v5.0.1) (2022-05-13)

### Bug Fixes

- update `Currencies` ([9147a23](https://github.com/vansergen/poloniex-node-api/commit/9147a231ad744fd57cbca963c3818ef5ef4c683e))
- update `CurrencyPairs` ([fb9690c](https://github.com/vansergen/poloniex-node-api/commit/fb9690cb28883b8b81429868056acbecdfdd7ede))

### Dependencies

- upgrade `ws` to `v8.6.0` ([9e6a1be](https://github.com/vansergen/poloniex-node-api/commit/9e6a1be7502c34a638b481701acc9902a01dd5f6))

## [5.0.0](https://github.com/vansergen/poloniex-node-api/compare/v4.0.1...v5.0.0) (2021-10-30)

### ⚠ BREAKING CHANGES

- drop Node.js `<16.13.0` support
- change package type from `commonjs` to `module`
- rename the class `WebsocketClient` to `WebSocketClient`

### Bug Fixes

- add the `epoch_ms` field to WebSocket message ([92da589](https://github.com/vansergen/poloniex-node-api/commit/92da5896081c106d541dce9b17e8f17c66ec5d0c))
- update `Currencies` ([eb3d647](https://github.com/vansergen/poloniex-node-api/commit/eb3d647c08bfe0a5328a50d9945b2aad85ad2f7e))
- update `CurrencyPairs` ([56d0cc0](https://github.com/vansergen/poloniex-node-api/commit/56d0cc0f0ba4ba77f0d4fa0a5911f7458974b79a))

### Performance Improvements

- change package type from `commonjs` to `module` ([99d3850](https://github.com/vansergen/poloniex-node-api/commit/99d3850325f1ec6d1b59f29c3796b91ada405599))
- drop Node.js `<16.13.0` support ([883abfe](https://github.com/vansergen/poloniex-node-api/commit/883abfe7ee736bbb61590c5a1018c611b80139f7))

### Dependencies

- upgrade `@types/ws` to `v8.2.0` ([e99f935](https://github.com/vansergen/poloniex-node-api/commit/e99f9356cd379e1d477b4aac5568a4100f54be75))
- upgrade `rpc-request` to `v6.0.0` ([371d56a](https://github.com/vansergen/poloniex-node-api/commit/371d56ad9937309a81d743015e709e3192001c9b))
- upgrade `ws` to `v8.2.3` ([c788e6d](https://github.com/vansergen/poloniex-node-api/commit/c788e6db9f5e358c1c90e9f15016ecd3c7963828))

### Code Refactoring

- rename the class `WebsocketClient` to `WebSocketClient` ([ba9780b](https://github.com/vansergen/poloniex-node-api/commit/ba9780b6a89b89dd9d6e835eb2bd501abfe6e776))

### [4.0.1](https://github.com/vansergen/poloniex-node-api/compare/v4.0.0...v4.0.1) (2021-06-03)

### Metadata

- update the `engines` ([6d3f64d](https://github.com/vansergen/poloniex-node-api/commit/6d3f64d4804bf17848faeb101d2001f7821fb89e))

## [4.0.0](https://github.com/vansergen/poloniex-node-api/compare/v3.1.1...v4.0.0) (2021-06-03)

### ⚠ BREAKING CHANGES

- drop Node <16.3.0 support

### Bug Fixes

- update Currencies ([faad8d0](https://github.com/vansergen/poloniex-node-api/commit/faad8d08b01cf2c43a5a1dcf0f2d5ce622002cef))
- update currency pairs ([85d4f9f](https://github.com/vansergen/poloniex-node-api/commit/85d4f9ff3ba62c30f1c26e4b91fa3545539b459d))

### Performance Improvements

- drop Node <16.3.0 support ([c0800c1](https://github.com/vansergen/poloniex-node-api/commit/c0800c13719da60896ec28ad07a942ff2d953700))

### Dependencies

- upgrade `@types/ws` to `v7.4.4` ([05e15ce](https://github.com/vansergen/poloniex-node-api/commit/05e15ce3af688aa3ab1b91c619abb107854d9473))
- upgrade `ws` to `v7.4.6` ([3b73402](https://github.com/vansergen/poloniex-node-api/commit/3b73402ebdef1c2aea094a35030e4356e0129801))

### [3.1.1](https://github.com/vansergen/poloniex-node-api/compare/v3.1.0...v3.1.1) (2021-03-07)

### Bug Fixes

- update `Currencies` ([64d851c](https://github.com/vansergen/poloniex-node-api/commit/64d851ca1b3aaadecea26dc7f5ee0541a408f66b))
- update `CurrencyPairs` ([f344ba7](https://github.com/vansergen/poloniex-node-api/commit/f344ba71076cd50a02f25b295944b0c574c50d3d))

### Dependencies

- upgrade `rpc-request` to `v5.0.3` ([0612abb](https://github.com/vansergen/poloniex-node-api/commit/0612abb2c64941162171ee981425c089285ec9c5))
- upgrade `ws` to `v7.4.4` ([5f3f16f](https://github.com/vansergen/poloniex-node-api/commit/5f3f16f8ee7d4ff62552bb3e659d7e1166755bfa))

## [3.1.0](https://github.com/vansergen/poloniex-node-api/compare/v3.0.3...v3.1.0) (2021-02-14)

### Features

- add the `swapCurrencies` method ([a104dd8](https://github.com/vansergen/poloniex-node-api/commit/a104dd8cf69cd09e1f64ae70818eb7bd64be93ae))

### Dependencies

- upgrade `rpc-request` to `v5.0.2` ([d24a753](https://github.com/vansergen/poloniex-node-api/commit/d24a7539905e521644c8fd85e83dff24e6ccc4a9))

### [3.0.3](https://github.com/vansergen/poloniex-node-api/compare/v3.0.2...v3.0.3) (2021-02-08)

### Bug Fixes

- update Currencies ([5fd080b](https://github.com/vansergen/poloniex-node-api/commit/5fd080b64c25f638dc831465a088f934081f18b7))
- update CurrencyPairs ([fee61d9](https://github.com/vansergen/poloniex-node-api/commit/fee61d98f2a8f63e293e0cee4ce10ac24857d7e0))

### [3.0.2](https://github.com/vansergen/poloniex-node-api/compare/v3.0.1...v3.0.2) (2021-02-07)

### Dependencies

- upgrade `ws` to `v7.4.3` ([7a1a8d2](https://github.com/vansergen/poloniex-node-api/commit/7a1a8d2917b394d3857ac36e6d2906b80cf934cb))

### [3.0.1](https://github.com/vansergen/poloniex-node-api/compare/v3.0.0...v3.0.1) (2020-12-20)

### Dependencies

- update `rpc-request` to `v5.0.1` ([1ca8121](https://github.com/vansergen/poloniex-node-api/commit/1ca812100e1bab730d3382b07cb0a5d9aa3b097b))

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
