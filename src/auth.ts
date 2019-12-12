import { PublicClient, PublicClientOptions } from "./public";

export type AuthenticatedClientOptions = PublicClientOptions & {
  key: string;
  secret: string;
};

export class AuthenticatedClient extends PublicClient {
  readonly key: string;
  readonly secret: string;

  constructor({ key, secret, ...rest }: AuthenticatedClientOptions) {
    super(rest);
    this.key = key;
    this.secret = secret;
  }
}
