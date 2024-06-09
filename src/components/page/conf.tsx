import * as ReactRouter from 'react-router-dom';
import InputRange from '@/components/input/range';
import InputRadio from '@/components/input/radio';
import InputButton from '@/components/input/button';
import InputFile from '@/components/input/file';
import IconDown from '@/components/icon/down';
import app from "@/stores/page/app";
import conf from "@/stores/page/conf";

export default (props: { app: typeof app, conf: typeof conf }): JSX.Element => {
  app.refer.params = ReactRouter.useParams();
  return (
    <div
      data-id="ConfRoot"
      data-testid="ConfRoot"
      className="theme-color-mask anime-slide-conf absolute inset-x-0 bottom-0 z-10 h-[200%] select-none"
      onTouchMove={(e) => {
        props.conf.handle.swipeStart({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY });
        props.conf.handle.swipeMove({ y: e.changedTouches[0]!.clientY });
      }}
      onMouseMove={(e) => {
        props.conf.handle.swipeStart({ x: e.clientX, y: e.clientY });
        props.conf.handle.swipeMove({ y: e.clientY });
      }}
      onTouchEnd={(e) => props.conf.handle.swipeEnd({ y: e.changedTouches[0]!.clientY })}
      onMouseUp={(e) => props.conf.handle.swipeEnd({ y: e.clientY })}
    >
      <div
        data-testid="ConfBack"
        className="absolute inset-x-0 top-0 z-[1] h-[55%]"
        onTouchStart={(e) => props.conf.handle.swipeInit({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY })}
        onMouseDown={(e) => props.conf.handle.swipeInit({ x: e.clientX, y: e.clientY })}
      />
      <div
        data-testid="ConfHome"
        className="theme-color-grad theme-shadow-outer absolute inset-x-0 bottom-0 z-[1] flex h-[45%] flex-col"
      >
        <div
          data-testid="ConfHead"
          className="theme-color-grad theme-shadow-outer relative z-[9] flex flex-initial items-center gap-3 p-3"
        >
          <IconDown data-testid="ConfDown" className="flex-initial" onClick={() => props.app.handle.routerBack()} />
          <p data-testid="ConfTitle" className="flex-1 text-xl">{ app.refer.i18next.t(`conf.title`) }</p>
          <p data-testid="ConfName" className="flex-initial">{ `${app.refer.constant.app.name} ${app.refer.constant.app.version}` }</p>
        </div>
        <ul data-testid="ConfBody" className="flex-1 overflow-auto p-3">
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfSizeTitle" className="flex-[0_1_5rem]">{ app.refer.i18next.t(`conf.size.title`) }</p>
            <InputRange
              data-testid="ConfSizeValue"
              className="flex-1"
              min={1}
              max={3}
              step={1}
              value={props.conf.state.data.size}
              onChange={(e) => props.conf.handle.inputValue({ type: `size`, value: (e.target as HTMLInputElement).value })}
            />
            <p data-testid="ConfSizeName" className="flex-initial">{ app.refer.i18next.t(`conf.size.value.${props.conf.state.data.size}`) }</p>
          </li>
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfSpeedTitle" className="flex-[0_1_5rem]">{ app.refer.i18next.t(`conf.speed.title`) }</p>
            <InputRange
              data-testid="ConfSpeedValue"
              className="flex-1"
              min={1}
              max={3}
              step={1}
              value={props.conf.state.data.speed}
              onChange={(e) => props.conf.handle.inputValue({ type: `speed`, value: (e.target as HTMLInputElement).value })}
            />
            <p data-testid="ConfSpeedName" className="flex-initial">{ app.refer.i18next.t(`conf.speed.value.${props.conf.state.data.speed}`) }</p>
          </li>
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfThemeTitle" className="flex-1">{ app.refer.i18next.t(`conf.theme.title`) }</p>
            <InputRadio
              data-testid="ConfThemeLight"
              className="flex-initial"
              value={`light`}
              checked={props.conf.state.data.theme}
              onChange={(e) => props.conf.handle.inputValue({ type: `theme`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.theme.value.light`) }
            </InputRadio>
            <InputRadio
              data-testid="ConfThemeDark"
              className="flex-initial"
              value={`dark`}
              checked={props.conf.state.data.theme}
              onChange={(e) => props.conf.handle.inputValue({ type: `theme`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.theme.value.dark`) }
            </InputRadio>
          </li>
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfLangTitle" className="flex-1">{ app.refer.i18next.t(`conf.lang.title`) }</p>
            <InputRadio
              data-testid="ConfLangEn"
              className="flex-initial"
              value={`en`}
              checked={props.conf.state.data.lang}
              onChange={(e) => props.conf.handle.inputValue({ type: `lang`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.lang.value.en`) }
            </InputRadio>
            <InputRadio
              data-testid="ConfLangJa"
              className="flex-initial"
              value={`ja`}
              checked={props.conf.state.data.lang}
              onChange={(e) => props.conf.handle.inputValue({ type: `lang`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.lang.value.ja`) }
            </InputRadio>
          </li>
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfVibrateTitle" className="flex-1">{ app.refer.i18next.t(`conf.vibrate.title`) }</p>
            <InputRadio
              data-testid="ConfVibrateOff"
              className="flex-initial"
              value={`off`}
              checked={props.conf.state.data.vibrate}
              onChange={(e) => props.conf.handle.inputValue({ type: `vibrate`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.vibrate.value.off`) }
            </InputRadio>
            <InputRadio
              data-testid="ConfVibrateOn"
              className="flex-initial"
              value={`on`}
              checked={props.conf.state.data.vibrate}
              onChange={(e) => props.conf.handle.inputValue({ type: `vibrate`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.vibrate.value.on`) }
            </InputRadio>
          </li>
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfSaveTitle" className="flex-1">{ app.refer.i18next.t(`conf.save.title`) }</p>
            <InputRadio
              data-testid="ConfSaveLocal"
              className="flex-initial"
              value={`local`}
              checked={props.conf.state.data.save}
              onChange={(e) => props.conf.handle.inputValue({ type: `save`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.save.value.local`) }
            </InputRadio>
            <InputRadio
              data-testid="ConfSaveRest"
              className="flex-initial"
              value={`rest`}
              checked={props.conf.state.data.save}
              onChange={(e) => props.conf.handle.inputValue({ type: `save`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.save.value.rest`) }
            </InputRadio>
            <InputRadio
              data-testid="ConfSaveGql"
              className="flex-initial"
              value={`gql`}
              checked={props.conf.state.data.save}
              onChange={(e) => props.conf.handle.inputValue({ type: `save`, value: (e.target as HTMLInputElement).value })}
            >
              { app.refer.i18next.t(`conf.save.value.gql`) }
            </InputRadio>
          </li>
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfBackupTitle" className="flex-1">{ app.refer.i18next.t(`conf.backup.title`) }</p>
            <InputButton
              data-testid="ConfBackupDownload"
              className="flex-[0_1_2rem] text-theme-fine"
              onClick={() => props.conf.handle.downloadBackup()}
            >
              { app.refer.i18next.t(`conf.backup.download`) }
            </InputButton>
            <InputFile
              data-testid="ConfBackupUpload"
              className="flex-[0_1_2rem] text-theme-warn"
              onChange={(e) => props.conf.handle.uploadBackup({ files: e.currentTarget.files! })}
              >{ app.refer.i18next.t(`conf.backup.upload`) }</InputFile
            >
          </li>
          <li
            data-testid="ConfItem"
            className="theme-color-border theme-color-back flex h-16 items-center gap-3 border-b-[0.1rem] border-solid p-3"
          >
            <p data-testid="ConfResetTitle" className="flex-1">{ app.refer.i18next.t(`conf.reset.title`) }</p>
            <InputButton data-testid="ConfResetConf" className="flex-[0_1_2rem] text-theme-fine" onClick={() => props.conf.handle.resetConf()}>
              { app.refer.i18next.t(`conf.reset.conf`) }
            </InputButton>
            <InputButton data-testid="ConfResetList" className="flex-[0_1_2rem] text-theme-warn" onClick={() => props.conf.handle.resetList()}>
              { app.refer.i18next.t(`conf.reset.list`) }
            </InputButton>
          </li>
        </ul>
      </div>
    </div>
  )
};
