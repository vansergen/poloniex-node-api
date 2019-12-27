declare module "poloniex-node-api" {
  export namespace WebsocketMessage {
    type Message = {
      channel_id: string | number;
      sequence: number | null | "";
    };

    export type Balance = {
      subject: "balance";
      currencyId: number;
      currency: string | undefined;
      wallet: "e" | "m" | "l";
      amount: string;
    } & Message;

    export type New = {
      subject: "new";
      id: number;
      currencyPair: string | undefined;
      orderNumber: number;
      type: "buy" | "sell";
      rate: string;
      amount: string;
      date: string;
      originalAmount: string;
      clientOrderId: string | null;
    } & Message;

    export type WSOrder = {
      subject: "order";
      orderNumber: number;
      newAmount: string;
      orderType: "filled" | "canceled" | "self-trade";
      clientOrderId: string | null;
    } & Message;

    export type WSPending = {
      subject: "pending";
      orderNumber: number;
      currencyPair: string | undefined;
      rate: string;
      amount: string;
      type: "buy" | "sell";
      clientOrderId: string | null;
    } & Message;

    export type WSTrade = {
      subject: "trade";
      tradeID: number;
      rate: string;
      amount: string;
      feeMultiplier: string;
      fundingType: 0 | 1 | 2 | 3;
      orderNumber: number;
      fee: string;
      date: string;
      clientOrderId: string | null;
    } & Message;

    export type WSKill = {
      subject: "killed";
      orderNumber: number;
      clientOrderId: string | null;
    };
  }

  export type WebsocketMessage =
    | WebsocketMessage.Balance
    | WebsocketMessage.New
    | WebsocketMessage.WSOrder
    | WebsocketMessage.WSPending
    | WebsocketMessage.WSTrade
    | WebsocketMessage.WSKill;
}
