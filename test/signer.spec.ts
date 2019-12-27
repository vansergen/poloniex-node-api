import * as assert from "assert";
import { SignRequest } from "../index";

suite("SignRequest", () => {
  test("correct signature", () => {
    const key = "my-key";
    const secret = "my-secret";
    const form = { command: "returnBalances", nonce: 154264078495300 };
    const sign =
      "eed2186d51a9e23aae6b60ba41f76ca3b4c5a2cb620e6f52c351c804660887e28b1a7c9f9a01e2daf77f8103bcd966e1f501de2d062eefb3213da2f47ac06cdc";

    const signtature = SignRequest({ key, secret, form });
    assert.deepStrictEqual(signtature, { sign, key });
  });
});
