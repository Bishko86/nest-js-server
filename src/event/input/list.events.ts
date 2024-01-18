import { WhenEventFilter } from 'src/enums/when-event.enum';

export class ListsEvents {
  when?: WhenEventFilter.All;
  page: number = 1;
}
