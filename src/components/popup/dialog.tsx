import BasePopup from '@/components/base/popup';
import InputTextbox from '@/components/input/textbox';
import InputCheck from '@/components/input/check';
import InputRadio from '@/components/input/radio';
import InputButton from '@/components/input/button';
import app from "@/stores/page/app";
import dialog from "@/stores/popup/dialog";

export default (props: { app: typeof app, dialog: typeof dialog }): JSX.Element => {
  return (
    <BasePopup data-testid="DialogRoot" open={props.dialog.state.open}>
      <div
        data-testid="DialogRoot"
        className="theme-color-mask anime-fade-item absolute inset-0 z-[70] flex items-center justify-center"
      >
        <div className="theme-color-back theme-shadow-outer flex max-h-[80%] w-4/5 flex-col gap-3 rounded p-3">
          { props.dialog.state.title &&
            <div data-testid="DialogTitle" className="flex-initial whitespace-pre-line">{ props.dialog.state.title }</div>
          }
          <div className="flex flex-1 flex-col gap-3 overflow-auto">
            { props.dialog.state.message &&
              <div data-testid="DialogMessage" className="flex-initial whitespace-pre-line break-all">{ props.dialog.state.message }</div>
            }
            { props.dialog.state.mode === `text` &&
              <InputTextbox
                data-id="DialogText"
                data-testid="DialogText"
                className="flex-initial border-b-[0.1rem] border-solid border-b-theme-fine"
                placeholder={props.dialog.state.text.placeholder}
                value={props.dialog.state.text.value}
                onInput={(e) => props.dialog.handle.inputValue({ type: `text`, value: (e.target as HTMLInputElement).value })}
              />
            }
            { props.dialog.state.mode === `check` && props.dialog.state.check.all &&
              <InputCheck
                data-testid="DialogCheckAll"
                className="flex-initial"
                checked={props.dialog.render.stateCheckAll()}
                onChange={(e) => props.dialog.handle.changeCheckAll({ value: (e.target as HTMLInputElement).checked })}
                >{ app.refer.i18next.t(`dialog.select.all`) }</InputCheck
              >
            }
            { props.dialog.state.mode === `check` && props.dialog.state.check.sort.map((checkId) =>
              <InputCheck
                key={checkId}
                data-testid="DialogCheck"
                className="flex-initial"
                checked={ props.dialog.state.check.data[checkId].check }
                onChange={(e) => props.dialog.handle.inputValue({ type: `check`, id: checkId, value: (e.target as HTMLInputElement).checked })}
                >{ props.dialog.state.check.data[checkId].title }</InputCheck
              >
            ) }
            { props.dialog.state.mode === `radio` && props.dialog.state.radio.none &&
              <InputRadio
                data-testid="DialogRadioNone"
                className="flex-initial"
                value=""
                checked={ props.dialog.state.radio.select }
                onChange={(e) => props.dialog.handle.inputValue({ type: `radio`, value: (e.target as HTMLInputElement).value })}
                >{ app.refer.i18next.t(`dialog.select.none`) }</InputRadio
              >
            }
            { props.dialog.state.mode === `radio` && props.dialog.state.radio.sort.map((radioId) =>
              <InputRadio
                key={radioId}
                data-testid="DialogRadio"
                className="flex-initial"
                value={ radioId }
                checked={ props.dialog.state.radio.select }
                onChange={(e) => props.dialog.handle.inputValue({ type: `radio`, value: (e.target as HTMLInputElement).value })}
                >{ props.dialog.state.radio.data[radioId].title }</InputRadio
              >
            ) }
          </div>
          { !props.dialog.state.init && props.dialog.handle.errorValidation() &&
            <div data-testid="DialogError" className="flex-initial text-theme-warn">
              { props.dialog.handle.errorValidation() }
            </div>
          }
          <div className="flex flex-initial items-center justify-end gap-3">
            <InputButton data-testid="DialogCancel" className="flex-initial text-theme-fine" onClick={() => props.dialog.refer.callback.cancel!()}>
              { props.dialog.state.cancel }
            </InputButton>
            { props.dialog.state.mode !== `alert` &&
              <InputButton
                data-testid="DialogOk"
                className="flex-initial text-theme-warn"
                onClick={() => props.dialog.refer.callback.ok!()}
                disabled={ !!props.dialog.handle.errorValidation() }
                >{ props.dialog.state.ok }</InputButton
              >
            }
          </div>
        </div>
      </div>
    </BasePopup>
  )
};
