import { RPC } from "rpc-request";

export const ApiUri = "https://poloniex.com";
export const DefaultTimeout = 30000;
export const DefaultPair = "USDT_BTC";
export const ApiLimit = 100;
export const Headers = {
  "User-Agent": "poloniex-node-api-client",
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest"
};

export type PublicClientOptions = {
  currencyPair?: string;
  apiUri?: string;
  timeout?: number;
};

export class PublicClient extends RPC {
  readonly currencyPair: string;

  constructor({
    currencyPair = DefaultPair,
    apiUri = ApiUri,
    timeout = DefaultTimeout
  }: PublicClientOptions = {}) {
    super({ baseUrl: apiUri, json: true, headers: Headers, timeout });
    this.currencyPair = currencyPair || DefaultPair;
  }
}
