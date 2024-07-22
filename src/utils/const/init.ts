import base from "@/utils/const/base";
import listStore from "@/stores/page/list";
import mainStore from "@/stores/page/main";
import subStore from "@/stores/page/sub";
import confStore from "@/stores/page/conf";
import calendarStore from "@/stores/popup/calendar";
import clockStore from "@/stores/popup/clock";
import dialogStore from "@/stores/popup/dialog";
import noticeStore from "@/stores/popup/notice";

export const list: typeof listStore.state.data = {
  sort: [base.id.inbox, base.id.trash],
  data: {
    [base.id.inbox]: { title: `Inbox` },
    [base.id.trash]: { title: `Trash` },
  },
};

export const main: typeof mainStore.state.data = {
  [base.id.inbox]: {
    sort: [base.id.main],
    data: { [base.id.main]: { check: false, title: `サンプル`, date: ``, time: ``, alarm: [], task: true } },
  },
  [base.id.trash]: { sort: [], data: {} },
};

export const sub: typeof subStore.state.data = {
  [base.id.inbox]: {
    data: { [base.id.main]: { sort: [base.id.sub], data: { [base.id.sub]: { check: false, title: `` } } } },
  },
  [base.id.trash]: { data: {} },
};

export const conf: typeof confStore.state.data = {
  size: 2,
  speed: 2,
  theme: `light`,
  lang: `ja`,
  vibrate: `on`,
  save: `local`,
};

export const calendar: typeof calendarStore.state = {
  open: false,
  select: ``,
  current: ``,
  cancel: ``,
  clear: ``,
};

export const clock: typeof clockStore.state = {
  open: false,
  hour: 0,
  minute: 0,
  cancel: ``,
  clear: ``,
  ok: ``,
};

export const dialog: typeof dialogStore.state = {
  open: false,
  init: true,
  mode: `alert`,
  title: ``,
  message: ``,
  text: {
    value: ``,
    placeholder: ``,
    error: ``,
  },
  check: {
    all: false,
    sort: [],
    data: {},
  },
  radio: {
    none: false,
    select: ``,
    sort: [],
    data: {},
  },
  ok: ``,
  cancel: ``,
};

export const notice: typeof noticeStore.state = {
  open: false,
  message: ``,
  button: ``,
};

export default {
  list,
  main,
  sub,
  conf,
  calendar,
  clock,
  dialog,
  notice,
};
