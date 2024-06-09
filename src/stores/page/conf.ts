import React from 'react';
import * as immer from 'use-immer';
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";

export const refer: {
  setState: immer.Updater<typeof conf.state>;
  init: typeof conf.state.data;
  swipe: {
    status?: `start` | `move` | `end`;
    elem?: HTMLElement;
    x?: number;
    y?: number;
    top?: number;
  };
} = {
  setState: () => {},
  init: {
    size: 2,
    speed: 2,
    theme: `light`,
    lang: `ja`,
    vibrate: `on`,
    save: `local`,
  },
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
  data: refer.init,
};

export const handle = {
  setup: (): void => {
    [conf.state, conf.refer.setState] = immer.useImmer<typeof conf.state>(conf.state);
    React.useEffect(() => {
      localStorage.setItem(`conf`, JSON.stringify(conf.state.data));
    }, [conf.state.data]);
    React.useEffect(() => {
      app.refer.getById(`AppRoot`).className = `theme-color-font ${app.render.getTheme()} ${app.render.getSize()} ${app.render.getSpeed()}`;
    }, [conf.state.data.theme, conf.state.data.size, conf.state.data.speed]);
    React.useEffect(() => {
      app.refer.i18next.i18n.changeLanguage(conf.state.data.lang);
    }, [conf.state.data.lang]);
  },
  init: async (): Promise<void> => {
    await conf.refer.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`conf`)!) || conf.refer.init;
    });
  },
  inputValue: (arg: { type: string, value: string }): void => {
    conf.refer.setState((state) => {
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
  downloadBackup: (): void => {
    app.refer.downloadFile({
      name: app.refer.constant.app.backup,
      data:
        `${app.refer.params.listId}\n` +
        `${JSON.stringify(list.state.data)}\n` +
        `${JSON.stringify(main.state.data)}\n` +
        `${JSON.stringify(sub.state.data)}\n` +
        `${JSON.stringify(conf.state.data)}`
    });
  },
  uploadBackup: (arg: { files: FileList }): void => {
    const reader = new FileReader();
    reader.addEventListener(`load`, (event: ProgressEvent<FileReader>) => {
      const files = typeof event.target?.result === `string` ? event.target.result.split(`\n`) : [];
      if (files.length === 5 && app.refer.isJson(files[1], files[2], files[3], files[4])) {
        list.refer.setState((state) => {
          state.data = JSON.parse(files[1]!);
        });
        main.refer.setState((state) => {
          state.data = JSON.parse(files[2]!);
        });
        sub.refer.setState((state) => {
          state.data = JSON.parse(files[3]!);
        });
        conf.refer.setState((state) => {
          state.data = JSON.parse(files[4]!);
        });
        app.handle.routerMain({listId: files[0]});
      } else {
        dialog.handle.open({
          mode: `alert`,
          title: app.refer.i18next.t(`dialog.title.error`),
          message: ``,
          cancel: app.refer.i18next.t(`button.ok`),
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
      title: app.refer.i18next.t(`dialog.title.reset`),
      message: ``,
      ok: app.refer.i18next.t(`button.ok`),
      cancel: app.refer.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          conf.refer.setState((state) => {
            state.data = conf.refer.init;
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
      title: app.refer.i18next.t(`dialog.title.reset`),
      message: ``,
      ok: app.refer.i18next.t(`button.ok`),
      cancel: app.refer.i18next.t(`button.cancel`),
      callback: {
        ok: async () => {
          list.refer.setState((state) => {
            state.data = list.refer.init;
          });
          main.refer.setState((state) => {
            state.data = main.refer.init;
          });
          sub.refer.setState((state) => {
            state.data = sub.refer.init;
          });
          app.handle.routerMain({listId: app.refer.constant.id.inbox});
          dialog.handle.close();
        },
        cancel: () => {
          dialog.handle.close();
        },
      },
    });
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!conf.refer.swipe.status) {
      conf.refer.swipe.status = `start`;
      conf.refer.swipe.elem = app.refer.getById<HTMLElement>(`ConfRoot`);
      conf.refer.swipe.x = arg.x;
      conf.refer.swipe.y = arg.y;
      conf.refer.swipe.top =
        conf.refer.swipe.elem.getBoundingClientRect().top + conf.refer.swipe.elem.getBoundingClientRect().height / 2;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (conf.refer.swipe.status === `start`) {
      if (Math.abs(arg.x - conf.refer.swipe.x!) + Math.abs(arg.y - conf.refer.swipe.y!) > 15) {
        if (Math.abs(arg.x - conf.refer.swipe.x!) < Math.abs(arg.y - conf.refer.swipe.y!)) {
          conf.refer.swipe.status = `move`;
        } else {
          conf.refer.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { y: number }): void => {
    if (conf.refer.swipe.status === `move`) {
      conf.refer.swipe.elem!.style.transform = `translateY(${Math.max(conf.refer.swipe.top! + arg.y - conf.refer.swipe.y!, 0)}px)`;
    }
  },
  swipeEnd: (arg: { y: number }): void => {
    if (conf.refer.swipe.status === `move`) {
      conf.refer.swipe.status = `end`;
      if (conf.refer.swipe.top! + arg.y - conf.refer.swipe.y! > 100) {
        app.handle.routerBack();
        conf.refer.swipe = {};
      } else {
        conf.refer.swipe
          .elem!.animate(
            { transform: `translateY(0px)` },
            { duration: app.refer.duration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            conf.refer.swipe.elem!.removeEventListener(`finish`, listener);
            conf.refer.swipe.elem!.style.transform = `translateY(0px)`;
            conf.refer.swipe = {};
          });
      }
    } else {
      conf.refer.swipe = {};
    }
  },
};

export default { refer, state, handle };
