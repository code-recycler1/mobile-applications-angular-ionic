import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../../data/services/database.service';
import {ModalController} from '@ionic/angular';
import {EventType} from 'src/app/data/types/eventType';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
})
export class NewEventComponent implements OnInit {
  eventTypes = Object.values(EventType) as EventType[];
  selectedEventType = this.eventTypes[0];
  constructor(private databaseService: DatabaseService,
              public modalCtrl: ModalController) {
  }

  ngOnInit(): void {
  }

  async cancel(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  async createEvent(): Promise<void> {
    // if (!this.name || !this.street || !this.streetNumber || !this.city) {
    //   this.error = 'All fields are required.';
    //   return;
    // }

    await this.databaseService.createEvent();
    await this.modalCtrl.dismiss();
  }
}
