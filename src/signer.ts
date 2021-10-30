import { createHmac } from "node:crypto";

export interface SignRequestOptions {
  key: string;
  secret: string;
  body: string;
}

export interface SignedRequest {
  key: string;
  sign: string;
}

export function SignRequest({
  key,
  secret,
  body,
}: SignRequestOptions): SignedRequest {
  return { key, sign: createHmac("sha512", secret).update(body).digest("hex") };
}
