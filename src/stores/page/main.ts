import React from 'react';
import * as immer from 'use-immer';
import * as datefns from "date-fns";
import lodash from 'lodash';
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

export const refer: {
  setState: immer.Updater<typeof main.state>;
  init: typeof main.state.data;
  drag: {
    status?: `start` | `move` | `end`;
    id?: string;
    y?: number;
    top?: number;
    left?: number;
    height?: number;
    width?: number;
    clone?: HTMLElement;
  };
} = {
  setState: () => {},
  init: {
    list0000000000000: {
      sort: [`main0000000000000`],
      data: { main0000000000000: { check: false, title: `サンプル`, date: ``, time: ``, alarm: [], task: true } },
    },
    list9999999999999: { sort: [], data: {} },
  },
  drag: {},
};

export const state: {
  data: {
    [K: string]: {
      sort: string[];
      data: {
        [K: string]: {
          check: boolean;
          title: string;
          date: string;
          time: string;
          alarm: string[];
          task: boolean;
        };
      };
    };
  };
  status: { [K: string]: string };
} = {
  data: refer.init,
  status: {},
};

export const render = {
  classStatus: (arg: { mainId: string }): string => {
    const classStatus: string[] = [];
    arg?.mainId === app.refer.params.mainId && classStatus.push(`select`);
    main.state.status[arg.mainId] === `edit` && classStatus.push(`edit`);
    main.state.status[arg.mainId] === `hide` && classStatus.push(`hide`);
    return classStatus.join(` `);
  },
  classLimit: (arg: { mainId: string }): string => {
    const classLimit: string[] = [];
    const item = main.state.data[app.refer.params.listId].data[arg.mainId];
    const now = new Date();
    const date = `${item.date || `9999/99/99`} ${item.time || `00:00`}`;
    datefns.isBefore(date, datefns.addDays(now, 2)) && classLimit.push(`text-theme-care`);
    datefns.isBefore(date, datefns.addDays(now, 1)) && classLimit.push(`text-theme-warn`);
    return classLimit.join(` `);
  },
  valueCount: (arg: { mainId: string }): string => {
    const itemList = Object.values(sub.state.data[app.refer.params.listId].data[arg.mainId].data);
    return `${itemList.filter((item) => !item.check).length}/${itemList.length}`;
  },
};

export const handle = {
  setup: (): void => {
    [main.state, main.refer.setState] = immer.useImmer<typeof main.state>(main.state);
    React.useEffect(() => {
      localStorage.setItem(`main`, JSON.stringify(main.state.data));
    }, [main.state.data]);
  },
  init: async (): Promise<void> => {
    await main.refer.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`main`)!) || main.refer.init;
    });
  },
  inputValue: (arg: { mainId: string, type: `title` | `check` | `task`, value: string | boolean }): void => {
    main.refer.setState((state) => {
      if (arg.type === `title`) {
        state.data[app.refer.params.listId].data[arg.mainId][arg.type] = arg.value as string;
      } else if (arg.type === `check` || arg.type === `task`) {
        state.data[app.refer.params.listId].data[arg.mainId][arg.type] = arg.value as boolean;
      }
    });
  },
  editItem: (arg?: { mainId: string }): void => {
    main.refer.setState((state) => {
      for (const mainId of state.data[app.refer.params.listId].sort) {
        if (mainId === arg?.mainId) {
          state.status[mainId] = `edit`;
        } else {
          delete state.status[mainId];
        }
      }
    });
  },
  entryItem: (): void => {
    dialog.handle.open({
      mode: `text`,
      title: app.refer.i18next.t(`dialog.title.entry`),
      message: ``,
      text: {
        value: ``,
        placeholder: app.refer.i18next.t(`placeholder.main`),
        error: ``,
      },
      ok: app.refer.i18next.t(`button.ok`),
      cancel: app.refer.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const id = new Date().valueOf();
          main.refer.setState((state) => {
            state.data[app.refer.params.listId].sort.unshift(`main${id}`);
            state.data[app.refer.params.listId].data[`main${id}`] = {
              check: false,
              title: dialog.state.text.value,
              date: ``,
              time: ``,
              alarm: [],
              task: true,
            };
          });
          sub.refer.setState((state) => {
            state.data[app.refer.params.listId].data[`main${id}`] = {
              sort: [`sub${id}`],
              data: { [`sub${id}`]: { check: false, title: `` } },
            };
          });
          dialog.handle.close();
        },
        cancel: () => {
          dialog.handle.close();
        },
      },
    });
  },
  copyItem: (arg: { mainId: string }): void => {
    const mainId = `main${new Date().valueOf()}`;
    main.refer.setState((state) => {
      state.data[app.refer.params.listId].sort.splice(state.data[app.refer.params.listId].sort.indexOf(arg.mainId) + 1, 0, mainId);
      state.data[app.refer.params.listId].data[mainId] = lodash.cloneDeep(state.data[app.refer.params.listId].data[arg.mainId]);
      delete state.status[arg.mainId];
    });
    sub.refer.setState((state) => {
      state.data[app.refer.params.listId].data[mainId] = lodash.cloneDeep(state.data[app.refer.params.listId].data[arg.mainId]);
    });
  },
  moveItem: (arg: { mainId: string }): void => {
    dialog.handle.open({
      mode: `radio`,
      title: app.refer.i18next.t(`dialog.title.move`),
      message: ``,
      radio: {
        none: false,
        select: ``,
        sort: list.state.data.sort.filter((listId) => listId !== app.refer.params.listId),
        data: list.state.data.data,
      },
      ok: app.refer.i18next.t(`button.ok`),
      cancel: app.refer.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const listId = dialog.state.radio.select;
          main.refer.setState((state) => {
            if (listId !== app.refer.params.listId) {
              state.data[listId].sort.unshift(arg.mainId);
              state.data[listId].data[arg.mainId] = state.data[app.refer.params.listId].data[arg.mainId];
              state.data[app.refer.params.listId].sort.splice(state.data[app.refer.params.listId].sort.indexOf(arg.mainId), 1);
              delete state.data[app.refer.params.listId].data[arg.mainId];
            }
            delete state.status[arg.mainId];
          });
          sub.refer.setState((state) => {
            if (listId !== app.refer.params.listId) {
              state.data[listId].data[arg.mainId] = state.data[app.refer.params.listId].data[arg.mainId];
              delete state.data[app.refer.params.listId].data[arg.mainId];
            }
          });
          dialog.handle.close();
        },
        cancel: () => {
          main.refer.setState((state) => {
            delete state.status[arg.mainId];
          });
          dialog.handle.close();
        },
      },
    });
  },
  deleteItem: (arg: { mainId: string }): void => {
    const backup = { main: lodash.cloneDeep(main.state.data), sub: lodash.cloneDeep(sub.state.data) };
    const listId = app.refer.constant.id.trash;
    main.refer.setState((state) => {
      if (listId !== app.refer.params.listId) {
        state.data[listId].sort.unshift(arg.mainId);
        state.data[listId].data[arg.mainId] = state.data[app.refer.params.listId].data[arg.mainId];
      }
      state.data[app.refer.params.listId].sort.splice(state.data[app.refer.params.listId].sort.indexOf(arg.mainId), 1);
      delete state.data[app.refer.params.listId].data[arg.mainId];
      delete state.status[arg.mainId];
    });
    sub.refer.setState((state) => {
      if (listId !== app.refer.params.listId) {
        state.data[listId].data[arg.mainId] = state.data[app.refer.params.listId].data[arg.mainId];
      }
      delete state.data[app.refer.params.listId].data[arg.mainId];
    });
    notice.handle.open({
      message: app.refer.i18next.t(`notice.message`),
      button: app.refer.i18next.t(`notice.button`),
      callback: () => {
        main.refer.setState((state) => {
          state.data = backup.main;
        });
        sub.refer.setState((state) => {
          state.data = backup.sub;
        });
        notice.handle.close();
      },
    });
  },
  dragInit: (arg: { mainId: string; y: number }): void => {
    if (!main.refer.drag.status) {
      const item = app.refer.getById(`MainItem${arg.mainId}`).getBoundingClientRect();
      main.refer.drag.status = `start`;
      main.refer.drag.id = arg.mainId;
      main.refer.drag.y = arg.y;
      main.refer.drag.top = item.top;
      main.refer.drag.left = item.left;
      main.refer.drag.height = item.height;
      main.refer.drag.width = item.width;
      conf.state.data.vibrate === `on` && navigator.vibrate(40);
    }
  },
  dragStart: (): void => {
    if (main.refer.drag.status === `start`) {
      main.refer.drag.status = `move`;
      main.refer.drag.clone = app.refer.getById(`MainItem${main.refer.drag.id}`).cloneNode(true) as HTMLElement;
      main.refer.drag.clone.removeAttribute(`data-id`);
      main.refer.drag.clone.style.position = `absolute`;
      main.refer.drag.clone.style.zIndex = `1`;
      main.refer.drag.clone.style.top = `${main.refer.drag.top}px`;
      main.refer.drag.clone.style.left = `${main.refer.drag.left}px`;
      main.refer.drag.clone.style.height = `${main.refer.drag.height}px`;
      main.refer.drag.clone.style.width = `${main.refer.drag.width}px`;
      app.refer.getById(`MainBody`).appendChild(main.refer.drag.clone);
      main.refer.setState((state) => {
        state.status[main.refer.drag.id!] = `hide`;
      });
    }
  },
  dragMove: (arg: { y: number }): void => {
    if (main.refer.drag.status === `move`) {
      main.refer.drag.clone!.style.top = `${main.refer.drag.top! + arg.y - main.refer.drag.y!}px`;
      const index = main.state.data[app.refer.params.listId].sort.indexOf(main.refer.drag.id!);
      const clone = main.refer.drag.clone!.getBoundingClientRect();
      const prev = app.refer.getById(`MainItem${main.state.data[app.refer.params.listId].sort[index - 1]}`)?.getBoundingClientRect();
      const current = app.refer.getById(`MainItem${main.state.data[app.refer.params.listId].sort[index]}`).getBoundingClientRect();
      const next = app.refer.getById(`MainItem${main.state.data[app.refer.params.listId].sort[index + 1]}`)?.getBoundingClientRect();
      if (prev && clone.top + clone.height / 2 < (next?.top || current.bottom) - (prev.height + current.height) / 2) {
        main.refer.setState((state) => {
          state.data[app.refer.params.listId].sort.splice(index - 1, 0, ...state.data[app.refer.params.listId].sort.splice(index, 1));
        });
      }
      if (next && clone.top + clone.height / 2 > (prev?.bottom || current.top) + (current.height + next.height) / 2) {
        main.refer.setState((state) => {
          state.data[app.refer.params.listId].sort.splice(index + 1, 0, ...state.data[app.refer.params.listId].sort.splice(index, 1));
        });
      }
    }
  },
  dragEnd: (): void => {
    if (main.refer.drag.status === `move`) {
      main.refer.drag.status = `end`;
      main.refer.drag.clone!.classList.remove(`edit`);
      main.refer.drag
        .clone!.animate(
          { top: `${app.refer.getById(`MainItem${main.refer.drag.id}`).getBoundingClientRect().top}px` },
          { duration: app.refer.duration(), easing: `ease-in-out` },
        )
        .addEventListener(`finish`, function listener() {
          main.refer.drag.clone!.removeEventListener(`finish`, listener);
          const id = main.refer.drag.id!;
          main.refer.setState((state) => {
            delete state.status[id];
          });
          main.refer.drag.clone!.remove();
          main.refer.drag = {};
        });
    } else {
      main.refer.drag = {};
    }
  },
};

export default { refer, state, render, handle };
