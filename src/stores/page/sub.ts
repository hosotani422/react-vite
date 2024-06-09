import React from 'react';
import * as immer from 'use-immer';
import * as datefns from "date-fns";
import lodash from 'lodash';
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

export const refer: {
  setState: immer.Updater<typeof sub.state>;
  init: typeof sub.state.data;
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
    right?: number;
  };
} = {
  setState: () => {},
  init: {
    list0000000000000: {
      data: { main0000000000000: { sort: [`sub0000000000000`], data: { sub0000000000000: { check: false, title: `` } } } },
    },
    list9999999999999: { data: {} },
  },
  drag: {},
  swipe: {},
};

export const state: {
  data: {
    [K: string]: {
      data: {
        [K: string]: {
          sort: string[];
          data: {
            [K: string]: {
              check: boolean;
              title: string;
            };
          };
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
  valueMemo: (): string => {
    const valueMemo: string[] = [];
    for (const subId of sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort) {
      valueMemo.push(sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].data[subId].title);
    }
    return valueMemo.join(`\n`);
  },
  classStatus: (arg: { subId: string }): string => {
    const classStatus: string[] = [];
    sub.state.status[arg.subId] === `edit` && classStatus.push(`edit`);
    sub.state.status[arg.subId] === `hide` && classStatus.push(`hide`);
    return classStatus.join(` `);
  },
  classLimit: (): string => {
    const classLimit: string[] = [];
    const item = main.state.data[app.refer.params.listId].data[app.refer.params.mainId];
    const now = new Date();
    const date = `${item.date || `9999/99/99`} ${item.time || `00:00`}`;
    datefns.isBefore(date, datefns.addDays(now, 2)) && classLimit.push(`text-theme-care`);
    datefns.isBefore(date, datefns.addDays(now, 1)) && classLimit.push(`text-theme-warn`);
    return classLimit.join(` `);
  },
  textAlarm: (): string => {
    const textAlarm: string[] = [];
    for (const alarmId of main.state.data[app.refer.params.listId].data[app.refer.params.mainId].alarm) {
      textAlarm.push(app.refer.i18next.t(`dialog.alarm.data.${alarmId}.label`));
    }
    return textAlarm.join(`,`);
  },
};

export const handle = {
  setup: (): void => {
    [sub.state, sub.refer.setState] = immer.useImmer<typeof sub.state>(sub.state);
    React.useEffect(() => {
      localStorage.setItem(`sub`, JSON.stringify(sub.state.data));
    }, [sub.state.data]);
  },
  init: async (): Promise<void> => {
    await sub.refer.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`sub`)!) || sub.refer.init;
    });
  },
  inputValue: (arg: { subId: string, type: `title` | `check`, value: string | boolean }): void => {
    sub.refer.setState((state) => {
      if (arg.type === `title`) {
        state.data[app.refer.params.listId].data[app.refer.params.mainId].data[arg.subId][arg.type] = arg.value as string;
      } else if (arg.type === `check`) {
        state.data[app.refer.params.listId].data[app.refer.params.mainId].data[arg.subId][arg.type] = arg.value as boolean;
      }
    });
  },
  inputMemo: (arg: { value: string }): void => {
    const subId = new Date().valueOf();
    sub.refer.setState((state) => {
      state.data[app.refer.params.listId].data[app.refer.params.mainId].sort = [];
      state.data[app.refer.params.listId].data[app.refer.params.mainId].data = {};
      for (const [i, title] of arg.value.split(`\n`).entries()) {
        state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.push(`sub${subId + i}`);
        state.data[app.refer.params.listId].data[app.refer.params.mainId].data[`sub${subId + i}`] = { check: false, title };
      }
    });
  },
  divideItem: async (arg: { subId: string, caret: number }): Promise<void> => {
    const subId = `sub${new Date().valueOf()}`;
    const title = sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].data[arg.subId].title;
    await sub.refer.setState((state) => {
      state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.splice(sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.indexOf(arg.subId) + 1, 0, subId);
      state.data[app.refer.params.listId].data[app.refer.params.mainId].data[arg.subId].title = title.slice(0, arg.caret);
      state.data[app.refer.params.listId].data[app.refer.params.mainId].data[subId] = { check: false, title: title.slice(arg.caret) };
    });
    const elem = app.refer.getById<HTMLInputElement>(`SubTask${subId}`);
    elem.focus();
    elem.selectionStart = 0;
    elem.selectionEnd = 0;
  },
  connectItem: async (arg: { subId: string }): Promise<void> => {
    const subId = sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort[sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.indexOf(arg.subId) - 1]!;
    const caret = sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].data[subId].title.length;
    await sub.refer.setState((state) => {
      state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.splice(state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.indexOf(arg.subId), 1);
      state.data[app.refer.params.listId].data[app.refer.params.mainId].data[subId].title += state.data[app.refer.params.listId].data[app.refer.params.mainId].data[arg.subId].title;
      delete state.data[app.refer.params.listId].data[app.refer.params.mainId].data[arg.subId];
      delete state.status[arg.subId];
    });
    const elem = app.refer.getById<HTMLInputElement>(`SubTask${subId}`);
    elem.focus();
    elem.selectionStart = caret;
    elem.selectionEnd = caret;
  },
  deleteItem: (arg: { subId: string }): void => {
    const backup = lodash.cloneDeep(sub.state.data);
    sub.refer.setState((state) => {
      state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.splice(state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.indexOf(arg.subId), 1);
      delete state.data[app.refer.params.listId].data[app.refer.params.mainId].data[arg.subId];
      delete state.status[arg.subId];
    });
    notice.handle.open({
      message: app.refer.i18next.t(`notice.message`),
      button: app.refer.i18next.t(`notice.button`),
      callback: () => {
        sub.refer.setState((state) => {
          state.data = backup;
        });
        notice.handle.close();
      },
    });
  },
  openCalendar: (): void => {
    calendar.handle.open({
      select: main.state.data[app.refer.params.listId].data[app.refer.params.mainId].date,
      cancel: app.refer.i18next.t(`button.cancel`),
      clear: app.refer.i18next.t(`button.clear`),
      callback: (date) => {
        main.refer.setState((state) => {
          state.data[app.refer.params.listId].data[app.refer.params.mainId].date = date;
        });
        calendar.handle.close();
      },
    });
  },
  openClock: (): void => {
    clock.handle.open({
      time: datefns.format(`2000/1/1 ${main.state.data[app.refer.params.listId].data[app.refer.params.mainId].time || `00:00`}`, `HH:mm`),
      cancel: app.refer.i18next.t(`button.cancel`),
      clear: app.refer.i18next.t(`button.clear`),
      ok: app.refer.i18next.t(`button.ok`),
      callback: (args) => {
        main.refer.setState((state) => {
          state.data[app.refer.params.listId].data[app.refer.params.mainId].time = args ? datefns.format(`2000/1/1 ${args.hour}:${args.minute}`, `HH:mm`) : ``;
        });
        clock.handle.close();
      },
    });
  },
  openAlarm: (): void => {
    dialog.handle.open({
      mode: `check`,
      title: app.refer.i18next.t(`dialog.title.alarm`),
      message: ``,
      check: {
        all: true,
        sort: app.refer.i18next.t(`dialog.alarm.sort`, { returnObjects: true }),
        data: (() => {
          const data: (typeof dialog)[`state`][`check`][`data`] = {};
          for (const id of app.refer.i18next.t(`dialog.alarm.sort`, { returnObjects: true })) {
            data[id] = {
              check: main.state.data[app.refer.params.listId].data[app.refer.params.mainId].alarm.includes(id),
              title: app.refer.i18next.t(`dialog.alarm.data.${id}.label`),
            };
          }
          return data;
        })(),
      },
      ok: app.refer.i18next.t(`button.ok`),
      cancel: app.refer.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          main.refer.setState((state) => {
            state.data[app.refer.params.listId].data[app.refer.params.mainId].alarm = [];
            for (const id of dialog.state.check.sort) {
              if (dialog.state.check.data[id].check) {
                state.data[app.refer.params.listId].data[app.refer.params.mainId].alarm.push(id);
              }
            }
          });
          dialog.handle.close();
        },
        cancel: () => {
          dialog.handle.close();
        },
      },
    });
  },
  dragInit: (arg: { subId: string; y: number }): void => {
    if (!sub.refer.drag.status) {
      const item = app.refer.getById(`SubItem${arg.subId}`).getBoundingClientRect();
      sub.refer.drag.status = `start`;
      sub.refer.drag.id = arg.subId;
      sub.refer.drag.y = arg.y;
      sub.refer.drag.top = item.top;
      sub.refer.drag.left = item.left - app.refer.getById(`SubHome`).getBoundingClientRect().left;
      sub.refer.drag.height = item.height;
      sub.refer.drag.width = item.width;
      sub.refer.setState((state) => {
        state.status[arg.subId] = `edit`;
      });
      conf.state.data.vibrate === `on` && navigator.vibrate(40);
    }
  },
  dragStart: (): void => {
    if (sub.refer.drag.status === `start`) {
      sub.refer.drag.status = `move`;
      sub.refer.drag.clone = app.refer.getById(`SubItem${sub.refer.drag.id}`).cloneNode(true) as HTMLElement;
      sub.refer.drag.clone.removeAttribute(`data-id`);
      sub.refer.drag.clone.style.position = `absolute`;
      sub.refer.drag.clone.style.zIndex = `1`;
      sub.refer.drag.clone.style.top = `${sub.refer.drag.top}px`;
      sub.refer.drag.clone.style.left = `${sub.refer.drag.left}px`;
      sub.refer.drag.clone.style.height = `${sub.refer.drag.height}px`;
      sub.refer.drag.clone.style.width = `${sub.refer.drag.width}px`;
      app.refer.getById(`SubBody`).appendChild(sub.refer.drag.clone);
      sub.refer.setState((state) => {
        state.status[sub.refer.drag.id!] = `hide`;
      });
    }
  },
  dragMove: (arg: { y: number }): void => {
    if (sub.refer.drag.status === `move`) {
      sub.refer.drag.clone!.style.top = `${sub.refer.drag.top! + arg.y - sub.refer.drag.y!}px`;
      const index = sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.indexOf(sub.refer.drag.id!);
      const clone = sub.refer.drag.clone!.getBoundingClientRect();
      const wrap = app.refer.getById(`SubBody`).getBoundingClientRect();
      const prev = app.refer.getById(`SubItem${sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort[index - 1]}`)?.getBoundingClientRect();
      const current = app.refer.getById(`SubItem${sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort[index]}`).getBoundingClientRect();
      const next = app.refer.getById(`SubItem${sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort[index + 1]}`)?.getBoundingClientRect();
      if (prev && clone.top + clone.height / 2 < (next?.top || wrap.bottom) - (prev.height + current.height) / 2) {
        sub.refer.setState((state) => {
          state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.splice(index - 1, 0, ...state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.splice(index, 1));
        });
      }
      if (next && clone.top + clone.height / 2 > (prev?.bottom || wrap.top) + (current.height + next.height) / 2) {
        sub.refer.setState((state) => {
          state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.splice(index + 1, 0, ...state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.splice(index, 1));
        });
      }
    }
  },
  dragEnd: (): void => {
    if (sub.refer.drag.status === `move`) {
      sub.refer.drag.status = `end`;
      sub.refer.drag.clone!.classList.remove(`edit`);
      sub.refer.drag
        .clone!.animate(
          { top: `${app.refer.getById(`SubItem${sub.refer.drag.id}`).getBoundingClientRect().top}px` },
          { duration: app.refer.duration(), easing: `ease-in-out` },
        )
        .addEventListener(`finish`, function listener() {
          sub.refer.drag.clone!.removeEventListener(`finish`, listener);
          const id = sub.refer.drag.id!;
          sub.refer.setState((state) => {
            delete state.status[id];
          });
          sub.refer.drag.clone!.remove();
          sub.refer.drag = {};
        });
    } else {
      const id = sub.refer.drag.id!;
      sub.refer.setState((state) => {
        delete state.status[id];
      });
      sub.refer.drag = {};
    }
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!sub.refer.swipe.status) {
      sub.refer.swipe.status = `start`;
      sub.refer.swipe.elem = app.refer.getById<HTMLElement>(`SubRoot`);
      sub.refer.swipe.x = arg.x;
      sub.refer.swipe.y = arg.y;
      sub.refer.swipe.right =
        sub.refer.swipe.elem.getBoundingClientRect().left + sub.refer.swipe.elem.getBoundingClientRect().width / 2;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (sub.refer.swipe.status === `start`) {
      if (Math.abs(arg.x - sub.refer.swipe.x!) + Math.abs(arg.y - sub.refer.swipe.y!) > 15) {
        if (Math.abs(arg.x - sub.refer.swipe.x!) > Math.abs(arg.y - sub.refer.swipe.y!)) {
          sub.refer.swipe.status = `move`;
        } else {
          sub.refer.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { x: number }): void => {
    if (sub.refer.swipe.status === `move`) {
      sub.refer.swipe.elem!.style.transform = `translateX(${Math.max(sub.refer.swipe.right! + arg.x - sub.refer.swipe.x!, 0)}px)`;
    }
  },
  swipeEnd: (arg: { x: number }): void => {
    if (sub.refer.swipe.status === `move`) {
      sub.refer.swipe.status = `end`;
      if (sub.refer.swipe.right! + arg.x - sub.refer.swipe.x! > 100) {
        app.handle.routerBack();
        sub.refer.swipe = {};
      } else {
        sub.refer.swipe
          .elem!.animate(
            { transform: `translateX(0px)` },
            { duration: app.refer.duration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            sub.refer.swipe.elem!.removeEventListener(`finish`, listener);
            sub.refer.swipe.elem!.style.transform = `translateX(0px)`;
            sub.refer.swipe = {};
          });
      }
    } else {
      sub.refer.swipe = {};
    }
  },
};

export default { refer, state, render, handle };
