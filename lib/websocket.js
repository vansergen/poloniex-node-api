const EventEmitter = require("events");

class WebsocketClient extends EventEmitter {
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
