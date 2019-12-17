import { RPCOptions } from "rpc-request";
import {
  PublicClient,
  PublicClientOptions,
  Headers,
  CurrencyFilter
} from "./public";
import { SignRequest } from "./signer";

export type AccountFilter = { account?: string };

export type Balances = { [currency: string]: string };

export type CompleteBalance = {
  available: string;
  onOrders: string;
  btcValue: string;
};

export type CompleteBalances = { [currency: string]: CompleteBalance };

export type Adresses = { [currency: string]: string };

export type NewAddress = { success: 0 | 1; response: string };

export type AuthenticatedClientOptions = PublicClientOptions & {
  key: string;
  secret: string;
};

export class AuthenticatedClient extends PublicClient {
  readonly key: string;
  readonly secret: string;
  _nonce?: () => number;

  constructor({ key, secret, ...rest }: AuthenticatedClientOptions) {
    super(rest);
    this.key = key;
    this.secret = secret;
  }

  post({ form }: RPCOptions): Promise<any> {
    if (!form || typeof form === "string") {
      throw new Error("Incorrect form");
    }

    form.nonce = this.nonce();
    const headers = SignRequest({ key: this.key, secret: this.secret, form });
    const uri = "/tradingApi";
    return super.post({ form, headers: { ...Headers, ...headers }, uri });
  }

  /**
   * Get all of your balances available for trade after having deducted all open orders.
   */
  getBalances(): Promise<Balances> {
    return this.post({ form: { command: "returnBalances" } });
  }

  /**
   * Get all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance.
   */
  getCompleteBalances(form: AccountFilter = {}): Promise<CompleteBalances> {
    return this.post({ form: { command: "returnCompleteBalances", ...form } });
  }

  /**
   * Get all of your deposit addresses.
   */
  getDepositAddresses(): Promise<Adresses> {
    return this.post({ form: { command: "returnDepositAddresses" } });
  }

  /**
   * Generate a new deposit address.
   */
  getNewAddress(form: CurrencyFilter): Promise<NewAddress> {
    return this.post({ form: { command: "generateNewAddress", ...form } });
  }

  set nonce(nonce: () => number) {
    this._nonce = nonce;
  }

  get nonce(): () => number {
    if (this._nonce) {
      return this._nonce;
    }
    return () => Date.now();
  }
}
