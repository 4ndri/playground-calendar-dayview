import {
  differenceInMinutes,
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

export function setVerticalPosition(e: IExtendedEvent) {
  e.top = differenceInMinutes(e.startDate, startOfDay(e.startDate));
  e.bottom = differenceInMinutes(endOfDay(e.endDate), e.endDate);
}

function sortEvents(_events: IExtendedEvent[]) {
  const sortedEvents = _events.sort(sort);
  return sortedEvents;
}

const setPositionsOnRelatedGroup = (columns: Array<IExtendedEvent[]>) => {
  if (!columns || !columns.length) {
    return;
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
};

export function setPositions(_events: IExtendedEvent[]) {
  const t0 = performance.now();
  let events = sortEvents(_events);
  let groupIndex = 0;

  let columns: Array<IExtendedEvent[]> = [];
  //form groups and compare events
  for (let x = 0; x < events.length; x++) {
    const xe = events[x];
    if (!xe.before) {
      xe.before = [];
    }
    if (!xe.after) {
      xe.after = [];
    }

    setVerticalPosition(xe);

    //new group
    if (!xe.before.length) {
      setPositionsOnRelatedGroup(columns);
      groupIndex = 0;
      columns = [];
    }

    //place event to first free column
    let freeCol = groupIndex;
    groupIndex++;
    for (let c = 0; c < freeCol; c++) {
      if (!xe.before[c] && c < freeCol) {
        freeCol = c;
        break;
      }
    }
    xe.col = freeCol;
    if (!columns[xe.col]) {
      columns[xe.col] = [];
    }
    columns[xe.col].push(xe);

    // compare event to proximate events
    for (let y = x + 1; y < events.length; y++) {
      const ye = events[y];
      if (
        areIntervalsOverlapping(
          { start: xe.startDate, end: xe.endDate },
          { start: ye.startDate, end: ye.endDate }
        )
      ) {
        xe.after.push(ye);
        ye.before[xe.col] = xe;
      } else {
        // following events won't overlap too (array is sorted)
        break;
      }
    }
  }
  const t1 = performance.now();
  console.log(`setPositions for ${events.length} items (ms)`, t1 - t0);
  return events;
}
