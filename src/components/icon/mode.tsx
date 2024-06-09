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
      name={`mode`}
      viewBox={`0 0 24 24`}
      onClick={props.onClick}
      onTouchStart={props.onTouchStart}
      onMouseDown={props.onMouseDown}
    >
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        fill="currentColor"
        d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"
      />
    </BaseIcon>
  )
};
