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
      name={`left`}
      viewBox={`0 0 24 24`}
      onClick={props.onClick}
      onTouchStart={props.onTouchStart}
      onMouseDown={props.onMouseDown}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </BaseIcon>
  )
};
