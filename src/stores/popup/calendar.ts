import * as immer from 'use-immer';
import * as datefns from "date-fns";
import app from "@/stores/page/app";
import calendar from "@/stores/popup/calendar";

export const refer: {
  setState: immer.Updater<typeof calendar.state>;
  init: typeof calendar.state;
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
  init: {
    open: false,
    select: ``,
    current: ``,
    cancel: ``,
    clear: ``,
  },
  swipe: {},
  callback: () => ``,
};

export const state: {
  open: boolean;
  select: string;
  current: string;
  cancel: string;
  clear: string;
} = refer.init;

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
    for (const id of app.refer.i18next.t(`calendar.sort`, { returnObjects: true })) {
      week.push(app.refer.i18next.t(`calendar.data.${id}`));
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
  setup: (): void => {
    [calendar.state, calendar.refer.setState] = immer.useImmer<typeof calendar.state>(calendar.state);
  },
  open: (arg: {
    select: typeof state.select;
    cancel: typeof state.cancel;
    clear: typeof state.clear;
    callback: typeof refer.callback;
  }): void => {
    calendar.refer.setState((state) => {
      state.open = true;
      state.select = arg.select;
      state.current = datefns.format(arg.select || new Date(), `yyyy/MM`);
      state.cancel = arg.cancel;
      state.clear = arg.clear;
    });
    calendar.refer.callback = arg.callback;
  },
  close: (): void => {
    calendar.refer.setState((state) => {
      state.open = false;
    });
  },
  pageMove: (arg: { mode: `prev` | `next` }): void => {
    app.refer.getById(`CalendarArea`)
      .animate(
        { transform: `translateX(${arg.mode === `prev` ? `0px` : `-66.666%`})` },
        { duration: app.refer.duration(), easing: `ease-in-out` },
      )
      .addEventListener(`finish`, function listener() {
        app.refer.getById(`CalendarArea`).removeEventListener(`finish`, listener);
        app.refer.getById<HTMLElement>(`CalendarArea`).style.transform = `translateX(-33.333%)`;
        calendar.refer.setState((state) => {
          state.current = datefns.format(datefns.addMonths(state.current, arg.mode === `prev` ? -1 : 1), `yyyy/MM`);
        });
      });
  },
  swipeInit: (arg: { x: number; y: number }): void => {
    if (!calendar.refer.swipe.status) {
      calendar.refer.swipe.status = `start`;
      calendar.refer.swipe.elem = app.refer.getById<HTMLElement>(`CalendarArea`);
      calendar.refer.swipe.x = arg.x;
      calendar.refer.swipe.y = arg.y;
      calendar.refer.swipe.left =
        calendar.refer.swipe.elem.getBoundingClientRect().left -
        app.refer.getById(`CalendarRoot`).children[0]!.getBoundingClientRect().left;
    }
  },
  swipeStart: (arg: { x: number; y: number }): void => {
    if (calendar.refer.swipe.status === `start`) {
      if (Math.abs(arg.x - calendar.refer.swipe.x!) + Math.abs(arg.y - calendar.refer.swipe.y!) > 10) {
        if (Math.abs(arg.x - calendar.refer.swipe.x!) > Math.abs(arg.y - calendar.refer.swipe.y!)) {
          calendar.refer.swipe.status = `move`;
        } else {
          calendar.refer.swipe = {};
        }
      }
    }
  },
  swipeMove: (arg: { x: number }): void => {
    if (calendar.refer.swipe.status === `move`) {
      calendar.refer.swipe.elem!.style.transform = `translateX(${calendar.refer.swipe.left! + arg.x - calendar.refer.swipe.x!}px)`;
    }
  },
  swipeEnd: (arg: { x: number }): void => {
    if (calendar.refer.swipe.status === `move`) {
      calendar.refer.swipe.status = `end`;
      if (Math.abs(arg.x - calendar.refer.swipe.x!) >= 75) {
        calendar.handle.pageMove({ mode: arg.x - calendar.refer.swipe.x! > 0 ? `prev` : `next` });
        calendar.refer.swipe = {};
      } else {
        calendar.refer.swipe
          .elem!.animate(
            { transform: `translateX(-33.333%)` },
            { duration: app.refer.duration(), easing: `ease-in-out` },
          )
          .addEventListener(`finish`, function listener() {
            calendar.refer.swipe.elem!.removeEventListener(`finish`, listener);
            calendar.refer.swipe.elem!.style.transform = `translateX(-33.333%)`;
            calendar.refer.swipe = {};
          });
      }
    } else {
      calendar.refer.swipe = {};
    }
  },
};

export default { refer, state, render, handle };
