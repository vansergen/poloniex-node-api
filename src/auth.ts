import {
  PublicClient,
  IPublicClientOptions,
  IPoloniexGetOptions,
  IPoloniexFetchOptions,
  IRecordType,
} from "./public.js";
import { signature } from "./signature.js";

type IActivityType = "deposits" | "withdrawals";

export interface IActivityOptions
  extends Record<string, Date | number | string | undefined> {
  start: Date | number | string;
  end: Date | number | string;
  activityType?: IActivityType;
}

export interface IWithdrawOptions extends IRecordType {
  currency: string;
  amount: string;
  address: string;
  paymentId?: string;
  allowBorrow?: boolean;
}

export type ISide = "BUY" | "SELL";
export type ITimeInForce = "FOK" | "GTC" | "IOC";
export type IOrderType = "LIMIT_MAKER" | "LIMIT" | "MARKET";

export interface IOrderOptions extends IRecordType {
  symbol: string;
  side: ISide;
  timeInForce?: ITimeInForce;
  type?: IOrderType;
  accountType?: IAccountType;
  price?: string;
  quantity?: string;
  amount?: string;
  clientOrderId?: string;
  allowBorrow?: boolean;
}

type IDirection = "NEXT" | "PRE";

export interface IReplaceOrderOptions
  extends Omit<IOrderOptions, "accountType" | "side" | "symbol"> {
  allowBorrow?: boolean;
  proceedOnFailure?: boolean;
}

export interface IOpenOrdersOptions extends IRecordType {
  symbol?: string | undefined;
  side?: ISide | undefined;
  from?: number | string | undefined;
  direction?: IDirection | undefined;
  limit?: number | string | undefined;
}

type ISmartOrderType = "STOP_LIMIT" | "STOP";

export interface ISmartOrderOptions
  extends Omit<IOrderOptions, "allowBorrow" | "type"> {
  stopPrice: string;
  type?: ISmartOrderType | undefined;
}

export interface IReplaceSmartOrderOptions
  extends Omit<
    ISmartOrderOptions,
    "accountType" | "side" | "stopPrice" | "symbol"
  > {
  stopPrice?: string;
  proceedOnFailure?: boolean;
}

type IHistoryOrderState =
  | "CANCELED"
  | "FAILED"
  | "FILLED"
  | "PARTIALLY_CANCELED";

export interface IOrdersOptions extends IOpenOrdersOptions {
  accountType?: IAccountType;
  type?: IOrderType | IOrderType[] | undefined;
  states?: IHistoryOrderState | IHistoryOrderState[] | undefined;
  hideCancel?: boolean | undefined;
  startTime?: number | undefined;
  endTime?: number | undefined;
}

export interface ITradeOptions {
  limit?: number | string | undefined;
  endTime?: number | string | undefined;
  startTime?: number | string | undefined;
  from?: number | string | undefined;
  direction?: IDirection;
  symbols?: string[] | string | undefined;
}

export type IAccountType = "FUTURES" | "SPOT";
type IAccountState = "LOCKED" | "NORMAL";

export interface IAccount {
  accountId: string;
  accountType: IAccountType;
  accountState: IAccountState;
}

export interface IAccountBalanceOptions extends IRecordType {
  accountType?: IAccountType | undefined;
  id?: string | undefined;
}

export interface IBalance {
  currencyId: string;
  currency: string;
  available: string;
  hold: string;
}

export interface IAccountBalance extends Omit<IAccount, "accountState"> {
  balances: IBalance[];
}

export enum AccountActivities {
  ALL = 200,
  AIRDROP = 201,
  COMMISSION_REBATE = 202,
  STAKING = 203,
  REFERAL_REBATE = 204,
  CREDIT_ADJUSTMENT = 104,
  DEBIT_ADJUSTMENT = 105,
  OTHER = 199,
}

export interface IAccountActivityOptions extends IRecordType {
  startTime?: number | string | undefined;
  endTime?: number | string | undefined;
  activityType?: AccountActivities | undefined;
  limit?: number | string | undefined;
  from?: number | string | undefined;
  direction?: IDirection | undefined;
  currency?: string | undefined;
}

export interface ITransferOptions extends IRecordType {
  currency: string;
  amount: string;
  fromAccount: IAccountType;
  toAccount: IAccountType;
}

export type IAccountTransferOptions = Omit<
  IAccountActivityOptions,
  "activityType"
>;

export interface IBaseWalletActivity {
  currency: string;
  address: string;
  amount: string;
  txid: string;
  timestamp: number;
}

type IDepositStatus = "COMPLETED" | "PENDING";

export interface IDeposit extends IBaseWalletActivity {
  depositNumber: number;
  confirmations: number;
  status: IDepositStatus;
}

type IWithdrawalStatus =
  | "AWAITING APPROVAL"
  | "COMPLETE ERROR"
  | "COMPLETED"
  | "PENDING";

export interface IWithdrawal extends IBaseWalletActivity {
  withdrawalRequestsId: number;
  fee: string;
  status: IWithdrawalStatus;
  ipAddress: string;
  paymentID: string | null;
}

export interface IActivity {
  deposits: IDeposit[];
  withdrawals: IWithdrawal[];
}

export interface IMarginInfo {
  totalAccountValue: string;
  totalMargin: string;
  usedMargin: string;
  freeMargin: string;
  maintenanceMargin: string;
  marginRatio: string;
  time: number;
}

export interface IBorrow {
  currency: string;
  available: string;
  borrowed: string;
  hold: string;
  maxAvailable: string;
  hourlyBorrowRate: string;
  version: string;
}

export interface IMaxSize {
  symbol: string;
  maxLeverage: number;
  availableBuy: string;
  maxAvailableBuy: string;
  availableSell: string;
  maxAvailableSell: string;
}

export interface IOrderId {
  id: string;
  clientOrderId: string;
}

export type IOrderIds = ({ clientOrderId: string } & (
  | { code: number; message: string }
  | { id: string }
))[];

type IOpenOrderState = "NEW" | "PARTIALLY_FILLED";
export type IOrderState =
  | IHistoryOrderState
  | IOpenOrderState
  | "PENDING_CANCEL";
export type IOrderSource = "API" | "APP" | "SMART" | "WEB";

export interface IOrder {
  id: string;
  clientOrderId: string;
  symbol: string;
  state: IOrderState;
  accountType: IAccountType;
  side: ISide;
  type: IOrderType;
  timeInForce: ITimeInForce;
  quantity: string;
  price: string;
  avgPrice: string;
  amount: string;
  filledQuantity: string;
  filledAmount: string;
  createTime: number;
  updateTime: number;
  orderSource?: IOrderSource;
  loan?: boolean;
  cancelReason?: number;
}

export interface IOpenOrder extends Omit<IOrder, "cancelReason"> {
  state: IOpenOrderState;
}

type ICanceledOrderState = "PENDING_CANCEL";
type ISmartOrderState =
  | ICanceledOrderState
  | "CANCELED"
  | "FAILED"
  | "PENDING_NEW"
  | "TRIGGERED";

export interface ISmartOrder
  extends Omit<
    IOrder,
    | "avgPrice"
    | "cancelReason"
    | "filledAmount"
    | "filledQuantity"
    | "loan"
    | "orderSource"
    | "state"
    | "type"
  > {
  type: ISmartOrderType;
  state: ISmartOrderState;
  stopPrice: string;
  triggeredOrder?: IOrder;
}

export interface ICanceledOrder {
  orderId: string;
  clientOrderId: string;
  state: ICanceledOrderState;
  code: number;
  message: string;
}

export interface IKillSwitch {
  startTime: string;
  cancellationTime: string;
}

export interface IOpenSmartOrder extends Omit<ISmartOrder, "triggeredOrder"> {
  state: "PENDING_NEW";
}

type ICanceledSmartOrderState = "CANCELED";

export interface ICanceledSmartOrder extends Omit<ICanceledOrder, "state"> {
  state: ICanceledSmartOrderState;
}

export interface IHistoricalOrder extends IOrder {
  state: IHistoryOrderState;
}

export type IMatchRole = "MAKER" | "TAKER";

export interface ITrade {
  id: string;
  symbol: string;
  accountType: IAccountType;
  orderId: string;
  side: ISide;
  type: IOrderType;
  matchRole: IMatchRole;
  createTime: number;
  price: string;
  quantity: string;
  amount: string;
  feeCurrency: string;
  feeAmount: string;
  pageId: string;
  clientOrderId: string;
  loan?: boolean;
}

type IActivityState = "FAILED" | "PROCESSSING" | "SUCCESS";

export interface IBaseAccountActivity {
  id: string;
  currency: string;
  amount: string;
  state: IActivityState;
  createTime: number;
}

export interface IAccountActivity extends IBaseAccountActivity {
  description: string;
  activityType: AccountActivities;
}

export interface IAccountTransfer extends IBaseAccountActivity {
  fromAccount: IAccountType;
  toAccount: IAccountType;
}

export interface IFee {
  trxDiscount: boolean;
  makerRate: string;
  takerRate: string;
  volume30D: string;
  specialFeeRates: { symbol: string; makerRate: string; takerRate: string }[];
}

export interface AuthenticatedClientOptions extends IPublicClientOptions {
  key: string;
  secret: string;
  signTimestamp?: (() => string) | undefined;
}

export class AuthenticatedClient extends PublicClient {
  readonly #key: string;
  readonly #secret: string;
  readonly #signTimestamp: () => string;

  public constructor({
    key,
    secret,
    signTimestamp = (): string => Date.now().toString(),
    ...rest
  }: AuthenticatedClientOptions) {
    super(rest);
    this.#key = key;
    this.#secret = secret;
    this.#signTimestamp = signTimestamp;
  }

  public get<T = unknown>(
    path = "",
    init: IPoloniexGetOptions = {},
  ): Promise<T> {
    return this.fetch<T>(path, { ...init, method: "GET" });
  }

  public post<T = unknown>(
    path = "",
    init: IPoloniexFetchOptions = {},
  ): Promise<T> {
    return this.fetch<T>(path, { ...init, method: "POST" });
  }

  public delete<T = unknown>(
    path = "",
    init: IPoloniexFetchOptions = {},
  ): Promise<T> {
    return this.fetch<T>(path, { ...init, method: "DELETE" });
  }

  public put<T = unknown>(
    path = "",
    init: IPoloniexFetchOptions = {},
  ): Promise<T> {
    return this.fetch<T>(path, { ...init, method: "PUT" });
  }

  public async fetch<T = unknown>(
    path = "",
    { method = "GET", options = {}, ...init }: IPoloniexFetchOptions = {},
  ): Promise<T> {
    const signTimestamp = this.#signTimestamp();
    const searchParams = new URLSearchParams();
    const has_body = method !== "GET" && Object.keys(options).length > 0;

    if (method === "GET") {
      if (Array.isArray(options)) {
        return Promise.reject(new TypeError("`options` shoud not be an array"));
      }
      PublicClient.setQuery(searchParams, options);
    } else if (has_body) {
      searchParams.set("requestBody", JSON.stringify(options));
    }

    searchParams.set("signTimestamp", signTimestamp);

    if (method === "GET") {
      searchParams.sort();
    }

    const { ...headers } = signature({
      method,
      searchParams,
      signTimestamp,
      path,
      key: this.#key,
      secret: this.#secret,
    });
    init.headers = init.headers ? { ...init.headers, ...headers } : headers;

    const url = new URL(path, this.base_url);
    if (method === "GET") {
      url.search = searchParams.toString();
    } else if (has_body) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(options);
    }

    return super.fetch<T>(url.toString(), { method, ...init });
  }

  /** Get a list of all accounts. */
  public getAccounts(): Promise<IAccount[]> {
    return this.get<IAccount[]>("/accounts");
  }

  /** Get a list of all accounts. */
  public getAccountBalances(options: {
    id: string;
  }): Promise<[IAccountBalance]>;
  public getAccountBalances(options?: {
    accountType?: IAccountBalanceOptions["accountType"];
  }): Promise<IAccountBalance[]>;
  public getAccountBalances({
    id,
    ...options
  }: IAccountBalanceOptions = {}): Promise<IAccountBalance[]> {
    if (typeof id === "string") {
      return this.get<IAccountBalance[]>(`/accounts/${id}/balances`);
    }
    return this.get<IAccountBalance[]>("/accounts/balances", { options });
  }

  /** Get a list of activities such as airdrop, rebates, staking, credit/debit adjustments, and other (historical adjustments). */
  public getAccountActivity(
    options: IAccountActivityOptions = {},
  ): Promise<IAccountActivity[]> {
    return this.get<IAccountActivity[]>("/accounts/activity", { options });
  }

  /** Transfer amount of currency from an account to another account  */
  public transfer(options: ITransferOptions): Promise<{ transferId: string }> {
    return this.post<{ transferId: string }>("/accounts/transfer", { options });
  }

  /** Get a list of transfer records. */
  public getAccountTransfers(
    options: IAccountTransferOptions = {},
  ): Promise<IAccountTransfer[]> {
    return this.get<IAccountTransfer[]>("/accounts/transfer", { options });
  }

  /** Get fee rate. */
  public getFeeInfo(): Promise<IFee> {
    return this.get<IFee>("/feeinfo");
  }

  /** Get deposit addresses. */
  public getWallets(
    options: { currency?: string } = {},
  ): Promise<Record<string, string>> {
    return this.get<Record<string, string>>("/wallets/addresses", { options });
  }

  /** Get deposit and withdrawal activity history within a range window. */
  public getWalletsActivity({
    start,
    end,
    ...options
  }: IActivityOptions): Promise<IActivity> {
    return this.get<IActivity>("/wallets/activity", {
      options: {
        ...options,
        start: start instanceof Date ? start.getTime() : start,
        end: end instanceof Date ? end.getTime() : end,
      },
    });
  }

  /** Create a new address for a currency. */
  public newAddress(options: {
    currency: string;
  }): Promise<{ address: string }> {
    return this.post<{ address: string }>("/wallets/address", { options });
  }

  /** Immediately place a withdrawal for a given currency, with no email confirmation. */
  public withdraw(
    options: IWithdrawOptions,
  ): Promise<{ withdrawalRequestsId: number }> {
    return this.post<{ withdrawalRequestsId: number }>("/wallets/withdraw", {
      options,
    });
  }

  /** Get account margin information. */
  public getMargin({
    accountType = "SPOT",
  }: { accountType?: IAccountType } = {}): Promise<IMarginInfo> {
    return this.get<IMarginInfo>("/margin/accountMargin", {
      options: { accountType },
    });
  }

  /** Get borrow status of currencies. */
  public getBorrowStatus(
    options: { currency?: string } = {},
  ): Promise<IBorrow> {
    return this.get<IBorrow>("/margin/borrowStatus", { options });
  }

  /** Get maximum and available buy/sell amount for a given symbol. */
  public getMaxSize({ symbol = this.symbol } = {}): Promise<IMaxSize> {
    return this.get<IMaxSize>("/margin/maxSize", { options: { symbol } });
  }

  /** Create an order. */
  public createOrder(options: IOrderOptions): Promise<IOrderId> {
    return this.post<IOrderId>("/orders", { options });
  }

  /** Create multiple orders via a single request. */
  public createOrders(options: IOrderOptions[]): Promise<IOrderIds> {
    if (!options.length) {
      return Promise.reject(new TypeError("Empty arrays are not allowed"));
    }
    return this.post<IOrderIds>("/orders/batch", { options });
  }

  /** Cancel an existing active order, new or partially filled, and place a new order on the same symbol with details from existing order unless amended by new parameters. */
  public replaceOrder(
    id: { clientOrderId: string } | { id: string },
    options?: IReplaceOrderOptions,
  ): Promise<IOrderId>;
  public replaceOrder(
    { id, clientOrderId }: Partial<IOrderId>,
    options: IReplaceOrderOptions = {},
  ): Promise<IOrderId> {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing"),
        )
      : this.put<IOrderId>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `/orders/${typeof id === "string" ? id : `cid:${clientOrderId!}`}`,
          { options },
        );
  }

  /** Get a list of active orders. */
  public getOpenOrders(
    options: IOpenOrdersOptions = {},
  ): Promise<IOpenOrder[]> {
    return this.get<IOpenOrder[]>("/orders", { options });
  }

  /** Get an order’s status. */
  public getOrder(
    options: { clientOrderId: string } | { id: string },
  ): Promise<IOrder>;
  public getOrder({ id, clientOrderId }: Partial<IOrderId>): Promise<IOrder> {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing"),
        )
      : this.get<IOrder>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `/orders/${typeof id === "string" ? id : `cid:${clientOrderId!}`}`,
        );
  }

  /** Cancel an active order. */
  public cancelOrder(
    options: { clientOrderId: string } | { id: string },
  ): Promise<ICanceledOrder>;
  public cancelOrder({
    id,
    clientOrderId,
  }: Partial<IOrderId>): Promise<ICanceledOrder> {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing"),
        )
      : this.delete<ICanceledOrder>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `/orders/${typeof id === "string" ? id : `cid:${clientOrderId!}`}`,
        );
  }

  /** Batch cancel one or many active orders. */
  public cancelOrders(
    orders: ({ clientOrderId: string } | { id: string })[],
  ): Promise<ICanceledOrder[]> {
    const options = orders.reduce(
      (previousValue, currentValue) => {
        if ("id" in currentValue) {
          previousValue.orderIds.push(currentValue.id);
        } else if ("clientOrderId" in currentValue) {
          previousValue.clientOrderIds.push(currentValue.clientOrderId);
        }
        return previousValue;
      },
      { orderIds: [] as string[], clientOrderIds: [] as string[] },
    );

    if (!options.orderIds.length && !options.clientOrderIds.length) {
      return Promise.reject(new TypeError("No orders to cancel"));
    }

    return this.delete<ICanceledOrder[]>("/orders/cancelByIds", { options });
  }

  /** Batch cancel all orders. */
  public cancelAllOrders(
    options: { symbols?: string[]; accountTypes?: IAccountType[] } = {},
  ): Promise<ICanceledOrder[]> {
    return this.delete<ICanceledOrder[]>("/orders", { options });
  }

  public killSwitch(options: {
    timeout: number | string;
  }): Promise<IKillSwitch> {
    const timeout = Number(options.timeout);
    if (
      timeout !== -1 &&
      (!Number.isInteger(timeout) || timeout < 10 || timeout > 600)
    ) {
      return Promise.reject(new TypeError("Invalid timeout value"));
    }
    return this.post<IKillSwitch>("/orders/killSwitch", {
      options: { timeout: `${timeout}` },
    });
  }

  /** Get status of kill switch. */
  public getKillSwitch(): Promise<IKillSwitch> {
    return this.get<IKillSwitch>("/orders/killSwitchStatus");
  }

  /** Create a smart order. */
  public createSmartOrder(options: ISmartOrderOptions): Promise<IOrderId> {
    return this.post<IOrderId>("/smartorders", { options });
  }

  /** Cancel an existing untriggered smart order and place a new smart order on the same symbol with details from existing smart order unless amended by new parameters. */
  public replaceSmartOrder(
    id: { clientOrderId: string } | { id: string },
    options: IReplaceSmartOrderOptions,
  ): Promise<IOrderId>;
  public replaceSmartOrder(
    { id, clientOrderId }: Partial<IOrderId>,
    options: IReplaceSmartOrderOptions,
  ): Promise<IOrderId> {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing"),
        )
      : this.put<IOrderId>(
          `/smartorders/${
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            typeof id === "string" ? id : `cid:${clientOrderId!}`
          }`,
          { options },
        );
  }

  /** Get a list of (pending) smart orders. */
  public getOpenSmartOrders(
    options: { limit?: number } = {},
  ): Promise<IOpenSmartOrder[]> {
    return this.get<IOpenSmartOrder[]>("/smartorders", { options });
  }

  /** Get a smart order’s status. */
  public getSmartOrder(
    options: { clientOrderId: string } | { id: string },
  ): Promise<ISmartOrder | null>;
  public async getSmartOrder({
    id,
    clientOrderId,
  }: Partial<IOrderId>): Promise<ISmartOrder | null> {
    if (typeof id !== "string" && typeof clientOrderId !== "string") {
      throw new TypeError("Either `id` or `clientOrderId` is missing");
    }

    const [order] = await this.get<[ISmartOrder | undefined]>(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `/smartorders/${typeof id === "string" ? id : `cid:${clientOrderId!}`}`,
    );

    return order ?? null;
  }

  /** Cancel an active smart order. */
  public cancelSmartOrder(
    options: { clientOrderId: string } | { id: string },
  ): Promise<ICanceledSmartOrder>;
  public cancelSmartOrder({
    id,
    clientOrderId,
  }: Partial<IOrderId>): Promise<ICanceledSmartOrder> {
    return typeof id !== "string" && typeof clientOrderId !== "string"
      ? Promise.reject(
          new TypeError("Either `id` or `clientOrderId` is missing"),
        )
      : this.delete<ICanceledSmartOrder>(
          `/smartorders/${
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            typeof id === "string" ? id : `cid:${clientOrderId!}`
          }`,
        );
  }

  /** Batch cancel one or many active smart orders. */
  public cancelSmartOrders(
    orders: ({ clientOrderId: string } | { id: string })[],
  ): Promise<ICanceledSmartOrder[]> {
    const options = orders.reduce(
      (previousValue, currentValue) => {
        if ("id" in currentValue) {
          previousValue.orderIds.push(currentValue.id);
        } else if ("clientOrderId" in currentValue) {
          previousValue.clientOrderIds.push(currentValue.clientOrderId);
        }
        return previousValue;
      },
      { orderIds: [] as string[], clientOrderIds: [] as string[] },
    );

    if (!options.orderIds.length && !options.clientOrderIds.length) {
      return Promise.reject(new TypeError("No smart orders to cancel"));
    }
    return this.delete<ICanceledSmartOrder[]>("/smartorders/cancelByIds", {
      options,
    });
  }

  /** Batch cancel all orders. */
  public cancelAllSmartOrders(
    options: { symbols?: string[]; accountTypes?: IAccountType[] } = {},
  ): Promise<ICanceledSmartOrder[]> {
    return this.delete<ICanceledSmartOrder[]>("/smartorders", { options });
  }

  /** Get a list of historical orders. */
  public getOrders({ ...options }: IOrdersOptions = {}): Promise<
    IHistoricalOrder[]
  > {
    if (Array.isArray(options.states)) {
      options.states = options.states.join(",") as IHistoryOrderState;
    }
    if (Array.isArray(options.type)) {
      options.type = options.type.join(",") as IOrderType;
    }
    return this.get<IHistoricalOrder[]>("/orders/history", { options });
  }

  /** Get a list of all trades. */
  public getTrades({ ...options }: ITradeOptions = {}): Promise<ITrade[]> {
    if (Array.isArray(options.symbols)) {
      options.symbols = options.symbols.join(",");
    }
    return this.get<ITrade[]>("/trades", { options });
  }

  /** Get a list of all trades for an order specified by its orderId. */
  public getOrderTrades({ id }: { id: string }): Promise<ITrade[]> {
    return this.get<ITrade[]>(`/orders/${id}/trades`);
  }
}
