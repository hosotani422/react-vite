import constant from "@/utils/const";
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";

export const temp: {
  init: boolean;
  navigate: any;
  i18next: any;
} = {
  init: true,
  navigate: {},
  i18next: {},
};

export const render = {
  getTheme: (): string => {
    return conf.state.data.theme;
  },
  getSize: (): string => {
    if (conf.state.data.size === 1) {
      return `text-sm`;
    } else if (conf.state.data.size === 3) {
      return `text-lg`;
    }
    return `text-base`;
  },
  getSpeed: (): string => {
    if (conf.state.data.speed === 1) {
      return `slow`;
    } else if (conf.state.data.speed === 3) {
      return `fast`;
    }
    return `just`;
  },
  getDuration: (): number => {
    if (conf.state.data.speed === 1) {
      return 500;
    } else if (conf.state.data.speed === 3) {
      return 100;
    }
    return 250;
  },
};

export const handle = {
  init: (): void => {
    if (app.temp.init) {
      app.temp.init = false;
      list.handle.init();
      main.handle.init();
      sub.handle.init();
      conf.handle.init();
      handle.clearTrash();
    }
    list.handle.watch();
    main.handle.watch();
    sub.handle.watch();
    conf.handle.watch();
  },
  routerList: (arg: { listId: string }): void => {
    temp.navigate(`/${arg.listId}/list`);
  },
  routerMain: (arg: { listId: string }): void => {
    temp.navigate(`/${arg.listId}`);
  },
  routerSub: (arg: { listId: string, mainId: string }): void => {
    temp.navigate(`/${arg.listId}/sub/${arg.mainId}`);
  },
  routerConf: (arg: { listId: string }): void => {
    temp.navigate(`/${arg.listId}/conf`);
  },
  routerBack: (): void => {
    temp.navigate(-1);
  },
  clearTrash: (): void => {
    const trashId = constant.base.id.trash;
    main.temp.setState((state) => {
      state.data[trashId] = { sort: [], data: {} };
    });
    sub.temp.setState((state) => {
      state.data[trashId] = { data: {} };
    });
  },
};

export default { temp, render, handle };
