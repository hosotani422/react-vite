import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  value?: string,
  checked?: string,
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void,
  children?: React.ReactNode,
}): JSX.Element => {
  return (
    <label
      data-id={props[`data-id`] || `InputRadioLabel`}
      data-testid={props[`data-testid`] || `InputRadioLabel`}
      className={`${props.className} flex select-none items-center gap-3`}
    >
      <input
        data-testid="InputRadio"
        className="relative z-[2] size-8 appearance-none rounded-full border-[0.1rem] border-solid border-theme-half bg-transparent before:absolute before:left-2 before:top-2 before:z-[1] before:size-[0.8rem] before:rounded-full checked:before:bg-theme-fine"
        type="radio"
        value={props.value}
        checked={props.value === props.checked}
        onChange={(e) => props.onChange && props.onChange(e)}
      />
      { props.children }
    </label>
  )
};
