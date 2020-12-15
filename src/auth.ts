import {
  PublicClient,
  CurrencyFilter,
  TimeFilter,
  CurrencyPair,
  Side,
  TradesFilter,
  Trade,
  BaseTrade,
} from "./public";
import { SignRequest } from "./signer";

export interface AccountFilter {
  account?: string;
}

export interface HistoryTradesFilter extends TradesFilter {
  limit?: number;
}

export interface OrderFilter {
  orderNumber: number;
}

export interface OrderOptions extends CurrencyPair {
  rate: number;
  amount: number;
  fillOrKill?: 0 | 1;
  immediateOrCancel?: 0 | 1;
  postOnly?: 0 | 1;
  clientOrderId?: number;
}

export type ClientOrderFilter = OrderFilter | { clientOrderId: number };

export interface MoveOrderOptions extends OrderFilter {
  rate: number;
  amount?: number;
  postOnly?: 0 | 1;
  immediateOrCancel?: 0 | 1;
  clientOrderId?: number;
}

export interface WithdrawOptions {
  currency: string;
  amount: number;
  address: string;
  paymentId?: string | number;
  currencyToWithdrawAs?: string;
}

export interface TransferOptions {
  currency: string;
  amount: number;
  fromAccount: "exchange" | "margin" | "lending";
  toAccount: "exchange" | "margin" | "lending";
}

export interface MarginOrderOptions extends CurrencyPair {
  rate: number;
  amount: number;
  lendingRate?: number;
  clientOrderId?: number;
}

export interface OfferOptions {
  currency: string;
  amount: number;
  duration: number;
  autoRenew: 0 | 1;
  lendingRate: number;
}

export interface LendingHistoryOptions {
  start?: number;
  end?: number;
  limit?: number;
}

export interface Balances {
  [currency: string]: string;
}

export interface CompleteBalance {
  available: string;
  onOrders: string;
  btcValue: string;
}

export interface CompleteBalances {
  [currency: string]: CompleteBalance;
}

export interface Adresses {
  [currency: string]: string;
}

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
  paymentID: null | string;
  fiatAccountId?: null | string;
  scope?: null | string;
}

export interface Deposit {
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

export type Orders = { [currencyPair: string]: Order[] } | Order[];

export interface TradePrivate extends Trade {
  fee: string;
  category: "exchange" | "margin";
}

export type TradesPrivate =
  | { [currencyPair: string]: TradePrivate[] }
  | TradePrivate[];

export interface OrderTrade extends BaseTrade {
  globalTradeID: number;
  currencyPair: string;
  fee: string;
}

export interface OrderStatus {
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
}

export interface ResultingTrade extends BaseTrade {
  takerAdjustment?: string;
}

export interface OrderResult {
  orderNumber: string;
  resultingTrades: ResultingTrade[];
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
  resultingTrades: { [currencyPair: string]: ResultingTrade[] };
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

export interface TradableBalances {
  [currencyPair: string]: Balances;
}

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
  type: "long" | "short" | "none";
}

export type MarginPositionResult =
  | { [currencyPair: string]: MarginPosition }
  | MarginPosition;

export interface ClosePositionResult {
  success: 0 | 1;
  message: string;
  resultingTrades: { [currencyPair: string]: ResultingTrade[] };
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

export type LoanOffers = { [currency: string]: LoanOffer[] } | LoanOffer[];

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

  public async post(
    url?: string,
    { body = new URLSearchParams() }: { body?: URLSearchParams } = {}
  ): Promise<unknown> {
    const nonce = this.nonce();
    body.set("nonce", `${nonce}`);
    const { key, sign } = SignRequest({
      key: this.#key,
      secret: this.#secret,
      body: body.toString(),
    });
    const data = (await super.post(url, { headers: { key, sign }, body })) as {
      error?: string;
      success?: 0 | 1;
      result?: { error?: string };
      message?: string;
    };

    if (data.error) {
      throw new Error(data.error);
    } else if (data.success === 0) {
      throw new Error(data?.result?.error);
    }
    return data;
  }

  /**
   * Get all of your balances available for trade after having deducted all open orders.
   */
  public async getBalances(): Promise<Balances> {
    const command = "returnBalances";
    const body = new URLSearchParams({ command });
    const balances = (await this.post("/tradingApi", { body })) as Balances;
    return balances;
  }

  /**
   * Get all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance.
   */
  public async getCompleteBalances(
    form: AccountFilter = {}
  ): Promise<CompleteBalances> {
    const command = "returnCompleteBalances";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const balances = (await this.post("/tradingApi", {
      body,
    })) as CompleteBalances;
    return balances;
  }

  /**
   * Get all of your deposit addresses.
   */
  public async getDepositAddresses(): Promise<Adresses> {
    const command = "returnDepositAddresses";
    const body = new URLSearchParams({ command });
    const adresses = (await this.post("/tradingApi", { body })) as Adresses;
    return adresses;
  }

  /**
   * Generate a new deposit address.
   */
  public async getNewAddress(form: CurrencyFilter): Promise<NewAddress> {
    const command = "generateNewAddress";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const address = (await this.post("/tradingApi", {
      body,
    })) as NewAddress;
    return address;
  }

  /**
   * Get your adjustment, deposit, and withdrawal history within a range window.
   */
  public async getDepositsWithdrawals(
    form: TimeFilter
  ): Promise<DepositsWithdrawals> {
    const command = "returnDepositsWithdrawals";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const records = (await this.post("/tradingApi", {
      body,
    })) as DepositsWithdrawals;
    return records;
  }

  /**
   * Get your open orders for a given market.
   */
  public async getOpenOrders({
    currencyPair = this.currencyPair,
  }: CurrencyPair = {}): Promise<Orders> {
    const command = "returnOpenOrders";
    const body = new URLSearchParams({ command, currencyPair });
    const orders = (await this.post("/tradingApi", { body })) as Orders;
    return orders;
  }

  /**
   * Get your trade history for a given market.
   */
  public async getHistoryTrades({
    currencyPair = this.currencyPair,
    ...form
  }: HistoryTradesFilter = {}): Promise<TradesPrivate> {
    const command = "returnTradeHistory";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const trades = (await this.post("/tradingApi", {
      body,
    })) as TradesPrivate;
    return trades;
  }

  /**
   * Get all trades involving a given order.
   */
  public async getOrderTrades(form: OrderFilter): Promise<OrderTrade[]> {
    const command = "returnOrderTrades";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const trades = (await this.post("/tradingApi", {
      body,
    })) as OrderTrade[];
    return trades;
  }

  /**
   * Get the status of a given order.
   */
  public async getOrderStatus(form: OrderFilter): Promise<OrderStatus> {
    const command = "returnOrderStatus";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const order = (await this.post("/tradingApi", {
      body,
    })) as OrderStatus;
    return order;
  }

  /**
   * Places a limit buy order.
   */
  public async buy({
    currencyPair = this.currencyPair,
    ...form
  }: OrderOptions): Promise<OrderResult> {
    const command = "buy";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const order = (await this.post("/tradingApi", {
      body,
    })) as OrderResult;
    return order;
  }

  /**
   * Places a limit sell order.
   */
  public async sell({
    currencyPair = this.currencyPair,
    ...form
  }: OrderOptions): Promise<OrderResult> {
    const command = "sell";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const order = (await this.post("/tradingApi", {
      body,
    })) as OrderResult;
    return order;
  }

  /**
   * Cancel an order you have placed in a given market.
   */
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
    const response = (await this.post("/tradingApi", {
      body,
    })) as CancelResponse;
    return response;
  }

  /**
   * Cancel all open orders in a given market or, if no market is provided, all open orders in all markets.
   */
  public async cancelAllOrders(
    form: CurrencyPair = {}
  ): Promise<CancelAllResponse> {
    const command = "cancelAllOrders";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = (await this.post("/tradingApi", {
      body,
    })) as CancelAllResponse;
    return response;
  }

  /**
   * Cancels an order and places a new one of the same type in a single atomic transaction.
   */
  public async moveOrder(form: MoveOrderOptions): Promise<MoveResponse> {
    const command = "moveOrder";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = (await this.post("/tradingApi", {
      body,
    })) as MoveResponse;
    return response;
  }

  /**
   * Immediately place a withdrawal for a given currency.
   */
  public async withdraw(form: WithdrawOptions): Promise<WithdrawResponse> {
    const command = "withdraw";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = (await this.post("/tradingApi", {
      body,
    })) as WithdrawResponse;
    return response;
  }

  /**
   * Get your current trading fees and trailing 30-day volume in BTC.
   */
  public async getFeeInfo(): Promise<FeesInfo> {
    const command = "returnFeeInfo";
    const body = new URLSearchParams({ command });
    const info = (await this.post("/tradingApi", { body })) as FeesInfo;
    return info;
  }

  /**
   * Get your balances sorted by account.
   */
  public async getAccountBalances(
    form: AccountFilter = {}
  ): Promise<AccountBalances> {
    const command = "returnAvailableAccountBalances";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const balances = (await this.post("/tradingApi", {
      body,
    })) as AccountBalances;
    return balances;
  }

  /**
   * Get your current tradable balances for each currency in each market for which margin trading is enabled.
   */
  public async getTradableBalances(): Promise<TradableBalances> {
    const command = "returnTradableBalances";
    const body = new URLSearchParams({ command });
    const balances = (await this.post("/tradingApi", {
      body,
    })) as TradableBalances;
    return balances;
  }

  /**
   * Transfer funds from one account to another.
   */
  public async transferBalance(
    form: TransferOptions
  ): Promise<TransferResponse> {
    const command = "transferBalance";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = (await this.post("/tradingApi", {
      body,
    })) as TransferResponse;
    return response;
  }

  /**
   * Get a summary of your entire margin account.
   */
  public async getMarginSummary(): Promise<MarginSummary> {
    const command = "returnMarginAccountSummary";
    const body = new URLSearchParams({ command });
    const summary = (await this.post("/tradingApi", { body })) as MarginSummary;
    return summary;
  }

  /**
   * Place a margin buy order in a given market.
   */
  public async marginBuy({
    currencyPair = this.currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult> {
    const command = "marginBuy";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const result = (await this.post("/tradingApi", {
      body,
    })) as MarginOrderResult;
    return result;
  }

  /**
   * Place a margin sell order in a given market.
   */
  public async marginSell({
    currencyPair = this.currencyPair,
    ...form
  }: MarginOrderOptions): Promise<MarginOrderResult> {
    const command = "marginSell";
    const body = new URLSearchParams({ command, currencyPair });
    PublicClient.addOptions(body, { ...form });
    const result = (await this.post("/tradingApi", {
      body,
    })) as MarginOrderResult;
    return result;
  }

  /**
   * Get information about your margin position in a given market.
   */
  public async getMarginPosition({
    currencyPair = this.currencyPair,
  }: CurrencyPair = {}): Promise<MarginPositionResult> {
    const command = "getMarginPosition";
    const body = new URLSearchParams({ command, currencyPair });
    const result = (await this.post("/tradingApi", {
      body,
    })) as MarginPositionResult;
    return result;
  }

  /**
   * Close your margin position in a given market using a market order.
   */
  public async closeMarginPosition({
    currencyPair = this.currencyPair,
  }: CurrencyPair = {}): Promise<ClosePositionResult> {
    const command = "closeMarginPosition";
    const body = new URLSearchParams({ command, currencyPair });
    const result = (await this.post("/tradingApi", {
      body,
    })) as ClosePositionResult;
    return result;
  }

  /**
   * Create a loan offer for a given currency.
   */
  public async createLoanOffer(form: OfferOptions): Promise<OfferResult> {
    const command = "createLoanOffer";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const result = (await this.post("/tradingApi", {
      body,
    })) as OfferResult;
    return result;
  }

  /**
   * Cancel a loan offer.
   */
  public async cancelLoanOffer(form: OrderFilter): Promise<CancelLoanResponse> {
    const command = "cancelLoanOffer";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const response = (await this.post("/tradingApi", {
      body,
    })) as CancelLoanResponse;
    return response;
  }

  /**
   * Get your open loan offers for each currency.
   */
  public async getOpenLoanOffers(): Promise<LoanOffers> {
    const command = "returnOpenLoanOffers";
    const body = new URLSearchParams({ command });
    const offers = (await this.post("/tradingApi", {
      body,
    })) as LoanOffers;
    return offers;
  }

  /**
   * Get your active loans for each currency.
   */
  public async getActiveLoans(): Promise<ActiveLoans> {
    const command = "returnActiveLoans";
    const body = new URLSearchParams({ command });
    const loans = (await this.post("/tradingApi", {
      body,
    })) as ActiveLoans;
    return loans;
  }

  /**
   * Get your lending history.
   */
  public async getLendingHistory(
    form: LendingHistoryOptions = {}
  ): Promise<LendingHistoryItem[]> {
    const command = "returnLendingHistory";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const items = (await this.post("/tradingApi", {
      body,
    })) as LendingHistoryItem[];
    return items;
  }

  /**
   * Toggle the autoRenew setting on an active loan.
   */
  public async toggleAutoRenew(form: OrderFilter): Promise<AutoRenewResult> {
    const command = "toggleAutoRenew";
    const body = new URLSearchParams({ command });
    PublicClient.addOptions(body, { ...form });
    const result = (await this.post("/tradingApi", {
      body,
    })) as AutoRenewResult;
    return result;
  }

  public get nonce(): () => number {
    return this.#nonce;
  }

  public set nonce(nonce: () => number) {
    this.#nonce = nonce;
  }
}
