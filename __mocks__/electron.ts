interface TestIpcRendererEvent {
  preventDefault: () => void;
  sender: TestIpcRenderer;
  senderId: number;
}
interface TestChannels {
  [name: string]: TestIpcRendererEventListener[];
}

type TestIpcRendererEventListener = (
  event: TestIpcRendererEvent,
  ...args: any[]
) => void;

class TestIpcRenderer {
  _channels: TestChannels;

  constructor() {
    this._channels = {};
  }

  invoke: never;

  on(channel: string, listener: TestIpcRendererEventListener) {
    const _channel = this._channels[channel];

    if (!_channel) {
      this._channels[channel] = [listener];
    } else {
      _channel.push(listener);
    }
  }

  once: never;

  removeListener(channel: string, listener) {
    const _channel = this._channels[channel];
    if (!_channel) return;

    _channel.splice(_channel.findIndex(listener), 1);
  }

  removeAllListeners(channel: string) {
    const _channel = this._channels[channel];
    if (!channel) return;

    while (_channel.length > 0) {
      _channel.pop();
    }
  }

  send(channel: string, ...args: any[]) {}

  _simulate(channel: string, ...args: any[]) {
    const event: TestIpcRendererEvent = {
      preventDefault: () => {},
      sender: this,
      senderId: 0,
    };
    this._channels[channel]?.forEach((listener) => listener(event, ...args));
  }

  sendSync: never;
  sendTo: never;
  sendToHost: never;
}

export const ipcRenderer = new TestIpcRenderer();
