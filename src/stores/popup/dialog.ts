import * as immer from 'use-immer';
import Zod from "zod";
import i18next from "i18next";
import app from "@/stores/page/app";
import dialog from "@/stores/popup/dialog";

export const refer: {
  setState: immer.Updater<typeof dialog.state>;
  init: typeof dialog.state;
  callback: {
    ok?: () => void;
    cancel?: () => void;
  };
  schema: ReturnType<typeof Zod.string.prototype.refine>;
} = {
  setState: () => {},
  init: {
    open: false,
    init: true,
    mode: `alert`,
    title: ``,
    message: ``,
    text: {
      value: ``,
      placeholder: ``,
      error: ``,
    },
    check: {
      all: false,
      sort: [],
      data: {},
    },
    radio: {
      none: false,
      select: ``,
      sort: [],
      data: {},
    },
    ok: ``,
    cancel: ``,
  },
  callback: {
    ok: () => ``,
    cancel: () => ``,
  },
  schema: () => {
    return Zod.string().refine(
      (value) => {
        return value.trim().length > 0;
      },
      {
        message: i18next.t(`validation.empty`),
      },
    );
  },
};

export const state: {
  open: boolean;
  init: boolean;
  mode: `alert` | `confirm` | `text` | `check` | `radio`;
  title: string;
  message: string;
  text: {
    value: string;
    placeholder: string;
    error: string;
  };
  check: {
    all: boolean;
    sort: string[];
    data: {
      [K: string]: {
        check: boolean;
        title: string;
      };
    };
  };
  radio: {
    none: boolean;
    select: string;
    sort: string[];
    data: {
      [K: string]: {
        title: string;
      };
    };
  };
  ok?: string;
  cancel?: string;
} = refer.init;

export const render = {
  stateCheckAll: (): boolean => {
    return Object.values(dialog.state.check!.data).reduce((last, current) => last && current.check, true);
  },
};

export const handle = {
  setup: (): void => {
    [dialog.state, dialog.refer.setState] = immer.useImmer<typeof dialog.state>(dialog.state);
  },
  open: async (arg: {
    mode: typeof state.mode;
    title: typeof state.title;
    message: typeof state.message;
    text?: typeof state.text;
    check?: typeof state.check;
    radio?: typeof state.radio;
    ok?: typeof state.ok;
    cancel?: typeof state.cancel;
    callback?: typeof refer.callback;
  }): Promise<void> => {
    await dialog.refer.setState((state) => {
      state.init = true;
      state.open = true;
      state.mode = arg.mode;
      state.title = arg.title;
      state.message = arg.message;
      arg.text && (state.text = arg.text);
      arg.check && (state.check = arg.check);
      arg.radio && (state.radio = arg.radio);
      state.ok = arg.ok;
      state.cancel = arg.cancel;
    });
    dialog.refer.callback = arg.callback!;
    if (dialog.state.mode === `text`) {
      app.refer.getById<HTMLInputElement>(`DialogText`).focus();
    }
  },
  close: (): void => {
    dialog.refer.setState((state) => {
      state.open = false;
    });
  },
  errorValidation: (): string => {
    if (dialog.state.mode === `text`) {
      return refer.schema().safeParse(dialog.state.text!.value).error?.errors[0]?.message || ``;
    } else if (dialog.state.mode === `radio`) {
      return refer.schema().safeParse(dialog.state.radio!.select).error?.errors[0]?.message || ``;
    }
    return ``;
  },
  inputValue: (arg: { type: `text` | `check` | `radio`, id?: string, value: string | boolean }): void => {
    dialog.refer.setState((state) => {
      state.init = false;
      if (arg.type === `text`) {
        state[arg.type].value = arg.value as string;
      } else if (arg.type === `check`) {
        state[arg.type].data[arg.id!].check = arg.value as boolean;
      } else if (arg.type === `radio`) {
        state[arg.type].select = arg.value as string;
      }
    });
  },
  changeCheckAll: (arg: { value: boolean }): void => {
    dialog.refer.setState((state) => {
      Object.values(state.check.data).forEach((data) => (data.check = arg.value));
    });
  },
};

export default { refer, state, render, handle };
