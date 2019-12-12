import * as crypto from "crypto";
import { stringify } from "querystring";

export type SignRequestOptions = {
  key: string;
  secret: string;
  form: { [prop: string]: any };
};

export type SignedRequest = { key: string; sign: string };

export function SignRequest({
  key,
  secret,
  form
}: SignRequestOptions): SignedRequest {
  return {
    key: key,
    sign: crypto
      .createHmac("sha512", secret)
      .update(stringify(form))
      .digest("hex")
  };
}
