import * as immer from 'use-immer';
import * as datefns from "date-fns";
import Util from "@/utils/base/util";
import constant from "@/utils/const";
import app from "@/stores/page/app";
import calendar from "@/stores/popup/calendar";

export const temp: {
  setState: immer.Updater<typeof calendar.state>;
  swipe: {
    status?: `start` | `move` | `end`;
    elem?: HTMLElement;
    x?: number;
    y?: number;
    left?: number;
  };
  callback: (date: string) => void;
} = {
  setState: () => {},
  swipe: {},
  callback: () => ``,
};

export const state: {
  open: boolean;
  select: string;
  current: string;
  cancel: string;
  clear: string;
} = constant.init.calendar;

export const render = {
  classStatus: (arg: { month: string, day: string }): string => {
    const classStatus: string[] = [];
    arg.day === calendar.state.select && classStatus.push(`select`);
    arg.day === datefns.format(new Date(), `yyyy/MM/dd`) && classStatus.push(`today`);
    arg.month !== datefns.format(arg.day, `yyyy/MM`) && classStatus.push(`hide`);
    return classStatus.join(` `);
  },
  getWeek: (): string[] => {
    const week: ReturnType<typeof render.getWeek> = [];
    for (const id of app.temp.i18next.t(`calendar.sort`, { returnObjects: true })) {
      week.push(app.temp.i18next.t(`calendar.data.${id}`));
    }
    return week;
  },
  getDay: (): { id: string; day: { id: string; text: string }[] }[] => {
    const month: ReturnType<typeof render.getDay> = [];
    for (
      let curMonth = datefns.subMonths(calendar.state.current, 1), limMonth = datefns.addMonths(calendar.state.current, 2);
      datefns.isBefore(curMonth, limMonth);
      curMonth = datefns.addMonths(curMonth, 1)
    ) {
      const day: (typeof month)[number][`day`] = [];
      for (
        let curDay = datefns.subDays(datefns.setDate(curMonth, 1), datefns.getDay(datefns.setDate(curMonth, 1))),
          limDay = datefns.setDate(datefns.addMonths(curMonth, 1), 1);
        datefns.isBefore(curDay, limDay);
        curDay = datefns.addDays(curDay, 1)
      ) {
        day.push({ id: datefns.format(curDay, `yyyy/MM/dd`), text: datefns.format(curDay, `d`) });
      }
      month.push({ id: datefns.format(curMonth, `yyyy/MM`), day });
    }
    return month;
  },
};

export const handle = {
  open: (arg: {
    select: typeof state.select;
    cancel: typeof state.cancel;
    clear: typeof state.clear;
    callback: typeof temp.callback;
  }): void => {
    calendar.temp.setState((state) => {
      state.open = true;
      state.select = arg.select;
      state.current = datefns.format(arg.select || new Date(), `yyyy/MM`);
      state.cancel = arg.cancel;
      state.clear = arg.clear;
    });
    calendar.temp.callback = arg.callback;
  },
  close: (): void => {
    calendar.temp.setState((state) => {
      state.open = false;
    });
  },
  pageMove: (arg: { mode: `prev` | `next` }): void => {
    Util.getById(`CalendarArea`)
      .animate(
        { transform: `translateX(${arg.mode === `prev` ? `0px` : `-66.666%`})` },
        { duration: app.render.getDuration(), easing: `ease-in-out` },
      )
      .addEventListener(`finish`, function listener() {
        Util.getById(`CalendarArea`).removeEventListener(`finish`, listener);
        Util.getById<HTMLElement>(`CalendarArea`).style.transform = `translateX(-33.333%)`;
        calendar.temp.setState((state) => {
          state.current = datefns.format(datefns.addMonths(state.current, arg.mode === `prev` ? -1 : 1), `yyyy/MM`);
        });
      });
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!calendar.temp.swipe.status) {
      calendar.temp.swipe.status = `start`;
      calendar.temp.swipe.elem = Util.getById<HTMLElement>(`CalendarArea`);
      calendar.temp.swipe.x = arg.x;
      calendar.temp.swipe.y = arg.y;
      calendar.temp.swipe.left =
        calendar.temp.swipe.elem.getBoundingClientRect().left -
        Util.getById(`CalendarRoot`).children[0]!.getBoundingClientRect().left;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (calendar.temp.swipe.status === `start`) {
      if (Math.abs(arg.x - calendar.temp.swipe.x!) + Math.abs(arg.y - calendar.temp.swipe.y!) > 10) {
        if (Math.abs(arg.x - calendar.temp.swipe.x!) > Math.abs(arg.y - calendar.temp.swipe.y!)) {
          calendar.temp.swipe.status = `move`;
        } else {
          calendar.temp.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { x: number }): void => {
    if (calendar.temp.swipe.status === `move`) {
      calendar.temp.swipe.elem!.style.transform = `translateX(${calendar.temp.swipe.left! + arg.x - calendar.temp.swipe.x!}px)`;
    }
  },
  swipeEnd: (arg: { x: number }): void => {
    if (calendar.temp.swipe.status === `move`) {
      calendar.temp.swipe.status = `end`;
      if (Math.abs(arg.x - calendar.temp.swipe.x!) >= 75) {
        calendar.handle.pageMove({ mode: arg.x - calendar.temp.swipe.x! > 0 ? `prev` : `next` });
        calendar.temp.swipe = {};
      } else {
        calendar.temp.swipe
          .elem!.animate(
            { transform: `translateX(-33.333%)` },
            { duration: app.render.getDuration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            calendar.temp.swipe.elem!.removeEventListener(`finish`, listener);
            calendar.temp.swipe.elem!.style.transform = `translateX(-33.333%)`;
            calendar.temp.swipe = {};
          });
      }
    } else {
      calendar.temp.swipe = {};
    }
  },
};

export default { temp, state, render, handle };
