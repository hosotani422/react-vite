import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  type?: `text` | `password`,
  placeholder?: string,
  readOnly?: boolean,
  value?: string,
  onClick?: (e: React.FormEvent<HTMLInputElement>) => void,
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void,
}): JSX.Element => {
  return (
    <input
      data-id={props[`data-id`] || `InputTextbox`}
      data-testid={props[`data-testid`] || `InputTextbox`}
      className={`${props.className} h-8 border-0 bg-transparent outline-0 placeholder:text-theme-half`}
      type={`${props.type || `text`}`}
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      value={props.value}
      onClick={(e) => props.onClick && props.onClick(e)}
      onInput={(e) => props.onInput && props.onInput(e)}
    />
  )
};
