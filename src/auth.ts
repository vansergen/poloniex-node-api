import { RPCOptions } from "rpc-request";
import { PublicClient, PublicClientOptions, Headers } from "./public";
import { SignRequest } from "./signer";

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
