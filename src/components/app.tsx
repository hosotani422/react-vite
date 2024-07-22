import * as ReactRouter from 'react-router-dom';
import * as immer from 'use-immer';
import * as reactI18next from "react-i18next";
import PageList from '@/components/page/list';
import PageMain from '@/components/page/main';
import PageSub from '@/components/page/sub';
import PageConf from '@/components/page/conf';
import PopupCalendar from '@/components/popup/calendar';
import PopupClock from '@/components/popup/clock';
import PopupDialog from '@/components/popup/dialog';
import PopupNotice from '@/components/popup/notice';
import app from "@/stores/page/app";
import list from "@/stores/page/list";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";
import conf from "@/stores/page/conf";
import calendar from "@/stores/popup/calendar";
import clock from "@/stores/popup/clock";
import dialog from "@/stores/popup/dialog";
import notice from "@/stores/popup/notice";

export default (): JSX.Element => {
  [list.state, list.temp.setState] = immer.useImmer<typeof list.state>(list.state);
  [main.state, main.temp.setState] = immer.useImmer<typeof main.state>(main.state);
  [sub.state, sub.temp.setState] = immer.useImmer<typeof sub.state>(sub.state);
  [conf.state, conf.temp.setState] = immer.useImmer<typeof conf.state>(conf.state);
  [calendar.state, calendar.temp.setState] = immer.useImmer<typeof calendar.state>(calendar.state);
  [clock.state, clock.temp.setState] = immer.useImmer<typeof clock.state>(clock.state);
  [dialog.state, dialog.temp.setState] = immer.useImmer<typeof dialog.state>(dialog.state);
  [notice.state, notice.temp.setState] = immer.useImmer<typeof notice.state>(notice.state);
  app.temp.navigate = ReactRouter.useNavigate();
  app.temp.i18next = reactI18next.useTranslation();
  app.handle.init();
  return (
    <>
      <ReactRouter.Routes>
        <ReactRouter.Route path="/:listId" element={<PageMain app={app} list={list} main={main} />}>
          <ReactRouter.Route path="/:listId/list" element={<PageList app={app} list={list} />} />
          <ReactRouter.Route path="/:listId/sub/:mainId" element={<PageSub app={app} main={main} sub={sub} />} />
          <ReactRouter.Route path="/:listId/conf" element={<PageConf app={app} conf={conf} />} />
        </ReactRouter.Route>
      </ReactRouter.Routes>
      <PopupCalendar calendar={calendar} />
      <PopupClock clock={clock} />
      <PopupDialog app={app} dialog={dialog} />
      <PopupNotice notice={notice} />
    </>
  );
};
