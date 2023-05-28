import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../data/types/event';
import {formatDate} from '@angular/common';
import {AuthService} from '../../data/services/auth.service';
import {ActionSheetController} from '@ionic/angular';
import {DatabaseService} from '../../data/services/database.service';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
})
export class EventItemComponent implements OnInit {

  @Input()
  event!: Event;

  eventTitle!: string;
  date!: string;
  time!: string;
  currentUserId: string | undefined = this.authService.getUserUID();

  constructor(private authService: AuthService,
              private actionSheetCtrl: ActionSheetController,
              private databaseService: DatabaseService) {

  }

  ngOnInit(): void {
    const eventDate = this.event.date.toDate();
    this.date = formatDate(eventDate, 'dd-MM-yyyy', 'en-GB');
    this.time = formatDate(eventDate, 'HH:mm', 'en-GB');
    this.eventTitle = `${this.event.home} ${this.event.away && `- ${this.event.away}`}`;
  }

  getCardColor(): string {
    if (!this.currentUserId) return '';
    if (this.event.maybe.includes(this.currentUserId)) {
      return 'warning';
    } else if (this.event.yes?.includes(this.currentUserId)) {
      return 'success';
    } else {
      return 'danger';
    }
  }

  async showChangeAttendanceActionSheet(): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `${this.event.type}`,
      subHeader: `${this.eventTitle}`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (this.event.id) {
              this.databaseService.updateAttendance(this.event.id, 'yes');
            }
          }
        },
        {
          text: 'Maybe',
          handler: () => {
            if (this.event.id) {
              this.databaseService.updateAttendance(this.event.id, 'maybe');
            }
          }
        },
        {
          text: 'No',
          handler: () => {
            if (this.event.id) {
              this.databaseService.updateAttendance(this.event.id, 'no');
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

  }

}
