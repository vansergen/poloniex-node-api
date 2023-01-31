import { createHmac } from "node:crypto";

export type ISignatureMethod = "HmacSHA256";

export const signatureMethod: ISignatureMethod = "HmacSHA256";
export const signatureVersion = 1;

export interface ISignatureOptions {
  method: string;
  searchParams: URLSearchParams;
  key: string;
  secret: string;
  signTimestamp: number | string;
  path: string;
}

export interface ISignedHeaders {
  key: string;
  signature: string;
  signTimestamp: string;
  signatureMethod: string;
  signatureVersion: string;
}

export function signature({
  key,
  secret,
  signTimestamp,
  path,
  method,
  searchParams,
}: ISignatureOptions): ISignedHeaders {
  const data = decodeURIComponent(searchParams.toString());
  return {
    key,
    signature: createHmac("sha256", secret)
      .update(`${method}\n${path}\n${data}`)
      .digest("base64"),
    signTimestamp: `${signTimestamp}`,
    signatureMethod,
    signatureVersion: `${signatureVersion}`,
  };
}
