import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  placeholder?: string,
  sizing?: `fixed` | `content`,
  value?: string,
  onInput?: (e: React.FormEvent<HTMLTextAreaElement>) => void,
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void,
}): JSX.Element => {
  return (
    <textarea
      data-id={props[`data-id`] || `InputTextarea`}
      data-testid={props[`data-testid`] || `InputTextarea`}
      className={`${props.className} m-0 resize-none overflow-auto border-0 bg-transparent p-2 leading-8 outline-0 placeholder:text-theme-half`}
      placeholder={props.placeholder}
      style={{['fieldSizing' as string]: props.sizing}}
      value={props.value}
      onInput={(e) => props.onInput && props.onInput(e)}
      onKeyDown={(e) => props.onKeyDown && props.onKeyDown(e)}
    />
  )
};
