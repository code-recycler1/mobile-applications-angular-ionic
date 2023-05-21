import {Component, Input, OnInit} from '@angular/core';
import {Group} from '../../data/types/group';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {DatabaseService} from '../../data/services/database.service';

@Component({
  selector: 'app-group-item[group]',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
})
export class GroupItemComponent implements OnInit {

  @Input()
  group!: Group;

  isGroupOwner!: boolean;

  constructor(
    public router: Router,
    private alertController: AlertController,
    private databaseService: DatabaseService) {
  }

  ngOnInit(): void {

  }

  async presentDeleteGroupAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: `Are you sure you want to delete ${this.group.name}?`,
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
            if (this.group.id) {
              await this.databaseService.deleteGroup(this.group.id);
            }
          },
        },
      ]
    });

    await alert.present();
  }

  async presentLeaveGroupAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: `Are you sure you want to leave ${this.group.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            if (this.group.id) {
              //TODO: Add the userId to the leave method to remove the userId from the group.memberIds
              await this.databaseService.leaveGroup(this.group.id);
            }
          },
        },
      ]
    });

    await alert.present();
  }

}
