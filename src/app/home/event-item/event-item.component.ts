import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../data/types/event';
import {formatDate} from '@angular/common';
import {AuthService} from '../../data/services/auth.service';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {DatabaseService} from '../../data/services/database.service';
import {NewEventComponent} from '../../../shared/new-event/new-event.component';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
})
export class EventItemComponent implements OnInit {

  @Input()
  event?: Event = undefined;
  @Input()
  eventId?: string;

  eventTitle!: string;
  date!: string;
  time!: string;
  currentUserId: string | undefined = this.authService.getUserUID();

  respondedUsers!: number;

  isOwner!: boolean;

  constructor(private authService: AuthService,
              private actionSheetCtrl: ActionSheetController,
              private databaseService: DatabaseService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {

  }

  ngOnInit(): void {
    if (this.event) {
      const eventDate = this.event.date.toDate();
      this.date = formatDate(eventDate, 'dd-MM-yyyy', 'en-GB');
      this.time = formatDate(eventDate, 'HH:mm', 'en-GB');
      this.eventTitle = `${this.event.home} ${this.event.away && `- ${this.event.away}`}`;
      this.isOwner = this.event.ownerId == this.currentUserId;

      const yesCount = this.event.yes ? this.event.yes.length : 0;
      const maybeCount = this.event.maybe ? this.event.maybe.length : 0;
      const noCount = this.event.no ? this.event.no.length : 0;
      this.respondedUsers = yesCount + maybeCount + noCount;
    }
  }

  getCardColor(): string {
    if (!this.currentUserId) return '';
    if (this.event?.maybe.includes(this.currentUserId)) {
      return 'warning';
    } else if (this.event?.yes?.includes(this.currentUserId)) {
      return 'success';
    } else if (this.event?.no?.includes(this.currentUserId)){
      return 'danger';
    }else{
      return 'light'
    }
  }

  async showChangeAttendanceActionSheet(): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Are you attending?`,
      subHeader: `${this.eventTitle}`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (this.event?.id) {
              this.databaseService.updateAttendance(this.event.id, 'yes');
            }
          }
        },
        {
          text: 'Maybe',
          handler: () => {
            if (this.event?.id) {
              this.databaseService.updateAttendance(this.event.id, 'maybe');
            }
          }
        },
        {
          text: 'No',
          handler: () => {
            if (this.event?.id) {
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

  //region Not implemented
  async showEditEventModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: NewEventComponent,
      componentProps: {
        event: this.event,
        eventId: this.eventId
      }
    });
    return await modal.present();
  }
  //endregion

  async showDeleteEventAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to delete this event?',
      subHeader: 'This action can\'t be undone!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            if (this.event?.id) {
              await this.databaseService.deleteEvent(this.event?.id);
            }
          },
        },
      ]
    });

    await alert.present();
  }
}
