import React from 'react';
import BaseIcon from '@/components/base/icon';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  tag?: string,
  onClick?: (e: React.FormEvent<HTMLElement>) => void,
  onTouchStart?: (e: React.TouchEvent<HTMLElement>) => void,
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void,
}): JSX.Element => {
  return (
    <BaseIcon
      data-id={props[`data-id`]}
      data-testid={props[`data-testid`]}
      className={props.className}
      tag={props.tag}
      name={`down`}
      viewBox={`0 0 24 24`}
      onClick={props.onClick}
      onTouchStart={props.onTouchStart}
      onMouseDown={props.onMouseDown}
    >
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path fill="currentColor" d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
    </BaseIcon>
  )
};
