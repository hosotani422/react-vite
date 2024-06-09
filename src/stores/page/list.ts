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
import IconList from '@/components/icon/list';
import IconInbox from '@/components/icon/inbox';
import IconTrash from '@/components/icon/trash';

export const temp: {
  setState: immer.Updater<typeof list.state>;
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
  data: constant.init.list,
  status: {},
};

export const render = {
  classStatus: (arg?: { listId: string, selectId: string }): string => {
    const classStatus: string[] = [];
    arg?.listId === arg?.selectId && classStatus.push(`select`);
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
    if (arg.listId === constant.base.id.inbox) {
      return IconInbox;
    } else if (arg.listId === constant.base.id.trash) {
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
  init: (): void => {
    list.temp.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`list`)!) || constant.init.list;
    });
  },
  watch: (): void => {
    React.useEffect(() => {
      localStorage.setItem(`list`, JSON.stringify(list.state.data));
    }, [list.state.data]);
  },
  inputValue: (arg: { listId: string, type: `title`, value: string }): void => {
    list.temp.setState((state) => {
      state.data.data[arg.listId][arg.type] = arg.value;
    });
  },
  editItem: (arg?: { listId: string }): void => {
    list.temp.setState((state) => {
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
      title: app.temp.i18next.t(`dialog.title.entry`),
      message: ``,
      text: {
        value: ``,
        placeholder: app.temp.i18next.t(`placeholder.list`),
        error: ``,
      },
      ok: app.temp.i18next.t(`button.ok`),
      cancel: app.temp.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const listId = `list${new Date().valueOf()}`;
          list.temp.setState((state) => {
            state.data.sort.unshift(listId);
            state.data.data[listId] = { title: dialog.state.text.value };
          });
          main.temp.setState((state) => {
            state.data[listId] = { sort: [], data: {} };
          });
          sub.temp.setState((state) => {
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
    list.temp.setState((state) => {
      state.data.sort.splice(state.data.sort.indexOf(arg.listId) + 1, 0, listId);
      state.data.data[listId] = lodash.cloneDeep(state.data.data[arg.listId]);
      delete state.status[arg.listId];
    });
    main.temp.setState((state) => {
      state.data[listId] = lodash.cloneDeep(state.data[arg.listId]);
    });
    sub.temp.setState((state) => {
      state.data[listId] = lodash.cloneDeep(state.data[arg.listId]);
    });
  },
  deleteItem: (arg: { listId: string }): void => {
    dialog.handle.open({
      mode: `confirm`,
      title: app.temp.i18next.t(`dialog.title.delete`),
      message: ``,
      ok: app.temp.i18next.t(`button.ok`),
      cancel: app.temp.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          const backup = {
            list: lodash.cloneDeep(list.state.data),
            main: lodash.cloneDeep(main.state.data),
            sub: lodash.cloneDeep(sub.state.data),
          };
          const listId = constant.base.id.trash;
          const sort = lodash.cloneDeep(main.state.data[arg.listId].sort);
          list.temp.setState((state) => {
            state.data.sort.splice(state.data.sort.indexOf(arg.listId), 1);
            delete state.data.data[arg.listId];
            delete state.status[arg.listId];
          });
          main.temp.setState((state) => {
            for (const mainId of sort) {
              state.data[listId].sort.push(mainId);
              state.data[listId].data[mainId] = state.data[arg.listId].data[mainId];
            }
            delete state.data[arg.listId];
          });
          sub.temp.setState((state) => {
            for (const mainId of sort) {
              state.data[listId].data[mainId] = state.data[arg.listId].data[mainId];
            }
            delete state.data[arg.listId];
          });
          dialog.handle.close();
          notice.handle.open({
            message: app.temp.i18next.t(`notice.message`),
            button: app.temp.i18next.t(`notice.button`),
            callback: () => {
              list.temp.setState((state) => {
                state.data = backup.list;
              });
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
        cancel: () => {
          list.temp.setState((state) => {
            delete state.status[arg.listId];
          });
          dialog.handle.close();
        },
      },
    });
  },
  dragInit: (arg: { listId: string; y: number }): void => {
    if (!list.temp.drag.status) {
      const item = Util.getById(`ListItem${arg.listId}`).getBoundingClientRect();
      list.temp.drag.status = `start`;
      list.temp.drag.id = arg.listId;
      list.temp.drag.y = arg.y;
      list.temp.drag.top = item.top;
      list.temp.drag.left = item.left;
      list.temp.drag.height = item.height;
      list.temp.drag.width = item.width;
      conf.state.data.vibrate === `on` && navigator.vibrate(40);
    }
  },
  dragStart: (): void => {
    if (list.temp.drag.status === `start`) {
      list.temp.drag.status = `move`;
      list.temp.drag.clone = Util.getById(`ListItem${list.temp.drag.id}`).cloneNode(true) as HTMLElement;
      list.temp.drag.clone.removeAttribute(`data-id`);
      list.temp.drag.clone.style.position = `absolute`;
      list.temp.drag.clone.style.zIndex = `1`;
      list.temp.drag.clone.style.top = `${list.temp.drag.top}px`;
      list.temp.drag.clone.style.left = `${list.temp.drag.left}px`;
      list.temp.drag.clone.style.height = `${list.temp.drag.height}px`;
      list.temp.drag.clone.style.width = `${list.temp.drag.width}px`;
      Util.getById(`ListBody`).appendChild(list.temp.drag.clone);
      list.temp.setState((state) => {
        state.status[list.temp.drag.id!] = `hide`;
      });
    }
  },
  dragMove: (arg: { y: number }): void => {
    if (list.temp.drag.status === `move`) {
      list.temp.drag.clone!.style.top = `${list.temp.drag.top! + arg.y - list.temp.drag.y!}px`;
      const index = list.state.data.sort.indexOf(list.temp.drag.id!);
      const clone = list.temp.drag.clone!.getBoundingClientRect();
      const prev = Util.getById(`ListItem${list.state.data.sort[index - 1]}`)?.getBoundingClientRect();
      const current = Util.getById(`ListItem${list.state.data.sort[index]}`).getBoundingClientRect();
      const next = Util.getById(`ListItem${list.state.data.sort[index + 1]}`)?.getBoundingClientRect();
      if (prev && clone.top + clone.height / 2 < (next?.top || current.bottom) - (prev.height + current.height) / 2) {
        list.temp.setState((state) => {
          state.data.sort.splice(index - 1, 0, ...state.data.sort.splice(index, 1));
        });
      }
      if (next && clone.top + clone.height / 2 > (prev?.bottom || current.top) + (current.height + next.height) / 2) {
        list.temp.setState((state) => {
          state.data.sort.splice(index + 1, 0, ...state.data.sort.splice(index, 1));
        });
      }
    }
  },
  dragEnd: (): void => {
    if (list.temp.drag.status === `move`) {
      list.temp.drag.status = `end`;
      list.temp.drag.clone!.classList.remove(`edit`);
      list.temp.drag
        .clone!.animate(
          { top: `${Util.getById(`ListItem${list.temp.drag.id}`).getBoundingClientRect().top}px` },
          { duration: app.render.getDuration(), easing: `ease-in-out` },
        )
        .addEventListener(`finish`, function listener() {
          list.temp.drag.clone!.removeEventListener(`finish`, listener);
          const id = list.temp.drag.id!;
          list.temp.setState((state) => {
            delete state.status[id];
          });
          list.temp.drag.clone!.remove();
          list.temp.drag = {};
        });
    } else {
      list.temp.drag = {};
    }
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!list.temp.swipe.status) {
      list.temp.swipe.status = `start`;
      list.temp.swipe.elem = Util.getById<HTMLElement>(`ListRoot`);
      list.temp.swipe.x = arg.x;
      list.temp.swipe.y = arg.y;
      list.temp.swipe.left = list.temp.swipe.elem.getBoundingClientRect().left;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (list.temp.swipe.status === `start`) {
      if (Math.abs(arg.x - list.temp.swipe.x!) + Math.abs(arg.y - list.temp.swipe.y!) > 15) {
        if (Math.abs(arg.x - list.temp.swipe.x!) > Math.abs(arg.y - list.temp.swipe.y!)) {
          list.temp.swipe.status = `move`;
        } else {
          list.temp.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { x: number }): void => {
    if (list.temp.swipe.status === `move`) {
      list.temp.swipe.elem!.style.transform = `translateX(${Math.min(list.temp.swipe.left! + arg.x - list.temp.swipe.x!, 0)}px)`;
    }
  },
  swipeEnd: (arg: { x: number }): void => {
    if (list.temp.swipe.status === `move`) {
      list.temp.swipe.status = `end`;
      if (list.temp.swipe.left! + arg.x - list.temp.swipe.x! < -100) {
        app.handle.routerBack();
        list.temp.swipe = {};
      } else {
        list.temp.swipe
          .elem!.animate(
            { transform: `translateX(0px)` },
            { duration: app.render.getDuration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            list.temp.swipe.elem!.removeEventListener(`finish`, listener);
            list.temp.swipe.elem!.style.transform = `translateX(0px)`;
            list.temp.swipe = {};
          });
      }
    } else {
      list.temp.swipe = {};
    }
  },
};

export default { temp, state, render, handle };
