import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  type?: `button` | `reset` | `submit`,
  disabled?: boolean,
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void,
  children?: React.ReactNode,
}): JSX.Element => {
  return (
    <button
      data-id={props[`data-id`] || `InputButton`}
      data-testid={props[`data-testid`] || `InputButton`}
      className={`${props.className} h-8 select-none border-0 bg-transparent outline-0 disabled:opacity-50`}
      type={`${props.type || `button`}`}
      disabled={props.disabled}
      onClick={(e) => props.onClick && props.onClick(e)}
    >
      { props.children }
    </button>
  )
};
