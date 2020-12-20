import { createHmac } from "crypto";

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
  const hmac = createHmac("sha512", secret).update(body);
  const sign = hmac.digest("hex");
  return { key, sign };
}
