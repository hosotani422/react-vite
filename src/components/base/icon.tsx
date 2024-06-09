import React from 'react';

export default (props: {
  "data-id"?: string,
  "data-testid"?: string,
  className?: string,
  tag?: string;
  name?: string;
  viewBox?: string;
  onClick?: (e: React.FormEvent<HTMLElement>) => void,
  onTouchStart?: (e: React.TouchEvent<HTMLElement>) => void,
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void,
  children?: React.ReactNode,
}): JSX.Element => {
  const Tag = props.tag || `i` as React.ElementType;
  return (
    <Tag
      data-id={props[`data-id`] || `BaseIcon`}
      data-testid={props[`data-testid`] || `BaseIcon`}
      className={`${props.className} w-8`}
      onClick={(e: React.FormEvent<HTMLElement>) => props.onClick && props.onClick(e)}
      onTouchStart={(e: React.TouchEvent<HTMLElement>) => props.onTouchStart && props.onTouchStart(e)}
      onMouseDown={(e: React.MouseEvent<HTMLElement>) => props.onMouseDown && props.onMouseDown(e)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby={props.name} viewBox={props.viewBox} role="presentation">
        <title id={props.name} lang="en">{props.name} icon</title>
        { props.children }
      </svg>
    </Tag>
  )
};
