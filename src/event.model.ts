export { EventType } from '@microsoft/microsoft-graph-types';

import { Event } from '@microsoft/microsoft-graph-types';

export interface IEvent extends Event {
  // user permission to edit the calendar
  canEdit?: boolean;
  // the room, e.g. 'Sitzungszimmer'
  resource?: IResource;
  // identifier of the room, e.g. 'sitzungszimmer@iseschool.ch'
  sourceCalendar?: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
  startDate: Date;
  endDate: Date;
  after: IEvent[];
  before: IEvent[];
  maxRight: number;
}

export interface IResource {
  resourceId: string;
  label: string;
  color: string;
}
