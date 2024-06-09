import * as ReactRouter from 'react-router-dom';
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
  app.handle.setup();
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
