import {Component, Input, OnInit} from '@angular/core';
import {DatabaseService} from '../../app/data/services/database.service';
import {ModalController} from '@ionic/angular';
import {EventType} from 'src/app/data/types/eventType';
import {Event} from '../../app/data/types/event';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
})
export class NewEventComponent implements OnInit {
  eventTypes = Object.values(EventType) as EventType[];
  selectedEventType: EventType = this.eventTypes[0];

  @Input()
  event?: Event = undefined;
  @Input()
  eventId?: string;
  @Input()
  groupId?: string;
  @Input()
  groupName: string = '';
  opponent: string = '';
  atHome: boolean = true;
  trainingSession: boolean = this.selectedEventType === EventType.trainingSession;
  address: string = '';
  date: string = '';
  time: string = '';
  minDate: string;
  error: string = '';

  constructor(private databaseService: DatabaseService,
              private modalCtrl: ModalController) {
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
  }

  ngOnInit(): void {

  }

  async cancel(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  async createEvent(): Promise<void> {
    if (this.groupId == null) return;

    if (this.selectedEventType !== EventType.trainingSession) {
      if (!this.opponent || !this.address && !this.atHome) {
        this.error = 'All fields are required.';
        return;
      }
    }

    if (!this.date) {
      this.error = 'Please select a date.';
      return;
    }

    await this.databaseService.createEvent(this.groupId, this.groupName, this.opponent, this.atHome, this.address, this.selectedEventType.toString(), this.date);
    await this.modalCtrl.dismiss();
  }

  updateEventType(): void {
    if (this.selectedEventType === EventType.trainingSession) {
      this.opponent = '';
      this.atHome = true;
      this.address = '';
      this.trainingSession = true;
    } else {
      this.trainingSession = false;
    }
  }

  isDateEnabled(chosenDate: string): boolean {
    const currentDate = new Date();
    const date = new Date(chosenDate);

    currentDate.setHours(0, 0, 0, 0);

    return date >= currentDate;
  }


}
