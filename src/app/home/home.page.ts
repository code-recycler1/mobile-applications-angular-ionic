import {Component, OnInit} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import {EventType} from '../data/types/eventType';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  eventTypes = Object.values(EventType) as EventType[];
  selectedEventType = this.eventTypes[0];

  constructor(private actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit(): void {
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'New',
      buttons: [
        {
          text: 'Event',
          data: {
            action: 'share',
          },
        },
      ],
    });

    await actionSheet.present();
  }
}
