import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  checked?: boolean,
  onClick?: (e: React.FormEvent<HTMLInputElement>) => void,
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void,
  children?: React.ReactNode,
}): JSX.Element => {
  return (
    <label
      data-id={props[`data-id`] || `InputCheckLabel`}
      data-testid={props[`data-testid`] || `InputCheckLabel`}
      className={`${props.className} flex select-none items-center gap-3`}
    >
      <input
        data-testid="InputCheck"
        className="relative z-[2] size-8 appearance-none border-[0.1rem] border-solid border-theme-half bg-transparent before:absolute before:left-[0.56rem] before:top-[0.2rem] before:z-[1] before:h-[1.1rem] before:w-[0.7rem] before:rotate-45 before:border-solid before:border-theme-fine checked:before:border-b-[0.2rem] checked:before:border-r-[0.2rem]"
        type="checkbox"
        checked={props.checked}
        onClick={(e) => props.onClick && props.onClick(e)}
        onChange={(e) => props.onChange && props.onChange(e)}
      />
      { props.children }
    </label>
  )
};
