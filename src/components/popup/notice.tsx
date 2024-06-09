import InputButton from '@/components/input/button';
import notice from "@/stores/popup/notice";

export default (props: { notice: typeof notice }): JSX.Element | false => {
  return props.notice.state.open && (
    <div
      data-testid="NoticeRoot"
      className="theme-color-back theme-shadow-outer anime-slide-notice absolute inset-x-3 bottom-3 z-[80] flex items-center rounded p-3"
    >
      <div data-testid="NoticeMessage" className="flex-1 text-xs">{ props.notice.state.message }</div>
      <InputButton data-testid="NoticeBack" className="flex-initial text-theme-fine" onClick={() => props.notice.refer.callback()}>
        { props.notice.state.button }
      </InputButton>
    </div>
  )
};
