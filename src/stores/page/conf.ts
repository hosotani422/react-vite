import React from 'react';
import * as immer from 'use-immer';
import Util from "@/utils/base/util";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";

export const temp: {
  setState: immer.Updater<typeof conf.state>;
  swipe: {
    status?: `start` | `move` | `end`;
    elem?: HTMLElement;
    x?: number;
    y?: number;
    top?: number;
  };
} = {
  setState: () => {},
  swipe: {},
};

export const state: {
  data: {
    size: 1 | 2 | 3;
    speed: 1 | 2 | 3;
    theme: `light` | `dark`;
    lang: `ja` | `en`;
    vibrate: `on` | `off`;
    save: `local` | `rest` | `gql`;
  };
} = {
  data: constant.init.conf,
};

export const handle = {
  init: (): void => {
    conf.temp.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`conf`)!) || constant.init.conf;
    });
  },
  watch: (): void => {
    React.useEffect(() => {
      localStorage.setItem(`conf`, JSON.stringify(conf.state.data));
    }, [conf.state.data]);
    React.useEffect(() => {
      Util.getById(`AppRoot`).className = `theme-color-font ${app.render.getTheme()} ${app.render.getSize()} ${app.render.getSpeed()}`;
    }, [conf.state.data.theme, conf.state.data.size, conf.state.data.speed]);
    React.useEffect(() => {
      app.temp.i18next.i18n.changeLanguage(conf.state.data.lang);
    }, [conf.state.data.lang]);
  },
  inputValue: (arg: { type: string, value: string }): void => {
    conf.temp.setState((state) => {
      if (arg.type === `size`) {
        state.data[arg.type] = Number(arg.value) as typeof state.data.size;
      } else if (arg.type === `speed`) {
        state.data[arg.type] = Number(arg.value) as typeof state.data.speed;
      } else if (arg.type === `theme`) {
        state.data[arg.type] = arg.value as typeof state.data.theme;
      } else if (arg.type === `lang`) {
        state.data[arg.type] = arg.value as typeof state.data.lang;
      } else if (arg.type === `vibrate`) {
        state.data[arg.type] = arg.value as typeof state.data.vibrate;
      } else if (arg.type === `save`) {
        state.data[arg.type] = arg.value as typeof state.data.save;
      }
    });
  },
  downloadBackup: (arg: { listId: string, elem: HTMLElement }): void => {
    const fileName = constant.base.app.backup;
    const fileData =
      `${arg.listId}\n` +
      `${JSON.stringify(list.state.data)}\n` +
      `${JSON.stringify(main.state.data)}\n` +
      `${JSON.stringify(sub.state.data)}\n` +
      `${JSON.stringify(conf.state.data)}`;
    arg.elem.setAttribute(`download`, fileName);
    arg.elem.setAttribute(`href`, `data:text/plain,${encodeURIComponent(fileData)}`);
  },
  uploadBackup: (arg: { files: FileList }): void => {
    const reader = new FileReader();
    reader.addEventListener(`load`, (event: ProgressEvent<FileReader>) => {
      const files = typeof event.target?.result === `string` ? event.target.result.split(`\n`) : [];
      if (files.length === 5 && Util.isJson(files[1], files[2], files[3], files[4])) {
        list.temp.setState((state) => {
          state.data = JSON.parse(files[1]!);
        });
        main.temp.setState((state) => {
          state.data = JSON.parse(files[2]!);
        });
        sub.temp.setState((state) => {
          state.data = JSON.parse(files[3]!);
        });
        conf.temp.setState((state) => {
          state.data = JSON.parse(files[4]!);
        });
        app.handle.routerMain({listId: files[0]});
      } else {
        dialog.handle.open({
          mode: `alert`,
          title: app.temp.i18next.t(`dialog.title.error`),
          message: ``,
          cancel: app.temp.i18next.t(`button.ok`),
          callback: {
            cancel: () => {
              dialog.handle.close();
            },
          },
        });
      }
    });
    reader.readAsText(arg.files[0]!);
  },
  resetConf: (): void => {
    dialog.handle.open({
      mode: `confirm`,
      title: app.temp.i18next.t(`dialog.title.reset`),
      message: ``,
      ok: app.temp.i18next.t(`button.ok`),
      cancel: app.temp.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          conf.temp.setState((state) => {
            state.data = constant.init.conf;
          });
          dialog.handle.close();
        },
        cancel: () => {
          dialog.handle.close();
        },
      },
    });
  },
  resetList: (): void => {
    dialog.handle.open({
      mode: `confirm`,
      title: app.temp.i18next.t(`dialog.title.reset`),
      message: ``,
      ok: app.temp.i18next.t(`button.ok`),
      cancel: app.temp.i18next.t(`button.cancel`),
      callback: {
        ok: async () => {
          list.temp.setState((state) => {
            state.data = constant.init.list;
          });
          main.temp.setState((state) => {
            state.data = constant.init.main;
          });
          sub.temp.setState((state) => {
            state.data = constant.init.sub;
          });
          app.handle.routerMain({listId: constant.base.id.inbox});
          dialog.handle.close();
        },
        cancel: () => {
          dialog.handle.close();
        },
      },
    });
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!conf.temp.swipe.status) {
      conf.temp.swipe.status = `start`;
      conf.temp.swipe.elem = Util.getById<HTMLElement>(`ConfRoot`);
      conf.temp.swipe.x = arg.x;
      conf.temp.swipe.y = arg.y;
      conf.temp.swipe.top =
        conf.temp.swipe.elem.getBoundingClientRect().top + conf.temp.swipe.elem.getBoundingClientRect().height / 2;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (conf.temp.swipe.status === `start`) {
      if (Math.abs(arg.x - conf.temp.swipe.x!) + Math.abs(arg.y - conf.temp.swipe.y!) > 15) {
        if (Math.abs(arg.x - conf.temp.swipe.x!) < Math.abs(arg.y - conf.temp.swipe.y!)) {
          conf.temp.swipe.status = `move`;
        } else {
          conf.temp.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { y: number }): void => {
    if (conf.temp.swipe.status === `move`) {
      conf.temp.swipe.elem!.style.transform = `translateY(${Math.max(conf.temp.swipe.top! + arg.y - conf.temp.swipe.y!, 0)}px)`;
    }
  },
  swipeEnd: (arg: { y: number }): void => {
    if (conf.temp.swipe.status === `move`) {
      conf.temp.swipe.status = `end`;
      if (conf.temp.swipe.top! + arg.y - conf.temp.swipe.y! > 100) {
        app.handle.routerBack();
        conf.temp.swipe = {};
      } else {
        conf.temp.swipe
          .elem!.animate(
            { transform: `translateY(0px)` },
            { duration: app.render.getDuration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            conf.temp.swipe.elem!.removeEventListener(`finish`, listener);
            conf.temp.swipe.elem!.style.transform = `translateY(0px)`;
            conf.temp.swipe = {};
          });
      }
    } else {
      conf.temp.swipe = {};
    }
  },
};

export default { temp, state, handle };
