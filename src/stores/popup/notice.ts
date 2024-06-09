import * as immer from 'use-immer';
import notice from "@/stores/popup/notice";

export const refer: {
  setState: immer.Updater<typeof notice.state>;
  init: typeof notice.state;
  timeoutId: number;
  callback: () => void;
} = {
  setState: () => {},
  init: {
    open: false,
    message: ``,
    button: ``,
  },
  timeoutId: 0,
  callback: () => ``,
};

export const state: {
  open: boolean;
  message: string;
  button: string;
} = refer.init;

export const handle = {
  setup: (): void => {
    [notice.state, notice.refer.setState] = immer.useImmer<typeof notice.state>(notice.state);
  },
  open: (arg: {
    message: typeof state.message;
    button: typeof state.button;
    callback: typeof refer.callback;
  }): void => {
    notice.refer.setState((state) => {
      state.open = true;
      state.message = arg.message;
      state.button = arg.button;
    });
    notice.refer.callback = arg.callback;
    clearTimeout(notice.refer.timeoutId);
    notice.refer.timeoutId = setTimeout(() => {
      notice.handle.close();
    }, 3000) as unknown as number;
  },
  close: (): void => {
    notice.refer.setState((state) => {
      state.open = false;
    });
  },
};

export default { refer, state, handle };
