import { IEvent, IExtendedEvent } from './event.model';
import data from './data.json';
import { parseISO } from 'date-fns';
export const items = (data as unknown) as IEvent[];

const extendedEventMapper = (e: IEvent) =>
  ({
    data: e,
    id: e.id,
    after: [],
    before: [],
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    col: 0,
    groupIndex: 0,
    startDate: parseISO(e.start?.dateTime ?? ''),
    endDate: parseISO(e.end?.dateTime ?? ''),
  } as IExtendedEvent);

export const getExtended = () => {
  return items.map(extendedEventMapper);
};
