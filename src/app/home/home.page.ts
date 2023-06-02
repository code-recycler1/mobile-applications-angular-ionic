import {Component, OnInit} from '@angular/core';
import {EventType} from '../data/types/eventType';
import {Observable, of, map} from 'rxjs';
import {Event} from '../data/types/event';
import {DatabaseService} from '../data/services/database.service';
import {AuthService} from '../data/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  eventTypes = ['All', ...Object.values(EventType)] as EventType[];
  selectedEventType = this.eventTypes[0];

  allEvents: Observable<Event[]> = of([]);
  filteredEvents: Observable<Event[]> = of([]);

  constructor(public authService: AuthService,
              private databaseService: DatabaseService) {
    this.authService.currentUser.subscribe(u => {
      if (u) {
        this.allEvents = this.databaseService.retrieveMyEventsList();
        this.filteredEvents = this.allEvents;
      } else {
        this.allEvents = of([]);
      }
    });
  }

  ngOnInit(): void {
    this.filterEventsByType();
  }

  /**
   * Event handler for when the selected event type is changed.
   * Calls the `filterEventsByType` method to filter the events based on the selected event type.
   *
   * @returns {void}
   */
  onEventTypeChange(): void {
    this.filterEventsByType();
  }

  /**
   * Filters the events based on the selected event type.
   *
   * @returns {void}
   */
  filterEventsByType(): void {
    if (this.selectedEventType == this.eventTypes[0]) {
      this.filteredEvents = this.allEvents;
    } else {
      this.filteredEvents = this.allEvents.pipe(
        map(events => events.filter(event => event.type === this.selectedEventType))
      );
    }
  }
}

