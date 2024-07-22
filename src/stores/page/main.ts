import React from 'react';
import * as immer from 'use-immer';
import * as datefns from "date-fns";
import lodash from 'lodash';
import Util from "@/utils/base/util";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

export const temp: {
  setState: immer.Updater<typeof main.state>;
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
  data: constant.init.main,
  status: {},
};

export const render = {
  classStatus: (arg: { mainId: string, selectId: string }): string => {
    const classStatus: string[] = [];
    arg?.mainId === arg?.selectId && classStatus.push(`select`);
    main.state.status[arg.mainId] === `edit` && classStatus.push(`edit`);
    main.state.status[arg.mainId] === `hide` && classStatus.push(`hide`);
    return classStatus.join(` `);
  },
  classLimit: (arg: { listId: string, mainId: string }): string => {
    const classLimit: string[] = [];
    const item = main.state.data[arg.listId].data[arg.mainId];
    const now = new Date();
    const date = `${item.date || `9999/99/99`} ${item.time || `00:00`}`;
    datefns.isBefore(date, datefns.addDays(now, 2)) && classLimit.push(`text-theme-care`);
    datefns.isBefore(date, datefns.addDays(now, 1)) && classLimit.push(`text-theme-warn`);
    return classLimit.join(` `);
  },
  valueCount: (arg: { listId: string, mainId: string }): string => {
    const itemList = Object.values(sub.state.data[arg.listId].data[arg.mainId].data);
    return `${itemList.filter((item) => !item.check).length}/${itemList.length}`;
  },
};

export const handle = {
  init: (): void => {
    main.temp.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`main`)!) || constant.init.main;
    });
  },
  watch: (): void => {
    React.useEffect(() => {
      localStorage.setItem(`main`, JSON.stringify(main.state.data));
    }, [main.state.data]);
  },
  inputValue: (arg: { listId: string, mainId: string, type: `title` | `check` | `task`, value: string | boolean }): void => {
    main.temp.setState((state) => {
      if (arg.type === `title`) {
        state.data[arg.listId].data[arg.mainId][arg.type] = arg.value as string;
      } else if (arg.type === `check` || arg.type === `task`) {
        state.data[arg.listId].data[arg.mainId][arg.type] = arg.value as boolean;
      }
    });
  },
  editItem: (arg: { listId: string, mainId?: string }): void => {
    main.temp.setState((state) => {
      for (const mainId of state.data[arg.listId].sort) {
        if (mainId === arg?.mainId) {
          state.status[mainId] = `edit`;
        } else {
          delete state.status[mainId];
        }
      }
    });
  },
  entryItem: (arg: { listId: string }): void => {
    dialog.handle.open({
      mode: `text`,
      title: app.temp.i18next.t(`dialog.title.entry`),
      message: ``,
      text: {
        value: ``,
        placeholder: app.temp.i18next.t(`placeholder.main`),
        error: ``,
      },
      ok: app.temp.i18next.t(`button.ok`),
      cancel: app.temp.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const id = new Date().valueOf();
          main.temp.setState((state) => {
            state.data[arg.listId].sort.unshift(`main${id}`);
            state.data[arg.listId].data[`main${id}`] = {
              check: false,
              title: dialog.state.text.value,
              date: ``,
              time: ``,
              alarm: [],
              task: true,
            };
          });
          sub.temp.setState((state) => {
            state.data[arg.listId].data[`main${id}`] = {
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
  copyItem: (arg: { listId: string, mainId: string }): void => {
    const mainId = `main${new Date().valueOf()}`;
    main.temp.setState((state) => {
      state.data[arg.listId].sort.splice(state.data[arg.listId].sort.indexOf(arg.mainId) + 1, 0, mainId);
      state.data[arg.listId].data[mainId] = lodash.cloneDeep(state.data[arg.listId].data[arg.mainId]);
      delete state.status[arg.mainId];
    });
    sub.temp.setState((state) => {
      state.data[arg.listId].data[mainId] = lodash.cloneDeep(state.data[arg.listId].data[arg.mainId]);
    });
  },
  moveItem: (arg: { listId: string, mainId: string }): void => {
    dialog.handle.open({
      mode: `radio`,
      title: app.temp.i18next.t(`dialog.title.move`),
      message: ``,
      radio: {
        none: false,
        select: ``,
        sort: list.state.data.sort.filter((listId) => listId !== arg.listId),
        data: list.state.data.data,
      },
      ok: app.temp.i18next.t(`button.ok`),
      cancel: app.temp.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const listId = dialog.state.radio.select;
          main.temp.setState((state) => {
            if (listId !== arg.listId) {
              state.data[listId].sort.unshift(arg.mainId);
              state.data[listId].data[arg.mainId] = state.data[arg.listId].data[arg.mainId];
              state.data[arg.listId].sort.splice(state.data[arg.listId].sort.indexOf(arg.mainId), 1);
              delete state.data[arg.listId].data[arg.mainId];
            }
            delete state.status[arg.mainId];
          });
          sub.temp.setState((state) => {
            if (listId !== arg.listId) {
              state.data[listId].data[arg.mainId] = state.data[arg.listId].data[arg.mainId];
              delete state.data[arg.listId].data[arg.mainId];
            }
          });
          dialog.handle.close();
        },
        cancel: () => {
          main.temp.setState((state) => {
            delete state.status[arg.mainId];
          });
          dialog.handle.close();
        },
      },
    });
  },
  deleteItem: (arg: { listId: string, mainId: string }): void => {
    const backup = { main: lodash.cloneDeep(main.state.data), sub: lodash.cloneDeep(sub.state.data) };
    const listId = constant.base.id.trash;
    main.temp.setState((state) => {
      if (listId !== arg.listId) {
        state.data[listId].sort.unshift(arg.mainId);
        state.data[listId].data[arg.mainId] = state.data[arg.listId].data[arg.mainId];
      }
      state.data[arg.listId].sort.splice(state.data[arg.listId].sort.indexOf(arg.mainId), 1);
      delete state.data[arg.listId].data[arg.mainId];
      delete state.status[arg.mainId];
    });
    sub.temp.setState((state) => {
      if (listId !== arg.listId) {
        state.data[listId].data[arg.mainId] = state.data[arg.listId].data[arg.mainId];
      }
      delete state.data[arg.listId].data[arg.mainId];
    });
    notice.handle.open({
      message: app.temp.i18next.t(`notice.message`),
      button: app.temp.i18next.t(`notice.button`),
      callback: () => {
        main.temp.setState((state) => {
          state.data = backup.main;
        });
        sub.temp.setState((state) => {
          state.data = backup.sub;
        });
        notice.handle.close();
      },
    });
  },
  dragInit: (arg: { mainId: string; y: number }): void => {
    if (!main.temp.drag.status) {
      const item = Util.getById(`MainItem${arg.mainId}`).getBoundingClientRect();
      main.temp.drag.status = `start`;
      main.temp.drag.id = arg.mainId;
      main.temp.drag.y = arg.y;
      main.temp.drag.top = item.top;
      main.temp.drag.left = item.left;
      main.temp.drag.height = item.height;
      main.temp.drag.width = item.width;
      conf.state.data.vibrate === `on` && navigator.vibrate(40);
    }
  },
  dragStart: (): void => {
    if (main.temp.drag.status === `start`) {
      main.temp.drag.status = `move`;
      main.temp.drag.clone = Util.getById(`MainItem${main.temp.drag.id}`).cloneNode(true) as HTMLElement;
      main.temp.drag.clone.removeAttribute(`data-id`);
      main.temp.drag.clone.style.position = `absolute`;
      main.temp.drag.clone.style.zIndex = `1`;
      main.temp.drag.clone.style.top = `${main.temp.drag.top}px`;
      main.temp.drag.clone.style.left = `${main.temp.drag.left}px`;
      main.temp.drag.clone.style.height = `${main.temp.drag.height}px`;
      main.temp.drag.clone.style.width = `${main.temp.drag.width}px`;
      Util.getById(`MainBody`).appendChild(main.temp.drag.clone);
      main.temp.setState((state) => {
        state.status[main.temp.drag.id!] = `hide`;
      });
    }
  },
  dragMove: (arg: { listId: string, y: number }): void => {
    if (main.temp.drag.status === `move`) {
      main.temp.drag.clone!.style.top = `${main.temp.drag.top! + arg.y - main.temp.drag.y!}px`;
      const index = main.state.data[arg.listId].sort.indexOf(main.temp.drag.id!);
      const clone = main.temp.drag.clone!.getBoundingClientRect();
      const prev = Util.getById(`MainItem${main.state.data[arg.listId].sort[index - 1]}`)?.getBoundingClientRect();
      const current = Util.getById(`MainItem${main.state.data[arg.listId].sort[index]}`).getBoundingClientRect();
      const next = Util.getById(`MainItem${main.state.data[arg.listId].sort[index + 1]}`)?.getBoundingClientRect();
      if (prev && clone.top + clone.height / 2 < (next?.top || current.bottom) - (prev.height + current.height) / 2) {
        main.temp.setState((state) => {
          state.data[arg.listId].sort.splice(index - 1, 0, ...state.data[arg.listId].sort.splice(index, 1));
        });
      }
      if (next && clone.top + clone.height / 2 > (prev?.bottom || current.top) + (current.height + next.height) / 2) {
        main.temp.setState((state) => {
          state.data[arg.listId].sort.splice(index + 1, 0, ...state.data[arg.listId].sort.splice(index, 1));
        });
      }
    }
  },
  dragEnd: (): void => {
    if (main.temp.drag.status === `move`) {
      main.temp.drag.status = `end`;
      main.temp.drag.clone!.classList.remove(`edit`);
      main.temp.drag
        .clone!.animate(
          { top: `${Util.getById(`MainItem${main.temp.drag.id}`).getBoundingClientRect().top}px` },
          { duration: app.render.getDuration(), easing: `ease-in-out` },
        )
        .addEventListener(`finish`, function listener() {
          main.temp.drag.clone!.removeEventListener(`finish`, listener);
          const id = main.temp.drag.id!;
          main.temp.setState((state) => {
            delete state.status[id];
          });
          main.temp.drag.clone!.remove();
          main.temp.drag = {};
        });
    } else {
      main.temp.drag = {};
    }
  },
};

export default { temp, state, render, handle };
