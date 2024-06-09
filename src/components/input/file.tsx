import React from 'react';
import InputButton from '@/components/input/button';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void,
  children?: React.ReactNode,
}): JSX.Element => {
  return (
    <label
      data-id={props[`data-id`] || `InputFileLabel`}
      data-testid={props[`data-testid`] || `InputFileLabel`}
      className={`${props.className} relative z-[1]`}>
      <input
        data-testid="InputFile"
        className="absolute inset-0 z-[2] opacity-0"
        type="file"
        onChange={(e) => props.onChange && props.onChange(e)}
      />
      <InputButton data-testid="InputFileButton">
        { props.children }
      </InputButton>
    </label>
  )
};
