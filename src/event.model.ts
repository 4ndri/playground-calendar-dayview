export { EventType } from '@microsoft/microsoft-graph-types';

import { Event } from '@microsoft/microsoft-graph-types';

export interface IEvent extends Event {
  // user permission to edit the calendar
  canEdit?: boolean;
  // the room, e.g. 'Sitzungszimmer'
  resource?: IResource;
  // identifier of the room, e.g. 'sitzungszimmer@iseschool.ch'
  sourceCalendar?: string;
}

export interface IResource {
  resourceId: string;
  label: string;
  color: string;
}

export interface IExtendedEvent {
  id: string;
  data: IEvent;
  startDate: Date;
  endDate: Date;
  left: number;
  right: number;
  top: number;
  bottom: number;
  after: IExtendedEvent[];
  before: IExtendedEvent[];
  col: number;
  groupIndex: number;
}
