import BasePopup from '@/components/base/popup';
import InputButton from '@/components/input/button';
import clock from "@/stores/popup/clock";

export default (props: { clock: typeof clock }): JSX.Element => {
  return (
    <BasePopup data-testid="ClockRoot" open={props.clock.state.open} max={true}>
      <div className="flex flex-1 flex-col items-center gap-3">
        <canvas
          data-id="ClockHour"
          data-testid="ClockHour"
          className="aspect-square flex-1"
          onTouchStart={(e) => props.clock.handle.inputValue({ type: `hour`, x: e.touches[0]!.pageX, y: e.touches[0]!.pageY })}
          onTouchMove={(e) => props.clock.handle.inputValue({ type: `hour`, x: e.touches[0]!.pageX, y: e.touches[0]!.pageY })}
          onMouseDown={(e) => props.clock.handle.inputValue({ type: `hour`, x: e.pageX, y: e.pageY })}
          onMouseMove={(e) => props.clock.handle.inputValue({ type: `hour`, x: e.pageX, y: e.pageY })}
        />
        <canvas
          data-id="ClockMinute"
          data-testid="ClockMinute"
          className="flex-1"
          onTouchStart={(e) => props.clock.handle.inputValue({ type: `minute`, x: e.touches[0]!.pageX, y: e.touches[0]!.pageY })}
          onTouchMove={(e) => props.clock.handle.inputValue({ type: `minute`, x: e.touches[0]!.pageX, y: e.touches[0]!.pageY })}
          onMouseDown={(e) => props.clock.handle.inputValue({ type: `minute`, x: e.pageX, y: e.pageY })}
          onMouseMove={(e) => props.clock.handle.inputValue({ type: `minute`, x: e.pageX, y: e.pageY })}
        />
      </div>
      <div className="flex flex-initial items-center justify-end gap-3">
        <InputButton data-testid="ClockCancel" className="flex-initial text-theme-fine" onClick={() => props.clock.handle.close()}>
          { props.clock.state.cancel }</InputButton
        >
        <InputButton data-testid="ClockClear" className="flex-initial text-theme-warn" onClick={() => props.clock.refer.callback()}>
          { props.clock.state.clear }</InputButton
        >
        <InputButton
          data-testid="ClockOk"
          className="flex-initial text-theme-warn"
          onClick={() => props.clock.refer.callback({ hour: props.clock.state.hour, minute: props.clock.state.minute })}
        >
          { props.clock.state.ok }</InputButton
        >
      </div>
    </BasePopup>
  )
};
