import {Injectable} from '@angular/core';
import {Event} from '../datatypes/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  #id: number = 1;
  #eventList: Event[] = [];

  //region ctor
  constructor() {
    console.log('All Events', this.#eventList);
  }

  //endregion


}
