import ja from "@/locales/ja";

const en: typeof ja = {
  button: {
    cancel: `Cancel`,
    clear: `Clear`,
    ok: `OK`,
  },
  placeholder: {
    list: `list`,
    main: `task`,
    sub: `subtask`,
    memo: `memo`,
    date: `date`,
    time: `time`,
    alarm: `alarm`,
  },
  validation: {
    empty: `Please enter one or more non-blank strings.`,
  },
  conf: {
    title: `Configuration`,
    size: {
      title: `Font size`,
      value: {
        "1": `S`,
        "2": `M`,
        "3": `L`,
      },
    },
    speed: {
      title: `Anime speed`,
      value: {
        "1": `S`,
        "2": `N`,
        "3": `F`,
      },
    },
    vibrate: {
      title: `Vibrate`,
      value: {
        off: `off`,
        on: `on`,
      },
    },
    theme: {
      title: `Theme`,
      value: {
        light: `Light`,
        dark: `Dark`,
      },
    },
    lang: {
      title: `Language`,
      value: {
        en: `English`,
        ja: `Japanese`,
      },
    },
    save: {
      title: `AutoSave`,
      value: {
        local: `LOCAL`,
        rest: `REST`,
        gql: `GQL`,
      },
    },
    backup: {
      title: `SaveFile`,
      download: `Download`,
      upload: `Upload`,
    },
    reset: {
      title: `Reset`,
      conf: `Config`,
      list: `Memo`,
    },
  },
  calendar: {
    sort: [`1`, `2`, `3`, `4`, `5`, `6`, `7`],
    data: {
      1: `Sun`,
      2: `Mon`,
      3: `Tue`,
      4: `Wed`,
      5: `Thu`,
      6: `Fri`,
      7: `Sat`,
    },
  },
  dialog: {
    title: {
      entry: `Sign up`,
      move: `Destination selection`,
      delete: `Do you really want to delete this`,
      reset: `Do you really want to reset`,
      alarm: `Selection of notification timing`,
      error: `File format is different`,
    },
    select: {
      all: `Select all`,
      none: `Unselected`,
    },
    alarm: {
      sort: [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`],
      data: {
        1: { label: `On time`, value: 0 },
        2: { label: `5 minutes ago`, value: 5 },
        3: { label: `10 minutes ago`, value: 10 },
        4: { label: `15 minutes ago`, value: 15 },
        5: { label: `30 minutes ago`, value: 30 },
        6: { label: `1 hour ago`, value: 60 },
        7: { label: `2 hour ago`, value: 120 },
        8: { label: `3 hour ago`, value: 180 },
        9: { label: `6 hour ago`, value: 360 },
        10: { label: `12 hour ago`, value: 720 },
        11: { label: `1 day ago`, value: 1440 },
        12: { label: `2 day ago`, value: 2880 },
      },
    },
  },
  notice: {
    message: `The deletion is complete`,
    button: `Restore`,
  },
};

export default en;
