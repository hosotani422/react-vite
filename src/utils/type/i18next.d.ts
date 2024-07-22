import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: `ja`;
    resources: {
      ja: Locale;
      en: Locale;
    };
  }
}

type Locale = {
  button: {
    cancel: string;
    clear: string;
    ok: string;
  };
  placeholder: {
    list: string;
    main: string;
    sub: string;
    memo: string;
    date: string;
    time: string;
    alarm: string;
  };
  validation: {
    empty: string;
  };
  conf: {
    title: string;
    size: {
      title: string;
      value: { [L in `1` | `2` | `3`]: string };
    };
    speed: {
      title: string;
      value: { [L in `1` | `2` | `3`]: string };
    };
    vibrate: {
      title: string;
      value: { [L in `off` | `on`]: string };
    };
    theme: {
      title: string;
      value: { [L in `light` | `dark`]: string };
    };
    lang: {
      title: string;
      value: { [L in `en` | `ja`]: string };
    };
    save: {
      title: string;
      value: { [L in `local` | `rest` | `gql`]: string };
    };
    backup: {
      title: string;
      download: string;
      upload: string;
    };
    reset: {
      title: string;
      conf: string;
      list: string;
    };
  };
  calendar: {
    sort: string[];
    data: { [K in string]: string };
  };
  dialog: {
    title: {
      entry: string;
      move: string;
      delete: string;
      reset: string;
      alarm: string;
      error: string;
    };
    select: {
      all: string;
      none: string;
    };
    alarm: {
      sort: string[];
      data: { [K in string]: { label: string; value: number } };
    };
  };
  notice: {
    message: string;
    button: string;
  };
};
