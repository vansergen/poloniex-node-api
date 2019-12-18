import { RPCOptions } from "rpc-request";
import {
  PublicClient,
  PublicClientOptions,
  Headers,
  CurrencyFilter,
  TimeFilter,
  CurrencyPair,
  Type,
  TradesFilter,
  Trade,
  BaseTrade
} from "./public";
import { SignRequest } from "./signer";

export type AccountFilter = { account?: string };

export type HistoryTradesFilter = TradesFilter & { limit?: number };

export type OrderFilter = { orderNumber: number };

export type OrderOptions = CurrencyPair & {
  rate: number;
  amount: number;
  fillOrKill?: 0 | 1;
  immediateOrCancel?: 0 | 1;
  postOnly?: 0 | 1;
  clientOrderId?: number;
};

export type Balances = { [currency: string]: string };

export type CompleteBalance = {
  available: string;
  onOrders: string;
  btcValue: string;
};

export type CompleteBalances = { [currency: string]: CompleteBalance };

export type Adresses = { [currency: string]: string };

export type NewAddress = { success: 0 | 1; response: string };

export type Adjustment = {
  currency: string;
  amount: string;
  timestamp: number;
  status: string;
  category: "adjustment";
  adjustmentTitle: string;
  adjustmentDesc: string;
  adjustmentHelp: string;
};

export type Withdrawal = {
  withdrawalNumber: number;
  currency: string;
  address: string;
  amount: string;
  fee: string;
  timestamp: number;
  status: string;
  ipAddress: string;
  canCancel: 0 | 1;
  canResendEmail: 0 | 1;
  paymentID: null | string;
  fiatAccountId?: null | string;
  scope?: null | string;
};

export type Deposit = {
  currency: string;
  address: string;
  amount: string;
  confirmations: number;
  txid: string;
  timestamp: number;
  status: "PENDING" | "COMPLETE";
  depositNumber: number;
  category: "deposit";
  fiatAccountId?: null | string;
  scope?: null | string;
};

export type DepositsWithdrawals = {
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  adjustments: Adjustment[];
};

export type Order = Type & {
  orderNumber: string;
  rate: string;
  startingAmount: string;
  amount: string;
  total: string;
  date: string;
  margin: 0 | 1;
};

export type Orders = { [currencyPair: string]: Order[] } | Order[];

export type TradePrivate = Trade & {
  fee: string;
  category: "exchange" | "margin";
};

export type TradesPrivate =
  | { [currencyPair: string]: TradePrivate[] }
  | TradePrivate[];

export type OrderTrade = BaseTrade & {
  globalTradeID: number;
  currencyPair: string;
  fee: string;
};

export type OrderStatus = {
  result: {
    [order: string]: {
      currencyPair: string;
      rate: string;
      amount: string;
      total: string;
      startingAmount: string;
      type: "buy" | "sell";
      status: "Open" | "Partially filled";
      date: string;
      fee?: string;
    };
  };
  success: 0 | 1;
};

export type ResultingTrade = BaseTrade & {
  takerAdjustment?: string;
};

export type OrderResult = {
  orderNumber: string;
  resultingTrades: ResultingTrade[];
  fee: string;
  currencyPair: string;
  clientOrderId?: string;
};

export type AuthenticatedClientOptions = PublicClientOptions & {
  key: string;
  secret: string;
};

export class AuthenticatedClient extends PublicClient {
  readonly key: string;
  readonly secret: string;
  private _nonce?: () => number;

  constructor({ key, secret, ...rest }: AuthenticatedClientOptions) {
    super(rest);
    this.key = key;
    this.secret = secret;
  }

  async post({ form }: RPCOptions): Promise<any> {
    if (!form || typeof form === "string") {
      throw new Error("Incorrect form");
    }

    form.nonce = this.nonce();
    const sHeaders = SignRequest({ key: this.key, secret: this.secret, form });
    const uri = "/tradingApi";
    const headers = { ...Headers, ...sHeaders };
    const data = await super.post({ form, headers, uri });
    if (data.error) {
      throw new Error(data.error);
    } else if ("success" in data && data.success === 0) {
      throw new Error(data.message || data.result.error);
    }
    return data;
  }

  /**
   * Get all of your balances available for trade after having deducted all open orders.
   */
  getBalances(): Promise<Balances> {
    return this.post({ form: { command: "returnBalances" } });
  }

  /**
   * Get all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance.
   */
  getCompleteBalances(form: AccountFilter = {}): Promise<CompleteBalances> {
    return this.post({ form: { command: "returnCompleteBalances", ...form } });
  }

  /**
   * Get all of your deposit addresses.
   */
  getDepositAddresses(): Promise<Adresses> {
    return this.post({ form: { command: "returnDepositAddresses" } });
  }

  /**
   * Generate a new deposit address.
   */
  getNewAddress(form: CurrencyFilter): Promise<NewAddress> {
    return this.post({ form: { command: "generateNewAddress", ...form } });
  }

  /**
   * Get your adjustment, deposit, and withdrawal history within a range window.
   */
  getDepositsWithdrawals(form: TimeFilter): Promise<DepositsWithdrawals> {
    const command = "returnDepositsWithdrawals";
    return this.post({ form: { command, ...form } });
  }

  /**
   * Get your open orders for a given market.
   */
  getOpenOrders({
    currencyPair = this.currencyPair
  }: CurrencyPair = {}): Promise<Orders> {
    return this.post({ form: { command: "returnOpenOrders", currencyPair } });
  }

  /**
   * Get your trade history for a given market.
   */
  getHistoryTrades({
    currencyPair = this.currencyPair,
    ...form
  }: HistoryTradesFilter = {}): Promise<TradesPrivate> {
    const command = "returnTradeHistory";
    return this.post({ form: { command, currencyPair, ...form } });
  }

  /**
   * Get all trades involving a given order.
   */
  getOrderTrades(form: OrderFilter): Promise<OrderTrade[]> {
    return this.post({ form: { command: "returnOrderTrades", ...form } });
  }

  /**
   * Get the status of a given order.
   */
  getOrderStatus(form: OrderFilter): Promise<OrderStatus> {
    return this.post({ form: { command: "returnOrderStatus", ...form } });
  }

  /**
   * Places a limit buy order.
   */
  buy({
    currencyPair = this.currencyPair,
    ...form
  }: OrderOptions): Promise<OrderResult> {
    return this.post({ form: { command: "buy", currencyPair, ...form } });
  }

  /**
   * Places a limit sell order.
   */
  sell({
    currencyPair = this.currencyPair,
    ...form
  }: OrderOptions): Promise<OrderResult> {
    return this.post({ form: { command: "sell", currencyPair, ...form } });
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
