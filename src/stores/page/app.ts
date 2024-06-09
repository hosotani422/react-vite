import * as ReactRouter from 'react-router-dom';
import * as reactI18next from "react-i18next";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

export const refer: {
  init: boolean;
  constant: {
    id: {[K in `inbox` | `trash` | `main` | `sub`]: string};
    app: {[K in `name` | `version` | `backup`]: string};
  };
  navigate: any;
  params: any;
  i18next: any;
  sleep: (ms: number) => Promise<unknown>;
  getById: <T extends Element>(id: string) => T;
  getByIdAll: <T extends Element>(id: string) => T[];
  isJson: (...itemList: unknown[]) => boolean;
  listener: () => void;
  duration: () => number;
  downloadFile: (arg: { name: string; data: string }) => void;
} = {
  init: true,
  constant: {
    id: {
      inbox: `list0000000000000`,
      trash: `list9999999999999`,
      main: `main0000000000000`,
      sub: `sub0000000000000`,
    },
    app: {
      name: `Memosuku`,
      version: `1.0.0`,
      backup: `memosuku.bak`,
    },
  },
  navigate: {},
  params: {},
  i18next: {},
  sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
  getById: <T extends Element>(id: string): T => {
    return document.querySelector(`[data-id='${id}']`) as T;
  },
  getByIdAll: <T extends Element>(id: string): T[] => {
    return document.querySelectorAll(`[data-id='${id}']`) as unknown as T[];
  },
  isJson: (...itemList: unknown[]): boolean => {
    try {
      for (const item of itemList) {
        if (typeof item === `string`) {
          JSON.parse(item);
        } else {
          return false;
        }
      }
    } catch {
      return false;
    }
    return true;
  },
  listener: () => {
    let timeoutId = 0;
    document.addEventListener(`mousedown`, (event: Event): void => {
      timeoutId = setTimeout(() => {
        event.target?.dispatchEvent(new CustomEvent(`longclick`, { bubbles: true, detail: event }));
        clearTimeout(timeoutId);
      }, 500) as unknown as number;
    });
    document.addEventListener(`mousemove`, (): void => clearTimeout(timeoutId));
    document.addEventListener(`mouseup`, (): void => clearTimeout(timeoutId));
    document.addEventListener(`touchstart`, (event: Event): void => {
      timeoutId = setTimeout(() => {
        event.target?.dispatchEvent(new CustomEvent(`longtouch`, { bubbles: true, detail: event }));
        clearTimeout(timeoutId);
      }, 500) as unknown as number;
    });
    document.addEventListener(`touchmove`, (): void => clearTimeout(timeoutId));
    document.addEventListener(`touchend`, (): void => clearTimeout(timeoutId));
  },
  duration: (): number => {
    if (conf.state.data.speed === 1) {
      return 500;
    } else if (conf.state.data.speed === 3) {
      return 100;
    }
    return 250;
  },
  downloadFile: (arg: { name: string; data: string }): void => {
    const elem = document.createElement(`a`);
    elem.setAttribute(`download`, arg.name);
    elem.setAttribute(`href`, `data:text/plain,${encodeURIComponent(arg.data)}`);
    document.getElementsByTagName(`body`)[0]?.appendChild(elem);
    elem.dispatchEvent(new PointerEvent(`click`));
    elem.remove();
  },
};

export const render = {
  getTheme: (): string => {
    return conf.state.data.theme;
  },
  getSize: (): string => {
    if (conf.state.data.size === 1) {
      return `text-sm`;
    } else if (conf.state.data.size === 3) {
      return `text-lg`;
    }
    return `text-base`;
  },
  getSpeed: (): string => {
    if (conf.state.data.speed === 1) {
      return `slow`;
    } else if (conf.state.data.speed === 3) {
      return `fast`;
    }
    return `just`;
  },
};

export const handle = {
  setup: (): void => {
    list.handle.setup();
    main.handle.setup();
    sub.handle.setup();
    conf.handle.setup();
    calendar.handle.setup();
    clock.handle.setup();
    dialog.handle.setup();
    notice.handle.setup();
    app.refer.navigate = ReactRouter.useNavigate();
    app.refer.i18next = reactI18next.useTranslation();
  },
  init: async (): Promise<void> => {
    if (app.refer.init) {
      app.refer.init = false;
      app.refer.listener();
      await Promise.all([
        list.handle.init(),
        main.handle.init(),
        sub.handle.init(),
        conf.handle.init(),
      ]);
      handle.clearTrash();
    }
  },
  routerList: (): void => {
    app.refer.navigate(`/${app.refer.params.listId}/list`);
  },
  routerMain: (arg: { listId: string }): void => {
    app.refer.navigate(`/${arg.listId}`);
  },
  routerSub: (arg: { mainId: string }): void => {
    app.refer.navigate(`/${app.refer.params.listId}/sub/${arg.mainId}`);
  },
  routerConf: (): void => {
    app.refer.navigate(`/${app.refer.params.listId}/conf`);
  },
  routerBack: (): void => {
    app.refer.navigate(-1);
  },
  clearTrash: (): void => {
    const trashId = app.refer.constant.id.trash;
    main.refer.setState((state) => {
      state.data[trashId] = { sort: [], data: {} };
    });
    sub.refer.setState((state) => {
      state.data[trashId] = { data: {} };
    });
  },
};

export default { refer, render, handle };
