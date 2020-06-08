import { IEvent, IExtendedEvent } from './event.model';
import data from './data.json';

import datatest from './data.extreme2.json';
import { toDate } from 'date-fns-tz';

console.log(datatest.length);
console.log(data.length);

export const items = ((datatest || data) as unknown) as IEvent[];
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const extendedEventMapper = (e: IEvent, index: number) => {
  const start = toDate(e.start?.dateTime ?? '', { timeZone: 'UTC' });
  const end = toDate(e.end?.dateTime ?? '', { timeZone: 'UTC' });
  return {
    data: e,
    id: index.toString(),
    after: [],
    before: [],
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    col: 0,
    groupIndex: 0,
    startDate: start,
    endDate: end,
  } as IExtendedEvent;
};

export const getExtended = () => {
  return items.map(extendedEventMapper);
};
