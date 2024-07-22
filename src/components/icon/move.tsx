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
      name={`move`}
      viewBox={`0 0 24 24`}
      onClick={props.onClick}
      onTouchStart={props.onTouchStart}
      onMouseDown={props.onMouseDown}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
    </BaseIcon>
  )
};
