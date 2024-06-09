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
      name={`clone`}
      viewBox={`0 0 24 24`}
      onClick={props.onClick}
      onTouchStart={props.onTouchStart}
      onMouseDown={props.onMouseDown}
    >
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        fill="currentColor"
        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"
      />
    </BaseIcon>
  )
};
