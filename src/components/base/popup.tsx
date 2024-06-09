import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  open?: boolean;
  max?: boolean;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void,
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void,
  onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void,
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void,
  children?: React.ReactNode,
}): JSX.Element | undefined | false => {
  return props.open && (
    <div
      data-id={props[`data-id`] || `BasePopup`}
      data-testid={props[`data-testid`] || `BasePopup`}
      className={`${props.className} theme-color-mask anime-fade-item absolute inset-0 z-[70] flex items-center justify-center`}
      onTouchMove={(e) => props.onTouchMove && props.onTouchMove(e)}
      onMouseMove={(e) => props.onMouseMove && props.onMouseMove(e)}
      onTouchEnd={(e) => props.onTouchEnd && props.onTouchEnd(e)}
      onMouseUp={(e) => props.onMouseUp && props.onMouseUp(e)}
    >
      <div className={`${props.max && `h-4/5`} theme-color-back theme-shadow-outer flex max-h-[80%] w-4/5 flex-col gap-3 rounded p-3`}>
        { props.children }
      </div>
    </div>
  )
};
