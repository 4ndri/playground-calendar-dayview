/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { IEvent } from './event.model';

export const EventEntry: React.FC = (props: { event: IEvent }) => {
  const { event } = props;

  const s = css`
    position: absolute;
    top: ${event.top}px;
    bottom: ${event.bottom}px;
    left: ${event.left ?? 0}%;
    right: ${event.right ?? 0}%;
    background-color: #4444dd;
    border: solid 1px #ccc;
    color: #fff;
    padding: 5px;
  `;
  return <div css={s}>{event.subject}</div>;
};
