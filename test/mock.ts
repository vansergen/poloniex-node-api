import { deepStrictEqual, ok } from "node:assert";
import { mock } from "node:test";

export interface IMockFetchOptions {
  path: string;
  method: string;
  headers?:
    | ((h: Record<string, string | undefined>) => boolean)
    | Record<string, string>;
  query?: Record<string, unknown>;
  body?(s: string | null): boolean;
}

export interface IMockReplyInit {
  status?: number;
  headers?: Record<string, string>;
}

interface IMockInterceptor {
  reply(status: number, response: unknown, init?: IMockReplyInit): void;
}

interface IMockPool {
  intercept(expected: IMockFetchOptions): IMockInterceptor;
}

function compareEntries(
  [firstKey, firstValue]: [string, string],
  [secondKey, secondValue]: [string, string],
): number {
  const keyComparison = firstKey.localeCompare(secondKey);
  return keyComparison === 0
    ? firstValue.localeCompare(secondValue)
    : keyComparison;
}

export function mockFetch(
  expected: IMockFetchOptions,
  response: unknown,
  init: IMockReplyInit = {},
): void {
  mock.method(
    globalThis,
    "fetch",
    (
      input: string | URL | Request,
      requestInit: RequestInit = {},
    ): Promise<Response> => {
      const inputUrl =
        input instanceof URL
          ? input.href
          : typeof input === "string"
            ? input
            : input.url;
      const url = new URL(inputUrl);

      deepStrictEqual(url.pathname, expected.path);
      deepStrictEqual(requestInit.method, expected.method);

      if (typeof expected.query === "undefined") {
        deepStrictEqual([...url.searchParams.entries()].length, 0);
      } else {
        const expectedParams = new URLSearchParams();
        for (const [key, value] of Object.entries(expected.query)) {
          expectedParams.set(
            key,
            Array.isArray(value) ? value.toString() : String(value),
          );
        }
        const expectedEntries = [...expectedParams.entries()].sort(
          compareEntries,
        );
        const actualEntries = [...url.searchParams.entries()].sort(
          compareEntries,
        );
        deepStrictEqual(actualEntries, expectedEntries);
      }

      if (typeof expected.headers !== "undefined") {
        const headers = new Headers(requestInit.headers);
        const headersObj: Record<string, string | undefined> = {};
        headers.forEach((value, key) => {
          headersObj[key] = value;
        });

        if (typeof expected.headers === "function") {
          ok(expected.headers(headersObj));
        } else {
          for (const [key, value] of Object.entries(expected.headers)) {
            deepStrictEqual(headersObj[key.toLowerCase()], value);
          }
        }
      }

      if (typeof expected.body !== "undefined") {
        const bodyStr =
          typeof requestInit.body === "string" ? requestInit.body : null;
        ok(expected.body(bodyStr));
      }

      return Promise.resolve(
        new Response(JSON.stringify(response), {
          status: init.status ?? 200,
          headers: { "Content-Type": "application/json", ...init.headers },
        }),
      );
    },
    { times: 1 },
  );
}

export const mockPool: IMockPool = {
  intercept(expected: IMockFetchOptions) {
    return {
      reply(
        status: number,
        response: unknown,
        init: IMockReplyInit = {},
      ): void {
        mockFetch(expected, response, { ...init, status });
      },
    };
  },
};
