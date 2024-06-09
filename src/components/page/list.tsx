/** @jsxRuntime classic */
/** @jsx nativeEvents */
import nativeEvents from 'jsx-native-events';
import * as ReactRouter from 'react-router-dom';
import IconTrash from '@/components/icon/trash';
import IconLeft from '@/components/icon/left';
import IconPlus from '@/components/icon/plus';
import IconClone from '@/components/icon/clone';
import app from "@/stores/page/app";
import list from "@/stores/page/list";

export default (props: { app: typeof app, list: typeof list }): JSX.Element => {
  app.refer.params = ReactRouter.useParams();
  return (
    <div
      data-id="ListRoot"
      data-testid="ListRoot"
      className="theme-color-mask anime-slide-list absolute inset-y-0 left-0 z-10 w-[200%]"
      onTouchMove={(e) => {
        props.list.handle.dragStart();
        props.list.handle.dragMove({ y: e.changedTouches[0]!.clientY });
        props.list.handle.swipeStart({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY });
        props.list.handle.swipeMove({ x: e.changedTouches[0]!.clientX });
      }}
      onMouseMove={(e) => {
        props.list.handle.dragStart();
        props.list.handle.dragMove({ y: e.clientY });
        props.list.handle.swipeStart({ x: e.clientX, y: e.clientY });
        props.list.handle.swipeMove({ x: e.clientX });
      }}
      onTouchEnd={(e) => {
        props.list.handle.dragEnd();
        props.list.handle.swipeEnd({ x: e.changedTouches[0]!.clientX });
      }}
      onMouseUp={(e) => {
        props.list.handle.dragEnd();
        props.list.handle.swipeEnd({ x: e.clientX });
      }}
      onClick={() => props.list.handle.editItem()}
    >
      <div
        data-testid="ListBack"
        className="absolute inset-y-0 right-0 z-[1] w-[57%]"
        onTouchStart={(e) => props.list.handle.swipeInit({ x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY })}
        onMouseDown={(e) => props.list.handle.swipeInit({ x: e.clientX, y: e.clientY })}
      />
      <div
        data-testid="ListHome"
        className="theme-color-grad theme-shadow-outer absolute inset-y-0 left-0 z-[1] flex w-[43%] flex-col"
      >
        <div
          data-testid="ListHead"
          className="theme-color-grad theme-shadow-outer relative z-[9] flex flex-initial items-center gap-3 p-3"
        >
          <IconPlus data-testid="ListPlus" className="flex-initial" onClick={() => props.list.handle.entryItem()} />
          <p data-testid="ListTitle" className="line-clamp-1 flex-1 text-xl">{ app.refer.constant.app.name }</p>
          <IconLeft data-testid="ListLeft" className="flex-initial" onClick={() => props.app.handle.routerBack()} />
        </div>
        <ul data-id="ListBody" data-testid="ListBody" className="flex-1 select-none overflow-auto p-3">
          { props.list.state.data.sort.map((listId) =>
            <li
              key={listId}
              data-id={`ListItem${listId}`}
              data-testid="ListItem"
              className={`${props.list.render.classStatus({listId})} ${props.list.render.classLimit({listId})} theme-color-border theme-color-back trans-select-label trans-edit-item anime-scale-item group relative flex h-16 items-center gap-3 overflow-hidden border-b-[0.1rem] border-solid p-3`}
              onContextMenu={(e) => e.preventDefault()}
              onEventLongtouch={(e) => {
                props.list.handle.editItem({ listId });
                props.list.handle.dragInit({ listId, y: e.detail.changedTouches[0]?.clientY });
              }}
              onEventLongclick={(e) => {
                props.list.handle.editItem({ listId });
                props.list.handle.dragInit({ listId, y: e.detail.clientY });
              }}
              onClick={() => props.list.state.status[listId] !== `edit` && props.app.handle.routerMain({listId})}
            >
              { [props.list.render.typeIcon({ listId })].map((Tag) => <Tag data-testid="ListIcon" className="flex-initial" />) }
              <p data-testid="ListTask" className="line-clamp-1 flex-1">
                { props.list.state.data.data[listId].title }
              </p>
              <p
                data-testid="ListCount"
                className="flex-initial"
              >
                { props.list.render.valueCount({ listId }) }
              </p>
              <div className="theme-color-back trans-option-label absolute right-3 flex translate-x-[150%] gap-3">
                { listId !== app.refer.constant.id.trash &&
                  <IconClone
                    data-testid="ListClone"
                    className="flex-initial"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.list.handle.copyItem({ listId });
                    }}
                  />
                }
                { listId !== app.refer.params.listId && listId !== app.refer.constant.id.trash &&
                  <IconTrash
                    data-testid="ListTrash"
                    className="flex-initial"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.list.handle.deleteItem({ listId });
                    }}
                  />
                }
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
};
