import BasePopup from '@/components/base/popup';
import InputButton from '@/components/input/button';
import IconPrev from '@/components/icon/prev';
import IconNext from '@/components/icon/next';
import calendar from "@/stores/popup/calendar";

export default (props: { calendar: typeof calendar }): JSX.Element => {
  return (
    <BasePopup
      data-id="CalendarRoot"
      data-testid="CalendarRoot"
      open={props.calendar.state.open}
      onTouchMove={(e) => {
        props.calendar.handle.swipeStart({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY });
        props.calendar.handle.swipeMove({ x: e.changedTouches[0]!.clientX });
      }}
      onMouseMove={(e) => {
        props.calendar.handle.swipeStart({ x: e.clientX, y: e.clientY });
        props.calendar.handle.swipeMove({ x: e.clientX });
      }}
      onTouchEnd={(e) => props.calendar.handle.swipeEnd({ x: e.changedTouches[0]!.clientX })}
      onMouseUp={(e) => props.calendar.handle.swipeEnd({ x: e.clientX })}
    >
      <div className="flex flex-initial flex-col gap-3">
        <div className="flex flex-initial items-center">
          <IconPrev data-testid="CalendarPrev" className="flex-initial" onClick={() => props.calendar.handle.pageMove({ mode: `prev` })} />
          <p data-testid="CalendarCurrent" className="flex-1 text-center">{ props.calendar.state.current }</p>
          <IconNext data-testid="CalendarNext" className="flex-initial" onClick={() => props.calendar.handle.pageMove({ mode: `next` })} />
        </div>
        <ul className="flex flex-initial">
          { props.calendar.render.getWeek().map((week) =>
            <li
              key={week}
              data-testid="CalendarWeek"
              className="flex-1 text-center text-xs"
            >
              { week }
            </li>
          ) }
        </ul>
      </div>
      <div data-id="CalendarBody" className="flex-initial overflow-x-hidden">
        <div
          data-id="CalendarArea"
          data-testid="CalendarArea"
          className="trans-slide-calendar flex h-64 w-[300%] translate-x-[-33.33%]"
          onTouchStart={(e) => props.calendar.handle.swipeInit({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY })}
          onMouseDown={(e) => props.calendar.handle.swipeInit({ x: e.clientX, y: e.clientY })}
        >
          { props.calendar.render.getDay().map((month) =>
            <ul
              key={month.id}
              data-testid="CalendarMonth"
              className="flex flex-1 flex-wrap"
            >
              { month.day.map((day) =>
                <li
                  key={day.id}
                  data-testid="CalendarDay"
                  className={`${props.calendar.render.classStatus({ month: month.id, day: day.id })} flex flex-[0_0_14.285%] items-center justify-center border-[0.1rem] border-solid border-transparent [&.hide]:invisible [&.select]:!border-theme-fine [&.today]:text-theme-fine`}
                  onClick={() => props.calendar.refer.callback(day.id)}
                >
                  { day.text }
                </li>
              ) }
            </ul>
          ) }
        </div>
      </div>
      <div className="flex flex-initial justify-end gap-3">
        <InputButton data-testid="CalendarCancel" className="flex-initial text-theme-fine" onClick={() => props.calendar.handle.close()}>
          { props.calendar.state.cancel }
        </InputButton>
        <InputButton data-testid="CalendarClear" className="flex-initial text-theme-warn" onClick={() => props.calendar.refer.callback(``)}>
          { props.calendar.state.clear }
        </InputButton>
      </div>
    </BasePopup>
  )
};
