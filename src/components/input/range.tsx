import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  min?: number,
  max?: number,
  step?: number,
  value?: number;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void,
}): JSX.Element => {
  const updateStyle = () => {
    const rate = ((props.value! - props.min!) / (props.max! - props.min!)) * 100;
    return { background: `linear-gradient(to right, #18d ${rate}%, #959595 ${rate}%)` };
  };
  return (
    <input
      data-id={props[`data-id`] || `InputRange`}
      data-testid={props[`data-testid`] || `InputRange`}
      className={`${props.className} h-[0.1rem] w-full appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme-fine`}
      style={updateStyle()}
      type="range"
      min={props.min}
      max={props.max}
      step={props.step}
      value={props.value}
      onChange={(e) => props.onChange && props.onChange(e)}
    />
  )
};
