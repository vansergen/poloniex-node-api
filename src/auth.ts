import {
  PublicClient,
  CurrencyFilter,
  TimeFilter,
  CurrencyPair,
  Side,
  TradesFilter,
  Trade,
  BaseTrade,
} from "./public.js";
import { SignRequest as signRequest } from "./signer.js";

export interface AccountFilter {
  account?: string | undefined;
}

export interface HistoryTradesFilter extends TradesFilter {
  limit?: number | undefined;
}

export interface OrderFilter {
  orderNumber: number;
}

export interface OrderOptions extends CurrencyPair {
  rate: number;
  amount: number;
  fillOrKill?: 0 | 1 | undefined;
  immediateOrCancel?: 0 | 1 | undefined;
  postOnly?: 0 | 1 | undefined;
  clientOrderId?: number | undefined;
}

export type ClientOrderFilter = OrderFilter | { clientOrderId: number };

export interface MoveOrderOptions extends OrderFilter {
  rate: number;
  amount?: number | undefined;
  postOnly?: 0 | 1 | undefined;
  immediateOrCancel?: 0 | 1 | undefined;
  clientOrderId?: number | undefined;
}

export interface WithdrawOptions {
  currency: string;
  amount: number;
  address: string;
  paymentId?: number | string | undefined;
}

export interface TransferOptions {
  currency: string;
  amount: number;
  fromAccount: "exchange" | "futures" | "lending" | "margin";
  toAccount: "exchange" | "futures" | "lending" | "margin";
}

export interface MarginOrderOptions extends CurrencyPair {
  rate: number;
  amount: number;
  lendingRate?: number | undefined;
  clientOrderId?: number | undefined;
}

export interface OfferOptions {
  currency: string;
  amount: number;
  duration: number;
  autoRenew: 0 | 1;
  lendingRate: number;
}

export interface LendingHistoryOptions {
  start?: number | undefined;
  end?: number | undefined;
  limit?: number | undefined;
}

export interface SwapCurrenciesOptions {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export type Balances = Record<string, string>;

export interface CompleteBalance {
  available: string;
  onOrders: string;
  btcValue: string;
}

export type CompleteBalances = Record<string, CompleteBalance>;

export type Adresses = Record<string, string>;

export interface NewAddress {
  success: 0 | 1;
  response: string;
}

export interface Adjustment {
  currency: string;
  amount: string;
  timestamp: number;
  status: string;
  category: "adjustment";
  adjustmentTitle: string;
  adjustmentDesc: string;
  adjustmentHelp: string;
}

export interface Withdrawal {
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
  paymentID: string | null;
  fiatAccountId?: string | null;
  scope?: string | null;
}

export interface Deposit {
  currency: string;
  address: string;
  amount: string;
  confirmations: number;
  txid: string;
  timestamp: number;
  status: "COMPLETE" | "PENDING";
  depositNumber: number;
  category: "deposit";
  fiatAccountId?: string | null;
  scope?: string | null;
}

export interface DepositsWithdrawals {
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  adjustments: Adjustment[];
}

export interface Order {
  type: Side;
  orderNumber: string;
  rate: string;
  startingAmount: string;
  amount: string;
  total: string;
  date: string;
  margin: 0 | 1;
  clientOrderId?: string;
}

export type Orders = Order[] | Record<string, Order[]>;

export interface TradePrivate extends Trade {
  fee: string;
  category: "exchange" | "margin";
}

export type TradesPrivate = Record<string, TradePrivate[]> | TradePrivate[];

export interface OrderTrade extends BaseTrade {
  globalTradeID: number;
  currencyPair: string;
  fee: string;
}

export interface OrderStatus {
  result: Record<
    string,
    {
      currencyPair: string;
      rate: string;
      amount: string;
      total: string;
      startingAmount: string;
      type: "buy" | "sell";
      status: "Open" | "Partially filled";
      date: string;
      fee?: string;
    }
  >;
  success: 0 | 1;
}

export interface ResultingTrade extends BaseTrade {
  takerAdjustment?: string;
}

export interface OrderResult {
  orderNumber: string;
  resultingTrades: ResultingTrade[];
  tokenFee: number;
  tokenFeeCurrency: string | null;
  fee: string;
  currencyPair: string;
  clientOrderId?: string;
}

export interface CancelResponse {
  success: 0 | 1;
  amount: string;
  message: string;
  fee?: string;
  clientOrderId?: string;
  currencyPair?: string;
}

export interface CancelAllResponse {
  success: 0 | 1;
  message: string;
  orderNumbers: number[];
}

export interface MoveResponse {
  success: 0 | 1;
  orderNumber: string;
  fee: string;
  currencyPair: string;
  resultingTrades: Record<string, ResultingTrade[]>;
  clientOrderId?: string;
}

export interface WithdrawResponse {
  response: string;
  email2FA?: boolean;
  withdrawalNumber?: number;
}

export interface FeesInfo {
  makerFee: string;
  takerFee: string;
  marginMakerFee?: string;
  marginTakerFee?: string;
  thirtyDayVolume: string;
  nextTier: number;
}

export interface AccountBalances {
  exchange?: Balances | [];
  margin?: Balances | [];
  lending?: Balances | [];
}

export type TradableBalances = Record<string, Balances>;

export interface TransferResponse {
  success: 0 | 1;
  message: string;
}

export interface MarginSummary {
  totalValue: string;
  pl: string;
  lendingFees: string;
  netValue: string;
  totalBorrowedValue: string;
  currentMargin: string;
}

export interface MarginOrderResult extends OrderResult {
  message: string;
}

export interface MarginPosition {
  amount: string;
  total: string;
  basePrice: string;
  liquidationPrice: number;
  pl: string;
  lendingFees: string;
  type: "long" | "none" | "short";
}

export type MarginPositionResult =
  | MarginPosition
  | Record<string, MarginPosition>;

export interface ClosePositionResult {
  success: 0 | 1;
  message: string;
  resultingTrades: Record<string, ResultingTrade[]>;
}

export interface OfferResult {
  success: 0 | 1;
  message: string;
  orderID?: number;
}

export interface CancelLoanResponse {
  success: 0 | 1;
  message: string;
  amount?: string;
}

export interface LoanOffer {
  id: number;
  rate: string;
  amount: string;
  duration: number;
  autoRenew: 0 | 1;
  date: string;
}

export type LoanOffers = LoanOffer[] | Record<string, LoanOffer[]>;

export interface ActiveLoan {
  id: number;
  currency: string;
  rate: string;
  amount: string;
  range: number;
  autoRenew?: 0 | 1;
  date: string;
  fees: string;
}

export interface ActiveLoans {
  provided: ActiveLoan[];
  used: ActiveLoan[];
}

export interface LendingHistoryItem {
  id: number;
  currency: string;
  rate: string;
  amount: string;
  duration: string;
  interest: string;
  fee: string;
  earned: string;
  open: string;
  close: string;
}

export interface AutoRenewResult {
  success: 0 | 1;
  message: string | 0 | 1;
}

export interface SwapResult {
  success: boolean;
  message: string;
}

export interface AuthenticatedClientOptions extends CurrencyPair {
  key: string;
  secret: string;
}

export class AuthenticatedClient extends PublicClient {
  readonly #key: string;
  readonly #secret: string;
  #nonce: () => number;

  public constructor({ key, secret, ...rest }: AuthenticatedClientOptions) {
    super(rest);
    this.#key = key;
    this.#secret = secret;
    this.#nonce = (): number => Date.now();
  }

  public async post<T = unknown>(
    url?: string,
    { body = new URLSearchParams() }: { body?: URLSearchParams } = {}
  ): Promise<T> {
    const nonce = this.nonce();
    body.set("nonce", `${nonce}`);
    const { key, sign } = signRequest({
      key: this.#key,
      secret: this.#secret,
      body: body.toString(),
    });
    const data = (await super.post(url, { headers: { key, sign }, body })) as {
      error?: string;
      success?: boolean | 0 | 1;
      result?: { error?: string };
      message?: string;
    };

    if (typeof data.error !== "undefined") {
      throw new Error(data.error);
    } else if (
      "success" in data &&
      data.success !== true &&
      data.success !== 1
    ) {
      throw new Error(data.result?.error ?? data.message);
    }

    return data as T;
  }

  /** Get all of your balances available for trade after having deducted all open orders. */
  public async getBalances(): Promise<Balances> {
    const command = "returnBalances";
    const body = new URLSearchParams({ command });
    const balances = await this.post<Balances>("/tradingApi", { body });
    return balances;
  }

  /** Get all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance. */
  public async getCompleteBalances(
    form: AccountFilter = {}
  ): Promise<CompleteBalances> {
    const command = "returnCompleteBalances";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const balances = await this.post<CompleteBalances>("/tradingApi", { body });
    return balances;
  }

  /** Get all of your deposit addresses. */
  public async getDepositAddresses(): Promise<Adresses> {
    const command = "returnDepositAddresses";
    const body = new URLSearchParams({ command });
    const adresses = await this.post<Adresses>("/tradingApi", { body });
    return adresses;
  }

  /** Generate a new deposit address. */
  public async getNewAddress(form: CurrencyFilter): Promise<NewAddress> {
    const command = "generateNewAddress";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const address = await this.post<NewAddress>("/tradingApi", { body });
    return address;
  }

  /** Get your adjustment, deposit, and withdrawal history within a range window. */
  public async getDepositsWithdrawals(
    form: TimeFilter
  ): Promise<DepositsWithdrawals> {
    const command = "returnDepositsWithdrawals";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const records = await this.post<DepositsWithdrawals>("/tradingApi", {
      body,
    });
    return records;
  }

  /** Get your open orders for a given market. */
  public async getOpenOrders({
    currencyPair = this.currencyPair,
  }: CurrencyPair = {}): Promise<Orders> {
    const command = "returnOpenOrders";
    const body = new URLSearchParams({ command, currencyPair });
    const orders = await this.post<Orders>("/tradingApi", { body });
    return orders;
  }

  /** Get your trade history for a given market. */
  public async getHistoryTrades({
    currencyPair = this.currencyPair,
    ...form
  }: HistoryTradesFilter = {}): Promise<TradesPrivate> {
    const command = "returnTradeHistory";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const trades = await this.post<TradesPrivate>("/tradingApi", { body });
    return trades;
  }

  /** Get all trades involving a given order. */
  public async getOrderTrades(form: OrderFilter): Promise<OrderTrade[]> {
    const command = "returnOrderTrades";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const trades = await this.post<OrderTrade[]>("/tradingApi", { body });
    return trades;
  }

  /** Get the status of a given order. */
  public async getOrderStatus(form: OrderFilter): Promise<OrderStatus> {
    const command = "returnOrderStatus";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const order = await this.post<OrderStatus>("/tradingApi", { body });
    return order;
  }

  /** Places a limit buy order. */
  public async buy({
    currencyPair = this.currencyPair,
    ...form
  }: OrderOptions): Promise<OrderResult> {
    const command = "buy";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const order = await this.post<OrderResult>("/tradingApi", { body });
    return order;
  }

  /** Places a limit sell order. */
  public async sell({
    currencyPair = this.currencyPair,
    ...form
  }: OrderOptions): Promise<OrderResult> {
    const command = "sell";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const order = await this.post<OrderResult>("/tradingApi", { body });
    return order;
  }

  /** Cancel an order you have placed in a given market. */
  public async cancelOrder(form: ClientOrderFilter): Promise<CancelResponse> {
    const command = "cancelOrder";
    const body = new URLSearchParams({ command });
    if ("clientOrderId" in form) {
      const { clientOrderId } = form;
      PublicClient.addOptions(body, { clientOrderId });
    } else {
      const { orderNumber } = form;
      PublicClient.addOptions(body, { orderNumber });
    }
    const response = await this.post<CancelResponse>("/tradingApi", { body });
    return response;
  }

  /** Cancel all open orders in a given market or, if no market is provided, all open orders in all markets. */
  public async cancelAllOrders(
    form: CurrencyPair = {}
  ): Promise<CancelAllResponse> {
    const command = "cancelAllOrders";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = await this.post<CancelAllResponse>("/tradingApi", {
      body,
    });
    return response;
  }

  /** Cancels an order and places a new one of the same type in a single atomic transaction. */
  public async moveOrder(form: MoveOrderOptions): Promise<MoveResponse> {
    const command = "moveOrder";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = await this.post<MoveResponse>("/tradingApi", { body });
    return response;
  }

  /** Immediately place a withdrawal for a given currency. */
  public async withdraw(form: WithdrawOptions): Promise<WithdrawResponse> {
    const command = "withdraw";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = await this.post<WithdrawResponse>("/tradingApi", { body });
    return response;
  }

  /** Get your current trading fees and trailing 30-day volume in BTC. */
  public async getFeeInfo(): Promise<FeesInfo> {
    const command = "returnFeeInfo";
    const body = new URLSearchParams({ command });
    const info = await this.post<FeesInfo>("/tradingApi", { body });
    return info;
  }

  /** Get your balances sorted by account. */
  public async getAccountBalances(
    form: AccountFilter = {}
  ): Promise<AccountBalances> {
    const command = "returnAvailableAccountBalances";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const balances = await this.post<AccountBalances>("/tradingApi", { body });
    return balances;
  }

  /** Get your current tradable balances for each currency in each market for which margin trading is enabled. */
  public async getTradableBalances(): Promise<TradableBalances> {
    const command = "returnTradableBalances";
    const body = new URLSearchParams({ command });
    const balances = await this.post<TradableBalances>("/tradingApi", { body });
    return balances;
  }

  /** Transfer funds from one account to another. */
  public async transferBalance(
    form: TransferOptions
  ): Promise<TransferResponse> {
    const command = "transferBalance";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = await this.post<TransferResponse>("/tradingApi", { body });
    return response;
  }

  /** Get a summary of your entire margin account. */
  public async getMarginSummary(): Promise<MarginSummary> {
    const command = "returnMarginAccountSummary";
    const body = new URLSearchParams({ command });
    const summary = await this.post<MarginSummary>("/tradingApi", { body });
    return summary;
  }

  /** Place a margin buy order in a given market. */
  public async marginBuy({
    currencyPair = this.currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult> {
    const command = "marginBuy";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const result = await this.post<MarginOrderResult>("/tradingApi", { body });
    return result;
  }

  /** Place a margin sell order in a given market. */
  public async marginSell({
    currencyPair = this.currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult> {
    const command = "marginSell";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const result = await this.post<MarginOrderResult>("/tradingApi", { body });
    return result;
  }

  /** Get information about your margin position in a given market. */
  public async getMarginPosition({
    currencyPair = this.currencyPair,
  }: CurrencyPair = {}): Promise<MarginPositionResult> {
    const command = "getMarginPosition";
    const body = new URLSearchParams({ command, currencyPair });
    const result = await this.post<MarginPositionResult>("/tradingApi", {
      body,
    });
    return result;
  }

  /** Close your margin position in a given market using a market order. */
  public async closeMarginPosition({
    currencyPair = this.currencyPair,
  }: CurrencyPair = {}): Promise<ClosePositionResult> {
    const command = "closeMarginPosition";
    const body = new URLSearchParams({ command, currencyPair });
    const result = await this.post<ClosePositionResult>("/tradingApi", {
      body,
    });
    return result;
  }

  /** Create a loan offer for a given currency. */
  public async createLoanOffer(form: OfferOptions): Promise<OfferResult> {
    const command = "createLoanOffer";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const result = await this.post<OfferResult>("/tradingApi", { body });
    return result;
  }

  /** Cancel a loan offer. */
  public async cancelLoanOffer(form: OrderFilter): Promise<CancelLoanResponse> {
    const command = "cancelLoanOffer";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = await this.post<CancelLoanResponse>("/tradingApi", {
      body,
    });
    return response;
  }

  /** Get your open loan offers for each currency. */
  public async getOpenLoanOffers(): Promise<LoanOffers> {
    const command = "returnOpenLoanOffers";
    const body = new URLSearchParams({ command });
    const offers = await this.post<LoanOffers>("/tradingApi", { body });
    return offers;
  }

  /** Get your active loans for each currency. */
  public async getActiveLoans(): Promise<ActiveLoans> {
    const command = "returnActiveLoans";
    const body = new URLSearchParams({ command });
    const loans = await this.post<ActiveLoans>("/tradingApi", { body });
    return loans;
  }

  /** Get your lending history. */
  public async getLendingHistory(
    form: LendingHistoryOptions = {}
  ): Promise<LendingHistoryItem[]> {
    const command = "returnLendingHistory";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const items = await this.post<LendingHistoryItem[]>("/tradingApi", {
      body,
    });
    return items;
  }

  /** Toggle the autoRenew setting on an active loan. */
  public async toggleAutoRenew(form: OrderFilter): Promise<AutoRenewResult> {
    const command = "toggleAutoRenew";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const result = await this.post<AutoRenewResult>("/tradingApi", { body });
    return result;
  }

  /** Swap `fromCurrency` to `toCurrency` if the currency pair is available. */
  public async swapCurrencies(
    form: SwapCurrenciesOptions
  ): Promise<SwapResult> {
    const command = "swapCurrencies";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const result = await this.post<SwapResult>("/tradingApi", { body });
    return result;
  }

  public get nonce(): () => number {
    return this.#nonce;
  }

  public set nonce(nonce: () => number) {
    this.#nonce = nonce;
  }
}
