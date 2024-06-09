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
import IconList from '@/components/icon/list';
import IconInbox from '@/components/icon/inbox';
import IconTrash from '@/components/icon/trash';

export const refer: {
  setState: immer.Updater<typeof list.state>;
  init: typeof list.state.data;
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
  swipe: {
    status?: `start` | `move` | `end`;
    elem?: HTMLElement;
    x?: number;
    y?: number;
    left?: number;
  };
} = {
  setState: () => {},
  init: {
    sort: [`list0000000000000`, `list9999999999999`],
    data: {
      list0000000000000: { title: `Inbox` },
      list9999999999999: { title: `Trash` },
    },
  },
  drag: {},
  swipe: {},
};

export const state: {
  data: {
    sort: string[];
    data: {
      [K: string]: {
        title: string;
      };
    };
  };
  status: { [K: string]: string };
} = {
  data: refer.init,
  status: {},
};

export const render = {
  classStatus: (arg?: { listId: string }): string => {
    const classStatus: string[] = [];
    arg?.listId === app.refer.params.listId && classStatus.push(`select`);
    list.state.status[arg?.listId!] === `edit` && classStatus.push(`edit`);
    list.state.status[arg?.listId!] === `hide` && classStatus.push(`hide`);
    return classStatus.join(` `);
  },
  classLimit: (arg: { listId: string }): string => {
    const classLimit: string[] = [];
    for (const mainId of main.state.data[arg.listId].sort) {
      const item = main.state.data[arg.listId].data[mainId];
      const now = new Date();
      const date = `${item.date || `9999/99/99`} ${item.time || `00:00`}`;
      datefns.isBefore(date, datefns.addDays(now, 2)) && !classLimit.includes(`text-theme-care`) && classLimit.push(`text-theme-care`);
      datefns.isBefore(date, datefns.addDays(now, 1)) && !classLimit.includes(`text-theme-warn`) && classLimit.push(`text-theme-warn`);
    }
    return classLimit.join(` `);
  },
  typeIcon: (arg: { listId: string }): typeof IconInbox | typeof IconTrash | typeof IconList => {
    if (arg.listId === app.refer.constant.id.inbox) {
      return IconInbox;
    } else if (arg.listId === app.refer.constant.id.trash) {
      return IconTrash;
    }
    return IconList;
  },
  valueCount: (arg: { listId: string }): string => {
    const itemList = Object.values(main.state.data[arg.listId].data);
    return `${itemList.filter((item) => !item.check).length}/${itemList.length}`;
  },
};

export const handle = {
  setup: (): void => {
    [list.state, list.refer.setState] = immer.useImmer<typeof list.state>(list.state);
    React.useEffect(() => {
      localStorage.setItem(`list`, JSON.stringify(list.state.data));
    }, [list.state.data]);
  },
  init: async (): Promise<void> => {
    await list.refer.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`list`)!) || list.refer.init;
    });
  },
  inputValue: (arg: { listId: string, type: `title`, value: string }): void => {
    list.refer.setState((state) => {
      state.data.data[arg.listId][arg.type] = arg.value;
    });
  },
  editItem: (arg?: { listId: string }): void => {
    list.refer.setState((state) => {
      for (const listId of state.data.sort) {
        if (listId === arg?.listId) {
          state.status[listId] = `edit`;
        } else {
          delete state.status[listId];
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
        placeholder: app.refer.i18next.t(`placeholder.list`),
        error: ``,
      },
      ok: app.refer.i18next.t(`button.ok`),
      cancel: app.refer.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const listId = `list${new Date().valueOf()}`;
          list.refer.setState((state) => {
            state.data.sort.unshift(listId);
            state.data.data[listId] = { title: dialog.state.text.value };
          });
          main.refer.setState((state) => {
            state.data[listId] = { sort: [], data: {} };
          });
          sub.refer.setState((state) => {
            state.data[listId] = { data: {} };
          });
          dialog.handle.close();
        },
        cancel: () => {
          dialog.handle.close();
        },
      },
    });
  },
  copyItem: (arg: { listId: string }): void => {
    const listId = `list${new Date().valueOf()}`;
    list.refer.setState((state) => {
      state.data.sort.splice(state.data.sort.indexOf(arg.listId) + 1, 0, listId);
      state.data.data[listId] = lodash.cloneDeep(state.data.data[arg.listId]);
      delete state.status[arg.listId];
    });
    main.refer.setState((state) => {
      state.data[listId] = lodash.cloneDeep(state.data[arg.listId]);
    });
    sub.refer.setState((state) => {
      state.data[listId] = lodash.cloneDeep(state.data[arg.listId]);
    });
  },
  deleteItem: (arg: { listId: string }): void => {
    dialog.handle.open({
      mode: `confirm`,
      title: app.refer.i18next.t(`dialog.title.delete`),
      message: ``,
      ok: app.refer.i18next.t(`button.ok`),
      cancel: app.refer.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const backup = {
            list: lodash.cloneDeep(list.state.data),
            main: lodash.cloneDeep(main.state.data),
            sub: lodash.cloneDeep(sub.state.data),
          };
          const listId = app.refer.constant.id.trash;
          const sort = lodash.cloneDeep(main.state.data[arg.listId].sort);
          list.refer.setState((state) => {
            state.data.sort.splice(state.data.sort.indexOf(arg.listId), 1);
            delete state.data.data[arg.listId];
            delete state.status[arg.listId];
          });
          main.refer.setState((state) => {
            for (const mainId of sort) {
              state.data[listId].sort.push(mainId);
              state.data[listId].data[mainId] = state.data[arg.listId].data[mainId];
            }
            delete state.data[arg.listId];
          });
          sub.refer.setState((state) => {
            for (const mainId of sort) {
              state.data[listId].data[mainId] = state.data[arg.listId].data[mainId];
            }
            delete state.data[arg.listId];
          });
          dialog.handle.close();
          notice.handle.open({
            message: app.refer.i18next.t(`notice.message`),
            button: app.refer.i18next.t(`notice.button`),
            callback: () => {
              list.refer.setState((state) => {
                state.data = backup.list;
              });
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
        cancel: () => {
          list.refer.setState((state) => {
            delete state.status[arg.listId];
          });
          dialog.handle.close();
        },
      },
    });
  },
  dragInit: (arg: { listId: string; y: number }): void => {
    if (!list.refer.drag.status) {
      const item = app.refer.getById(`ListItem${arg.listId}`).getBoundingClientRect();
      list.refer.drag.status = `start`;
      list.refer.drag.id = arg.listId;
      list.refer.drag.y = arg.y;
      list.refer.drag.top = item.top;
      list.refer.drag.left = item.left;
      list.refer.drag.height = item.height;
      list.refer.drag.width = item.width;
      conf.state.data.vibrate === `on` && navigator.vibrate(40);
    }
  },
  dragStart: (): void => {
    if (list.refer.drag.status === `start`) {
      list.refer.drag.status = `move`;
      list.refer.drag.clone = app.refer.getById(`ListItem${list.refer.drag.id}`).cloneNode(true) as HTMLElement;
      list.refer.drag.clone.removeAttribute(`data-id`);
      list.refer.drag.clone.style.position = `absolute`;
      list.refer.drag.clone.style.zIndex = `1`;
      list.refer.drag.clone.style.top = `${list.refer.drag.top}px`;
      list.refer.drag.clone.style.left = `${list.refer.drag.left}px`;
      list.refer.drag.clone.style.height = `${list.refer.drag.height}px`;
      list.refer.drag.clone.style.width = `${list.refer.drag.width}px`;
      app.refer.getById(`ListBody`).appendChild(list.refer.drag.clone);
      list.refer.setState((state) => {
        state.status[list.refer.drag.id!] = `hide`;
      });
    }
  },
  dragMove: (arg: { y: number }): void => {
    if (list.refer.drag.status === `move`) {
      list.refer.drag.clone!.style.top = `${list.refer.drag.top! + arg.y - list.refer.drag.y!}px`;
      const index = list.state.data.sort.indexOf(list.refer.drag.id!);
      const clone = list.refer.drag.clone!.getBoundingClientRect();
      const prev = app.refer.getById(`ListItem${list.state.data.sort[index - 1]}`)?.getBoundingClientRect();
      const current = app.refer.getById(`ListItem${list.state.data.sort[index]}`).getBoundingClientRect();
      const next = app.refer.getById(`ListItem${list.state.data.sort[index + 1]}`)?.getBoundingClientRect();
      if (prev && clone.top + clone.height / 2 < (next?.top || current.bottom) - (prev.height + current.height) / 2) {
        list.refer.setState((state) => {
          state.data.sort.splice(index - 1, 0, ...state.data.sort.splice(index, 1));
        });
      }
      if (next && clone.top + clone.height / 2 > (prev?.bottom || current.top) + (current.height + next.height) / 2) {
        list.refer.setState((state) => {
          state.data.sort.splice(index + 1, 0, ...state.data.sort.splice(index, 1));
        });
      }
    }
  },
  dragEnd: (): void => {
    if (list.refer.drag.status === `move`) {
      list.refer.drag.status = `end`;
      list.refer.drag.clone!.classList.remove(`edit`);
      list.refer.drag
        .clone!.animate(
          { top: `${app.refer.getById(`ListItem${list.refer.drag.id}`).getBoundingClientRect().top}px` },
          { duration: app.refer.duration(), easing: `ease-in-out` },
        )
        .addEventListener(`finish`, function listener() {
          list.refer.drag.clone!.removeEventListener(`finish`, listener);
          const id = list.refer.drag.id!;
          list.refer.setState((state) => {
            delete state.status[id];
          });
          list.refer.drag.clone!.remove();
          list.refer.drag = {};
        });
    } else {
      list.refer.drag = {};
    }
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!list.refer.swipe.status) {
      list.refer.swipe.status = `start`;
      list.refer.swipe.elem = app.refer.getById<HTMLElement>(`ListRoot`);
      list.refer.swipe.x = arg.x;
      list.refer.swipe.y = arg.y;
      list.refer.swipe.left = list.refer.swipe.elem.getBoundingClientRect().left;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (list.refer.swipe.status === `start`) {
      if (Math.abs(arg.x - list.refer.swipe.x!) + Math.abs(arg.y - list.refer.swipe.y!) > 15) {
        if (Math.abs(arg.x - list.refer.swipe.x!) > Math.abs(arg.y - list.refer.swipe.y!)) {
          list.refer.swipe.status = `move`;
        } else {
          list.refer.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { x: number }): void => {
    if (list.refer.swipe.status === `move`) {
      list.refer.swipe.elem!.style.transform = `translateX(${Math.min(list.refer.swipe.left! + arg.x - list.refer.swipe.x!, 0)}px)`;
    }
  },
  swipeEnd: (arg: { x: number }): void => {
    if (list.refer.swipe.status === `move`) {
      list.refer.swipe.status = `end`;
      if (list.refer.swipe.left! + arg.x - list.refer.swipe.x! < -100) {
        app.handle.routerBack();
        list.refer.swipe = {};
      } else {
        list.refer.swipe
          .elem!.animate(
            { transform: `translateX(0px)` },
            { duration: app.refer.duration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            list.refer.swipe.elem!.removeEventListener(`finish`, listener);
            list.refer.swipe.elem!.style.transform = `translateX(0px)`;
            list.refer.swipe = {};
          });
      }
    } else {
      list.refer.swipe = {};
    }
  },
};

export default { refer, state, render, handle };
