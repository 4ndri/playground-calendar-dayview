import {
  differenceInMinutes,
  parseISO,
  startOfDay,
  endOfDay,
  isBefore,
  areIntervalsOverlapping,
} from 'date-fns';
import { IExtendedEvent } from './event.model';

const sort = (a: IExtendedEvent, b: IExtendedEvent) => {
  if (isBefore(a.startDate, b.startDate)) {
    return -1;
  }
  if (isBefore(b.startDate, a.startDate)) {
    return 1;
  }
  if (isBefore(a.endDate, b.endDate)) {
    return 1;
  }
  return -1;
};

export function setVerticalPosition(events: IExtendedEvent[]) {
  for (const e of events) {
    e.startDate = parseISO(e.data.start?.dateTime ?? '');
    e.endDate = parseISO(e.data.end?.dateTime ?? '');
    e.top = differenceInMinutes(e.startDate, startOfDay(e.startDate));
    e.bottom = differenceInMinutes(endOfDay(e.endDate), e.endDate);
    e.after = [];
    e.before = [];
  }

  return events;
}

function sortEvents(_events: IExtendedEvent[]) {
  const sortedEvents = _events.sort(sort);
  return sortedEvents;
}

function setHorizontalPositions(events: IExtendedEvent[]) {
  const groups: Array<IExtendedEvent[]> = [];
  let group: IExtendedEvent[] = [];

  //form groups and compare events
  for (let x = 0; x < events.length; x++) {
    const xe = events[x];
    if (!xe.before) {
      xe.before = [];
    }
    if (!xe.after) {
      xe.after = [];
    }
    if (!xe.before.length) {
      group = [];
      groups.push(group);
    }
    group.push(xe);
    for (let y = x + 1; y < events.length; y++) {
      const ye = events[y];
      if (
        areIntervalsOverlapping(
          { start: xe.startDate, end: xe.endDate },
          { start: ye.startDate, end: ye.endDate }
        )
      ) {
        xe.after.push(ye);
        ye.before.push(xe);
      } else {
        // following events won't overlap too (array is sorted)
        break;
      }
    }
  }

  for (const g of groups) {
    const matrix: Array<number[]> = [];
    let max = -1;
    const columns: Array<IExtendedEvent[]> = [];

    // build matrix
    for (var i = 0; i < g.length; i++) {
      matrix[i] = new Array(g.length);
    }

    // fill matrix and reduce columns
    for (var i = 0; i < g.length; i++) {
      const xe = g[i];
      let freeCol = i;
      for (let c = 0; c < g.length; c++) {
        if (!matrix[c][i]) {
          freeCol = c;
          break;
        }
      }
      if (max < freeCol) {
        max = freeCol;
        columns.push([]);
      }
      columns[freeCol].push(xe);
      for (let j = i; j <= i + (xe?.after?.length || 0); j++) {
        matrix[freeCol][j] = 1;
      }
    }

    // expand events width
    const width = 100 / columns.length;
    for (let i = 0; i < columns.length; i++) {
      for (const e of columns[i]) {
        e.left = i * width;
        e.right = Math.max(100 - (i + 1) * width, 0);
        for (let j = i + 1; j < columns.length; j++) {
          if (
            columns[j].some(
              (c) => e.after.indexOf(c) > -1 || e.before.indexOf(c) > -1
            )
          ) {
            break;
          } else {
            e.right = Math.max(100 - (j + 1) * width, 0);
          }
        }
      }
    }
  }

  return events;
}

export function setEventsPositions(_events: IExtendedEvent[]) {
  let events = setVerticalPosition(_events);
  events = sortEvents(events);
  events = setHorizontalPositions(events);
  return events;
}
