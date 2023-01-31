import { deepStrictEqual } from "node:assert";
import {
  signature,
  ISignedHeaders,
  signatureMethod,
  signatureVersion,
} from "../index.js";

suite("signature", () => {
  test("correct headers", () => {
    const key = "poloniex-api-key";
    const signTimestamp = "1674197467415";
    const expected: ISignedHeaders = {
      key,
      signTimestamp,
      signature: "rCahSwbMNIzxQRUSqzxdMvYP9CDWfRUDNIFDVABxHQQ=",
      signatureMethod,
      signatureVersion: `${signatureVersion}`,
    };
    const searchParams = new URLSearchParams({
      requestBody: JSON.stringify({ a: 1, b: ["2", null] }),
      signTimestamp,
    });

    const actual = signature({
      key,
      secret: "poloniex-api-secret",
      signTimestamp,
      path: "/some/path",
      method: "DELETE",
      searchParams,
    });

    deepStrictEqual(actual, expected);
  });
});
