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

export type ClientOrderFilter = OrderFilter | { clientOrderId: number };

export type MoveOrderOptions = OrderFilter & {
  rate: number;
  amount?: number;
  postOnly?: 0 | 1;
  immediateOrCancel?: 0 | 1;
  clientOrderId?: number;
};

export type WithdrawOptions = {
  currency: string;
  amount: number;
  address: string;
  paymentId?: string | number;
  currencyToWithdrawAs?: string;
};

export type TransferOptions = {
  currency: string;
  amount: number;
  fromAccount: "exchange" | "margin" | "lending";
  toAccount: "exchange" | "margin" | "lending";
};

export type MarginOrderOptions = CurrencyPair & {
  rate: number;
  amount: number;
  lendingRate?: number;
  clientOrderId?: number;
};

export type OfferOptions = {
  currency: string;
  amount: number;
  duration: number;
  autoRenew: 0 | 1;
  lendingRate: number;
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

export type ResultingTrade = BaseTrade & { takerAdjustment?: string };

export type OrderResult = {
  orderNumber: string;
  resultingTrades: ResultingTrade[];
  fee: string;
  currencyPair: string;
  clientOrderId?: string;
};

export type CancelResponse = {
  success: 0 | 1;
  amount: string;
  message: string;
  fee?: string;
  clientOrderId?: string;
  currencyPair?: string;
};

export type CancelAllResponse = {
  success: 0 | 1;
  message: string;
  orderNumbers: number[];
};

export type MoveResponse = {
  success: 0 | 1;
  orderNumber: string;
  fee: string;
  currencyPair: string;
  resultingTrades: { [currencyPair: string]: ResultingTrade[] };
  clientOrderId?: string;
};

export type WithdrawResponse = {
  response: string;
  email2FA?: boolean;
  withdrawalNumber?: number;
};

export type FeesInfo = {
  makerFee: string;
  takerFee: string;
  marginMakerFee?: string;
  marginTakerFee?: string;
  thirtyDayVolume: string;
  nextTier: number;
};

export type AccountBalances = {
  exchange?: Balances | [];
  margin?: Balances | [];
  lending?: Balances | [];
};

export type TradableBalances = { [currencyPair: string]: Balances };

export type TransferResponse = { success: 0 | 1; message: string };

export type MarginSummary = {
  totalValue: string;
  pl: string;
  lendingFees: string;
  netValue: string;
  totalBorrowedValue: string;
  currentMargin: string;
};

export type MarginOrderResult = OrderResult & { message: string };

export type MarginPosition = {
  amount: string;
  total: string;
  basePrice: string;
  liquidationPrice: number;
  pl: string;
  lendingFees: string;
  type: "long" | "short" | "none";
};

export type MarginPositionResult =
  | { [currencyPair: string]: MarginPosition }
  | MarginPosition;

export type ClosePositionResult = {
  success: 0 | 1;
  message: string;
  resultingTrades: { [currencyPair: string]: ResultingTrade[] };
};

export type OfferResult = { success: 0 | 1; message: string; orderID?: number };

export type CancelLoanResponse = {
  success: 0 | 1;
  message: string;
  amount?: string;
};

export type LoanOffer = {
  id: number;
  rate: string;
  amount: string;
  duration: number;
  autoRenew: 0 | 1;
  date: string;
};

export type LoanOffers = { [currency: string]: LoanOffer[] } | LoanOffer[];

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

  /**
   * Cancel an order you have placed in a given market.
   */
  cancelOrder(form: ClientOrderFilter): Promise<CancelResponse> {
    if ("clientOrderId" in form) {
      const { clientOrderId } = form;
      return this.post({ form: { command: "cancelOrder", clientOrderId } });
    } else if ("orderNumber" in form) {
      const { orderNumber } = form;
      return this.post({ form: { command: "cancelOrder", orderNumber } });
    }
    throw new Error("`orderNumber` or `clientOrderId` is missing");
  }

  /**
   * Cancel all open orders in a given market or, if no market is provided, all open orders in all markets.
   */
  cancelAllOrders(form: CurrencyPair = {}): Promise<CancelAllResponse> {
    return this.post({ form: { command: "cancelAllOrders", ...form } });
  }

  /**
   * Cancels an order and places a new one of the same type in a single atomic transaction.
   */
  moveOrder(form: MoveOrderOptions): Promise<MoveResponse> {
    return this.post({ form: { command: "moveOrder", ...form } });
  }

  /**
   * Immediately place a withdrawal for a given currency.
   */
  withdraw(form: WithdrawOptions): Promise<WithdrawResponse> {
    return this.post({ form: { command: "withdraw", ...form } });
  }

  /**
   * Get your current trading fees and trailing 30-day volume in BTC.
   */
  getFeeInfo(): Promise<FeesInfo> {
    return this.post({ form: { command: "returnFeeInfo" } });
  }

  /**
   * Get your balances sorted by account.
   */
  getAccountBalances(form: AccountFilter = {}): Promise<AccountBalances> {
    const command = "returnAvailableAccountBalances";
    return this.post({ form: { command, ...form } });
  }

  /**
   * Get your current tradable balances for each currency in each market for which margin trading is enabled.
   */
  getTradableBalances(): Promise<TradableBalances> {
    return this.post({ form: { command: "returnTradableBalances" } });
  }

  /**
   * Transfer funds from one account to another.
   */
  transferBalance(form: TransferOptions): Promise<TransferResponse> {
    return this.post({ form: { command: "transferBalance", ...form } });
  }

  /**
   * Get a summary of your entire margin account.
   */
  getMarginSummary(): Promise<MarginSummary> {
    return this.post({ form: { command: "returnMarginAccountSummary" } });
  }

  /**
   * Place a margin buy order in a given market.
   */
  marginBuy({
    currencyPair = this.currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult> {
    const command = "marginBuy";
    return this.post({ form: { command, currencyPair, ...form } });
  }

  /**
   * Place a margin sell order in a given market.
   */
  marginSell({
    currencyPair = this.currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult> {
    const command = "marginSell";
    return this.post({ form: { command, currencyPair, ...form } });
  }

  /**
   * Get information about your margin position in a given market.
   */
  getMarginPosition({
    currencyPair = this.currencyPair
  }: CurrencyPair = {}): Promise<MarginPositionResult> {
    return this.post({ form: { command: "getMarginPosition", currencyPair } });
  }

  /**
   * Close your margin position in a given market using a market order.
   */
  closeMarginPosition({
    currencyPair = this.currencyPair
  }: CurrencyPair = {}): Promise<ClosePositionResult> {
    const command = "closeMarginPosition";
    return this.post({ form: { command, currencyPair } });
  }

  /**
   * Create a loan offer for a given currency.
   */
  createLoanOffer(form: OfferOptions): Promise<OfferResult> {
    return this.post({ form: { command: "createLoanOffer", ...form } });
  }

  /**
   * Cancel a loan offer.
   */
  cancelLoanOffer(form: OrderFilter): Promise<CancelLoanResponse> {
    return this.post({ form: { command: "cancelLoanOffer", ...form } });
  }

  /**
   * Get your open loan offers for each currency.
   */
  getOpenLoanOffers(): Promise<LoanOffers> {
    return this.post({ form: { command: "returnOpenLoanOffers" } });
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
