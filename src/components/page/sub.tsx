import * as ReactRouter from 'react-router-dom';
import InputTextbox from '@/components/input/textbox';
import InputTextarea from '@/components/input/textarea';
import InputCheck from '@/components/input/check';
import IconDrag from '@/components/icon/drag';
import IconMode from '@/components/icon/mode';
import IconRight from '@/components/icon/right';
import IconTrash from '@/components/icon/trash';
import app from "@/stores/page/app";
import main from "@/stores/page/main";
import sub from "@/stores/page/sub";

export default (props: { app: typeof app, main: typeof main, sub: typeof sub }): JSX.Element => {
  app.refer.params = ReactRouter.useParams();
  return (
    <div
      data-id="SubRoot"
      data-testid="SubRoot"
      className="theme-color-mask anime-slide-sub absolute inset-y-0 right-0 z-10 w-[200%]"
      onTouchMove={(e) => {
        props.sub.handle.dragStart();
        props.sub.handle.dragMove({ y: e.changedTouches[0]!.clientY });
        props.sub.handle.swipeStart({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY });
        props.sub.handle.swipeMove({ x: e.changedTouches[0]!.clientX });
      }}
      onMouseMove={(e) => {
        props.sub.handle.dragStart();
        props.sub.handle.dragMove({ y: e.clientY });
        props.sub.handle.swipeStart({ x: e.clientX, y: e.clientY });
        props.sub.handle.swipeMove({ x: e.clientX });
      }}
      onTouchEnd={(e) => {
        props.sub.handle.dragEnd();
        props.sub.handle.swipeEnd({ x: e.changedTouches[0]!.clientX });
      }}
      onMouseUp={(e) => {
        props.sub.handle.dragEnd();
        props.sub.handle.swipeEnd({ x: e.clientX });
      }}
    >
      <div
        data-testid="SubBack"
        className="absolute inset-y-0 left-0 z-[1] w-[57%]"
        onTouchStart={(e) => props.sub.handle.swipeInit({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY })}
        onMouseDown={(e) => props.sub.handle.swipeInit({ x: e.clientX, y: e.clientY })}
      />
      <div
        data-id="SubHome"
        data-testid="SubHome"
        className="theme-color-grad theme-shadow-outer absolute inset-y-0 right-0 z-[1] flex w-[43%] flex-col"
      >
        <div
          data-testid="SubHead"
          className="theme-color-grad theme-shadow-outer relative z-[9] flex flex-initial items-center gap-3 p-3"
        >
          <IconRight data-testid="SubRight" className="flex-initial" onClick={() => props.app.handle.routerBack()} />
          <InputTextbox
            data-testid="SubTitle"
            className="flex-1 text-xl"
            placeholder={ app.refer.i18next.t(`placeholder.main`) }
            value={ props.main.state.data[app.refer.params.listId].data[app.refer.params.mainId].title }
            onInput={(e) => props.main.handle.inputValue({ mainId: app.refer.params.mainId, type: `title`, value: (e.target as HTMLInputElement).value })}
          />
          <IconMode
            data-testid="SubMode"
            className="flex-initial"
            onClick={() => props.main.handle.inputValue({ mainId: app.refer.params.mainId, type: `task`, value: !props.main.state.data[app.refer.params.listId].data[app.refer.params.mainId].task })}
          />
        </div>
        <div data-testid="SubBody" className="flex-1 overflow-auto p-3">
          { !props.main.state.data[app.refer.params.listId].data[app.refer.params.mainId].task ?
            <InputTextarea
              data-testid="SubMemo"
              className="theme-color-back anime-fade-item size-full"
              placeholder={ app.refer.i18next.t(`placeholder.memo`) }
              value={ props.sub.render.valueMemo() }
              onInput={(e) => props.sub.handle.inputMemo({ value: (e.target as HTMLInputElement).value })}
            />
            :
            <ul data-id="SubBody" className="anime-fade-item">
              { props.sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].sort.map((subId, index) =>
                <li
                  key={subId}
                  data-id={`SubItem${subId}`}
                  data-testid="SubItem"
                  className={`${props.sub.render.classStatus({subId})} theme-color-border theme-color-back trans-select-text trans-edit-item trans-check-item anime-scale-item group relative flex items-start gap-3 overflow-hidden border-b-[0.1rem] border-solid p-3`}
                >
                  <InputCheck
                    data-testid="SubCheck"
                    className="peer/check flex-initial"
                    checked={ props.sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].data[subId!].check }
                    onChange={(e) => props.sub.handle.inputValue({ subId, type: `check`, value: (e.target as HTMLInputElement).checked })}
                  />
                  <InputTextarea
                    data-id={`SubTask${subId}`}
                    data-testid="SubTask"
                    className="peer/text flex-1 !p-0"
                    placeholder={ app.refer.i18next.t(`placeholder.sub`) }
                    sizing="content"
                    value={ props.sub.state.data[app.refer.params.listId].data[app.refer.params.mainId].data[subId!].title }
                    onInput={(e) => props.sub.handle.inputValue({ subId, type: `title`, value: (e.target as HTMLInputElement).value })}
                    onKeyDown={(e) => {
                      if (e.key === `Enter`) {
                        e.preventDefault();
                        props.sub.handle.divideItem({ subId, caret: (e.target as HTMLInputElement).selectionStart! });
                      } else if (e.key === `Backspace` && index > 0 && (e.target as HTMLInputElement).selectionStart === 0 && (e.target as HTMLInputElement).selectionEnd === 0) {
                        e.preventDefault();
                        props.sub.handle.connectItem({ subId });
                      }
                    }}
                  />
                  <IconDrag
                    data-testid="SubDrag"
                    className="flex-initial"
                    onTouchStart={(e) => props.sub.handle.dragInit({ subId, y: e.changedTouches[0]?.clientY })}
                    onMouseDown={(e) => props.sub.handle.dragInit({ subId, y: e.clientY })}
                  />
                  <IconTrash
                    data-testid="SubTrash"
                    className="theme-color-back trans-option-text absolute right-3 translate-x-[150%]"
                    onClick={() => props.sub.handle.deleteItem({ subId })}
                  />
                </li>
              ) }
            </ul>
          }
        </div>
        <div
          data-testid="SubFoot"
          className={`${props.sub.render.classLimit()} theme-color-grad theme-shadow-outer flex flex-initial items-center gap-3 p-3`}
        >
          <InputTextbox
            data-testid="SubCalendar"
            className="w-full flex-1"
            placeholder={ app.refer.i18next.t(`placeholder.date`) }
            value={ props.main.state.data[app.refer.params.listId].data[app.refer.params.mainId].date }
            onClick={() => props.sub.handle.openCalendar()}
            readOnly
          />
          <InputTextbox
            data-testid="SubClock"
            className="w-full flex-1"
            placeholder={ app.refer.i18next.t(`placeholder.time`) }
            value={ props.main.state.data[app.refer.params.listId].data[app.refer.params.mainId].time }
            onClick={() => props.sub.handle.openClock()}
            readOnly
          />
          <InputTextbox
            data-testid="SubDialog"
            className="w-full flex-1"
            placeholder={ app.refer.i18next.t(`placeholder.alarm`) }
            value={ props.sub.render.textAlarm() }
            onClick={() => props.sub.handle.openAlarm()}
            readOnly
          />
        </div>
      </div>
    </div>
  )
};
