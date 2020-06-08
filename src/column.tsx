/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { useState, useEffect } from 'react';
import { IEvent } from './event.model';
import { EventEntry } from './event';
import { setEventsPositions } from './events-placement';

const columnStyle = css`
  position: absolute;
  height: 1440px;
  width: 300px;
  /* border: 1px solid #333; */
  box-shadow: 2px 2px 10px #333;
  margin:20px;
`;
export const Column: React.FC = (props: { events: IEvent[] }) => {
  const [events, setEvents] = useState(setEventsPositions(props.events));
  useEffect(() => {
    const n = setEventsPositions(props.events);
    setEvents(n);
  }, [props.events]);

  return (
    <div css={columnStyle}>
      {events.map((e) => {
        return <EventEntry key={e.iCalUId} event={e} />;
      })}
    </div>
  );
};
