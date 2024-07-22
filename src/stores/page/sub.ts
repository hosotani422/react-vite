import React from 'react';
import * as immer from 'use-immer';
import * as datefns from "date-fns";
import lodash from 'lodash';
import Util from "@/utils/base/util";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

export const temp: {
  setState: immer.Updater<typeof sub.state>;
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
  data: constant.init.sub,
  status: {},
};

export const render = {
  valueMemo: (arg: { listId: string, mainId: string }): string => {
    const valueMemo: string[] = [];
    for (const subId of sub.state.data[arg.listId].data[arg.mainId].sort) {
      valueMemo.push(sub.state.data[arg.listId].data[arg.mainId].data[subId].title);
    }
    return valueMemo.join(`\n`);
  },
  classStatus: (arg: { subId: string }): string => {
    const classStatus: string[] = [];
    sub.state.status[arg.subId] === `edit` && classStatus.push(`edit`);
    sub.state.status[arg.subId] === `hide` && classStatus.push(`hide`);
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
  textAlarm: (arg: { listId: string, mainId: string }): string => {
    const textAlarm: string[] = [];
    for (const alarmId of main.state.data[arg.listId].data[arg.mainId].alarm) {
      textAlarm.push(app.temp.i18next.t(`dialog.alarm.data.${alarmId}.label`));
    }
    return textAlarm.join(`,`);
  },
};

export const handle = {
  init: (): void => {
    sub.temp.setState((state) => {
      state.data = JSON.parse(localStorage.getItem(`sub`)!) || constant.init.sub;
    });
  },
  watch: (): void => {
    React.useEffect(() => {
      localStorage.setItem(`sub`, JSON.stringify(sub.state.data));
    }, [sub.state.data]);
  },
  inputValue: (arg: { listId: string, mainId: string, subId: string, type: `title` | `check`, value: string | boolean }): void => {
    sub.temp.setState((state) => {
      if (arg.type === `title`) {
        state.data[arg.listId].data[arg.mainId].data[arg.subId][arg.type] = arg.value as string;
      } else if (arg.type === `check`) {
        state.data[arg.listId].data[arg.mainId].data[arg.subId][arg.type] = arg.value as boolean;
      }
    });
  },
  inputMemo: (arg: { listId: string, mainId: string, value: string }): void => {
    const subId = new Date().valueOf();
    sub.temp.setState((state) => {
      state.data[arg.listId].data[arg.mainId].sort = [];
      state.data[arg.listId].data[arg.mainId].data = {};
      for (const [i, title] of arg.value.split(`\n`).entries()) {
        state.data[arg.listId].data[arg.mainId].sort.push(`sub${subId + i}`);
        state.data[arg.listId].data[arg.mainId].data[`sub${subId + i}`] = { check: false, title };
      }
    });
  },
  divideItem: async (arg: { listId: string, mainId: string, subId: string, caret: number }): Promise<void> => {
    const subId = `sub${new Date().valueOf()}`;
    const title = sub.state.data[arg.listId].data[arg.mainId].data[arg.subId].title;
    await sub.temp.setState((state) => {
      state.data[arg.listId].data[arg.mainId].sort.splice(sub.state.data[arg.listId].data[arg.mainId].sort.indexOf(arg.subId) + 1, 0, subId);
      state.data[arg.listId].data[arg.mainId].data[arg.subId].title = title.slice(0, arg.caret);
      state.data[arg.listId].data[arg.mainId].data[subId] = { check: false, title: title.slice(arg.caret) };
    });
    const elem = Util.getById<HTMLInputElement>(`SubTask${subId}`);
    elem.focus();
    elem.selectionStart = 0;
    elem.selectionEnd = 0;
  },
  connectItem: async (arg: { listId: string, mainId: string, subId: string }): Promise<void> => {
    const subId = sub.state.data[arg.listId].data[arg.mainId].sort[sub.state.data[arg.listId].data[arg.mainId].sort.indexOf(arg.subId) - 1]!;
    const caret = sub.state.data[arg.listId].data[arg.mainId].data[subId].title.length;
    await sub.temp.setState((state) => {
      state.data[arg.listId].data[arg.mainId].sort.splice(state.data[arg.listId].data[arg.mainId].sort.indexOf(arg.subId), 1);
      state.data[arg.listId].data[arg.mainId].data[subId].title += state.data[arg.listId].data[arg.mainId].data[arg.subId].title;
      delete state.data[arg.listId].data[arg.mainId].data[arg.subId];
      delete state.status[arg.subId];
    });
    const elem = Util.getById<HTMLInputElement>(`SubTask${subId}`);
    elem.focus();
    elem.selectionStart = caret;
    elem.selectionEnd = caret;
  },
  deleteItem: (arg: { listId: string, mainId: string, subId: string }): void => {
    const backup = lodash.cloneDeep(sub.state.data);
    sub.temp.setState((state) => {
      state.data[arg.listId].data[arg.mainId].sort.splice(state.data[arg.listId].data[arg.mainId].sort.indexOf(arg.subId), 1);
      delete state.data[arg.listId].data[arg.mainId].data[arg.subId];
      delete state.status[arg.subId];
    });
    notice.handle.open({
      message: app.temp.i18next.t(`notice.message`),
      button: app.temp.i18next.t(`notice.button`),
      callback: () => {
        sub.temp.setState((state) => {
          state.data = backup;
        });
        notice.handle.close();
      },
    });
  },
  openCalendar: (arg: { listId: string, mainId: string }): void => {
    calendar.handle.open({
      select: main.state.data[arg.listId].data[arg.mainId].date,
      cancel: app.temp.i18next.t(`button.cancel`),
      clear: app.temp.i18next.t(`button.clear`),
      callback: (date) => {
        main.temp.setState((state) => {
          state.data[arg.listId].data[arg.mainId].date = date;
        });
        calendar.handle.close();
      },
    });
  },
  openClock: (arg: { listId: string, mainId: string }): void => {
    clock.handle.open({
      time: datefns.format(`2000/1/1 ${main.state.data[arg.listId].data[arg.mainId].time || `00:00`}`, `HH:mm`),
      cancel: app.temp.i18next.t(`button.cancel`),
      clear: app.temp.i18next.t(`button.clear`),
      ok: app.temp.i18next.t(`button.ok`),
      callback: (args) => {
        main.temp.setState((state) => {
          state.data[arg.listId].data[arg.mainId].time = args ? datefns.format(`2000/1/1 ${args.hour}:${args.minute}`, `HH:mm`) : ``;
        });
        clock.handle.close();
      },
    });
  },
  openAlarm: (arg: { listId: string, mainId: string }): void => {
    dialog.handle.open({
      mode: `check`,
      title: app.temp.i18next.t(`dialog.title.alarm`),
      message: ``,
      check: {
        all: true,
        sort: app.temp.i18next.t(`dialog.alarm.sort`, { returnObjects: true }),
        data: (() => {
          const data: (typeof dialog)[`state`][`check`][`data`] = {};
          for (const id of app.temp.i18next.t(`dialog.alarm.sort`, { returnObjects: true })) {
            data[id] = {
              check: main.state.data[arg.listId].data[arg.mainId].alarm.includes(id),
              title: app.temp.i18next.t(`dialog.alarm.data.${id}.label`),
            };
          }
          return data;
        })(),
      },
      ok: app.temp.i18next.t(`button.ok`),
      cancel: app.temp.i18next.t(`button.cancel`),
      callback: {
        ok: () => {
          main.temp.setState((state) => {
            state.data[arg.listId].data[arg.mainId].alarm = [];
            for (const id of dialog.state.check.sort) {
              if (dialog.state.check.data[id].check) {
                state.data[arg.listId].data[arg.mainId].alarm.push(id);
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
    if (!sub.temp.drag.status) {
      const item = Util.getById(`SubItem${arg.subId}`).getBoundingClientRect();
      sub.temp.drag.status = `start`;
      sub.temp.drag.id = arg.subId;
      sub.temp.drag.y = arg.y;
      sub.temp.drag.top = item.top;
      sub.temp.drag.left = item.left - Util.getById(`SubHome`).getBoundingClientRect().left;
      sub.temp.drag.height = item.height;
      sub.temp.drag.width = item.width;
      sub.temp.setState((state) => {
        state.status[arg.subId] = `edit`;
      });
      conf.state.data.vibrate === `on` && navigator.vibrate(40);
    }
  },
  dragStart: (): void => {
    if (sub.temp.drag.status === `start`) {
      sub.temp.drag.status = `move`;
      sub.temp.drag.clone = Util.getById(`SubItem${sub.temp.drag.id}`).cloneNode(true) as HTMLElement;
      sub.temp.drag.clone.removeAttribute(`data-id`);
      sub.temp.drag.clone.style.position = `absolute`;
      sub.temp.drag.clone.style.zIndex = `1`;
      sub.temp.drag.clone.style.top = `${sub.temp.drag.top}px`;
      sub.temp.drag.clone.style.left = `${sub.temp.drag.left}px`;
      sub.temp.drag.clone.style.height = `${sub.temp.drag.height}px`;
      sub.temp.drag.clone.style.width = `${sub.temp.drag.width}px`;
      Util.getById(`SubBody`).appendChild(sub.temp.drag.clone);
      sub.temp.setState((state) => {
        state.status[sub.temp.drag.id!] = `hide`;
      });
    }
  },
  dragMove: (arg: { listId: string, mainId: string, y: number }): void => {
    if (sub.temp.drag.status === `move`) {
      sub.temp.drag.clone!.style.top = `${sub.temp.drag.top! + arg.y - sub.temp.drag.y!}px`;
      const index = sub.state.data[arg.listId].data[arg.mainId].sort.indexOf(sub.temp.drag.id!);
      const clone = sub.temp.drag.clone!.getBoundingClientRect();
      const wrap = Util.getById(`SubBody`).getBoundingClientRect();
      const prev = Util.getById(`SubItem${sub.state.data[arg.listId].data[arg.mainId].sort[index - 1]}`)?.getBoundingClientRect();
      const current = Util.getById(`SubItem${sub.state.data[arg.listId].data[arg.mainId].sort[index]}`).getBoundingClientRect();
      const next = Util.getById(`SubItem${sub.state.data[arg.listId].data[arg.mainId].sort[index + 1]}`)?.getBoundingClientRect();
      if (prev && clone.top + clone.height / 2 < (next?.top || wrap.bottom) - (prev.height + current.height) / 2) {
        sub.temp.setState((state) => {
          state.data[arg.listId].data[arg.mainId].sort.splice(index - 1, 0, ...state.data[arg.listId].data[arg.mainId].sort.splice(index, 1));
        });
      }
      if (next && clone.top + clone.height / 2 > (prev?.bottom || wrap.top) + (current.height + next.height) / 2) {
        sub.temp.setState((state) => {
          state.data[arg.listId].data[arg.mainId].sort.splice(index + 1, 0, ...state.data[arg.listId].data[arg.mainId].sort.splice(index, 1));
        });
      }
    }
  },
  dragEnd: (): void => {
    if (sub.temp.drag.status === `move`) {
      sub.temp.drag.status = `end`;
      sub.temp.drag.clone!.classList.remove(`edit`);
      sub.temp.drag
        .clone!.animate(
          { top: `${Util.getById(`SubItem${sub.temp.drag.id}`).getBoundingClientRect().top}px` },
          { duration: app.render.getDuration(), easing: `ease-in-out` },
        )
        .addEventListener(`finish`, function listener() {
          sub.temp.drag.clone!.removeEventListener(`finish`, listener);
          const id = sub.temp.drag.id!;
          sub.temp.setState((state) => {
            delete state.status[id];
          });
          sub.temp.drag.clone!.remove();
          sub.temp.drag = {};
        });
    } else {
      const id = sub.temp.drag.id!;
      sub.temp.setState((state) => {
        delete state.status[id];
      });
      sub.temp.drag = {};
    }
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!sub.temp.swipe.status) {
      sub.temp.swipe.status = `start`;
      sub.temp.swipe.elem = Util.getById<HTMLElement>(`SubRoot`);
      sub.temp.swipe.x = arg.x;
      sub.temp.swipe.y = arg.y;
      sub.temp.swipe.right =
        sub.temp.swipe.elem.getBoundingClientRect().left + sub.temp.swipe.elem.getBoundingClientRect().width / 2;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (sub.temp.swipe.status === `start`) {
      if (Math.abs(arg.x - sub.temp.swipe.x!) + Math.abs(arg.y - sub.temp.swipe.y!) > 15) {
        if (Math.abs(arg.x - sub.temp.swipe.x!) > Math.abs(arg.y - sub.temp.swipe.y!)) {
          sub.temp.swipe.status = `move`;
        } else {
          sub.temp.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { x: number }): void => {
    if (sub.temp.swipe.status === `move`) {
      sub.temp.swipe.elem!.style.transform = `translateX(${Math.max(sub.temp.swipe.right! + arg.x - sub.temp.swipe.x!, 0)}px)`;
    }
  },
  swipeEnd: (arg: { x: number }): void => {
    if (sub.temp.swipe.status === `move`) {
      sub.temp.swipe.status = `end`;
      if (sub.temp.swipe.right! + arg.x - sub.temp.swipe.x! > 100) {
        app.handle.routerBack();
        sub.temp.swipe = {};
      } else {
        sub.temp.swipe
          .elem!.animate(
            { transform: `translateX(0px)` },
            { duration: app.render.getDuration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            sub.temp.swipe.elem!.removeEventListener(`finish`, listener);
            sub.temp.swipe.elem!.style.transform = `translateX(0px)`;
            sub.temp.swipe = {};
          });
      }
    } else {
      sub.temp.swipe = {};
    }
  },
};

export default { temp, state, render, handle };
