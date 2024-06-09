import * as immer from 'use-immer';
import constant from "@/utils/const";
import notice from "@/stores/popup/notice";

export const temp: {
  setState: immer.Updater<typeof notice.state>;
  timeoutId: number;
  callback: () => void;
} = {
  setState: () => {},
  timeoutId: 0,
  callback: () => ``,
};

export const state: {
  open: boolean;
  message: string;
  button: string;
} = constant.init.notice;

export const handle = {
  open: (arg: {
    message: typeof state.message;
    button: typeof state.button;
    callback: typeof temp.callback;
  }): void => {
    notice.temp.setState((state) => {
      state.open = true;
      state.message = arg.message;
      state.button = arg.button;
    });
    notice.temp.callback = arg.callback;
    clearTimeout(notice.temp.timeoutId);
    notice.temp.timeoutId = setTimeout(() => {
      notice.handle.close();
    }, 3000) as unknown as number;
  },
  close: (): void => {
    notice.temp.setState((state) => {
      state.open = false;
    });
  },
};

export default { temp, state, handle };
