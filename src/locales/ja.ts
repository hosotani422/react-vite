const ja = {
  button: {
    cancel: `キャンセル`,
    clear: `クリア`,
    ok: `決定`,
  },
  placeholder: {
    list: `リスト`,
    main: `タスク`,
    sub: `サブタスク`,
    memo: `メモ`,
    date: `日付`,
    time: `時刻`,
    alarm: `アラーム`,
  },
  validation: {
    empty: `空白以外の文字を１つ以上入力してください。`,
  },
  conf: {
    title: `設定`,
    size: {
      title: `文字サイズ`,
      value: {
        "1": `小`,
        "2": `中`,
        "3": `大`,
      },
    },
    speed: {
      title: `アニメ速度`,
      value: {
        "1": `低`,
        "2": `中`,
        "3": `高`,
      },
    },
    vibrate: {
      title: `振動`,
      value: {
        off: `無`,
        on: `有`,
      },
    },
    theme: {
      title: `テーマ`,
      value: {
        light: `明`,
        dark: `暗`,
      },
    },
    lang: {
      title: `言語`,
      value: {
        en: `英語`,
        ja: `日本語`,
      },
    },
    save: {
      title: `自動保存`,
      value: {
        local: `LOCAL`,
        rest: `REST`,
        gql: `GQL`,
      },
    },
    backup: {
      title: `保存ファイル`,
      download: `保存`,
      upload: `復元`,
    },
    reset: {
      title: `初期化`,
      conf: `設定`,
      list: `メモ`,
    },
  },
  calendar: {
    sort: [`1`, `2`, `3`, `4`, `5`, `6`, `7`],
    data: {
      1: `日`,
      2: `月`,
      3: `火`,
      4: `水`,
      5: `木`,
      6: `金`,
      7: `土`,
    },
  },
  dialog: {
    title: {
      entry: `新規登録`,
      move: `移動先の選択`,
      delete: `本当に削除しますか`,
      reset: `本当にリセットしますか`,
      alarm: `通知タイミングの選択`,
      error: `ファイルの形式が違います`,
    },
    select: {
      all: `全選択`,
      none: `未選択`,
    },
    alarm: {
      sort: [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`],
      data: {
        1: { label: `時刻通り`, value: 0 },
        2: { label: `5分前`, value: 5 },
        3: { label: `10分前`, value: 10 },
        4: { label: `15分前`, value: 15 },
        5: { label: `30分前`, value: 30 },
        6: { label: `1時間前`, value: 60 },
        7: { label: `2時間前`, value: 120 },
        8: { label: `3時間前`, value: 180 },
        9: { label: `6時間前`, value: 360 },
        10: { label: `12時間前`, value: 720 },
        11: { label: `1日前`, value: 1440 },
        12: { label: `2日前`, value: 2880 },
      },
    },
  },
  notice: {
    message: `削除が完了しました`,
    button: `元に戻す`,
  },
};

export default ja;
