const EventEmitter = require("events");
const CURRENCIES = require("./currencies.json");
const CURRENCYPAIRS = require("./currencypairs.json");

class WebsocketClient extends EventEmitter {
  static formatTicker([
    id,
    last,
    lowestAsk,
    highestBid,
    percentChange,
    baseVolume,
    quoteVolume,
    isFrozen,
    high24hr,
    low24hr
  ]) {
    return {
      id,
      currencyPair: CURRENCYPAIRS[id],
      last,
      lowestAsk,
      highestBid,
      percentChange,
      baseVolume,
      quoteVolume,
      isFrozen,
      high24hr,
      low24hr
    };
  }

  static formatVolume([time, users, volume]) {
    return { time, users, volume };
  }

  static formatUpdate(update) {
    const [id] = update;
    if (id === "o") {
      const [, type, price, size] = update;
      return {
        subject: "update",
        type: type ? "buy" : "sell",
        price,
        size
      };
    } else if (id === "i") {
      const [, book] = update;
      const [asks, bids] = book.orderBook;
      return {
        subject: "snapshot",
        currencyPair: book.currencyPair,
        asks,
        bids
      };
    } else if (id === "t") {
      const [, tradeID, type, price, size, timestamp] = update;
      return {
        subject: "publicTrade",
        tradeID,
        type: type ? "buy" : "sell",
        price,
        size,
        timestamp
      };
    }
  }

  static formatAccount(update) {
    const [type] = update;
    if (type === "b") {
      const [, id, wallet, amount] = update;
      return {
        subject: "balance",
        currencyId: id,
        currency: CURRENCIES[id],
        wallet,
        amount
      };
    } else if (type === "n") {
      const [
        ,
        id,
        orderNumber,
        orderType,
        rate,
        amount,
        date,
        originalAmount,
        clientOrderId
      ] = update;
      return {
        subject: "new",
        id,
        currencyPair: CURRENCYPAIRS[id],
        orderNumber,
        type: orderType ? "buy" : "sell",
        rate,
        amount,
        date,
        originalAmount,
        clientOrderId
      };
    } else if (type === "o") {
      const [, orderNumber, newAmount, orderType, clientOrderId] = update;
      return {
        subject: "order",
        orderNumber,
        newAmount,
        orderType:
          orderType === "f"
            ? "filled"
            : orderType === "c"
            ? "canceled"
            : "self-trade",
        clientOrderId
      };
    } else if (type === "p") {
      const [
        ,
        orderNumber,
        id,
        rate,
        amount,
        orderType,
        clientOrderId
      ] = update;
      return {
        subject: "pending",
        orderNumber,
        currencyPair: CURRENCYPAIRS[id],
        rate,
        amount,
        type: orderType ? "buy" : "sell",
        clientOrderId
      };
    } else if (type === "t") {
      const [
        ,
        tradeID,
        rate,
        amount,
        feeMultiplier,
        fundingType,
        orderNumber,
        fee,
        date,
        clientOrderId
      ] = update;
      return {
        subject: "trade",
        tradeID,
        rate,
        amount,
        feeMultiplier,
        fundingType,
        orderNumber,
        fee,
        date,
        clientOrderId
      };
    } else if (type === "k") {
      const [, orderNumber, clientOrderId] = update;
      return { subject: "killed", orderNumber, clientOrderId };
    }
  }

  /**
   * @private
   * @fires WebsocketClient#message
   * @fires WebsocketClient#raw
   */
  onMessage(data) {
    const jsondata = JSON.parse(data);

    if (this.raw) {
      this.emit("raw", jsondata);
    }

    if (jsondata.error) {
      return this.onError(jsondata);
    }

    const [channel_id, sequence, update] = jsondata;
    const message = { channel_id, sequence };

    if (channel_id === 1010) {
      message.subject = "heartbeat";
    } else if (!update) {
      message.subject = sequence ? "subscribed" : "unsubscribed";
    } else if (channel_id === 1002) {
      message.subject = "ticker";
      Object.assign(message, WebsocketClient.formatTicker(update));
    } else if (channel_id === 1003) {
      message.subject = "volume";
      Object.assign(message, WebsocketClient.formatVolume(update));
    } else {
      for (const u of update) {
        this.emit(
          "message",
          Object.assign(
            channel_id === 1000
              ? WebsocketClient.formatAccount(u)
              : WebsocketClient.formatUpdate(u),
            message
          )
        );
      }
      return;
    }

    this.emit("message", message);
  }
}

module.exports = WebsocketClient;
