import {Component, OnInit} from '@angular/core';
import {NewGroupComponent} from '../../shared/new-group/new-group.component';
import {AlertController, ModalController} from '@ionic/angular';
import {AuthService} from '../data/services/auth.service';
import {DatabaseService} from '../data/services/database.service';
import {Observable, of} from 'rxjs';
import {Group} from '../data/types/group';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  groups: Observable<Group[]> = of([]);

  constructor(public authService: AuthService,
              private databaseService: DatabaseService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.authService.currentUser.subscribe(u => {
      if (u) {
        this.groups = this.databaseService.retrieveMyGroupsList();
      } else {
        this.groups = of([]);
      }
    });
  }

  ngOnInit(): void {

  }

  /**
   Displays a new group modal.
   @returns {Promise<void>} A promise that resolves when the modal is presented.
   */
  async showNewGroupModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: NewGroupComponent
    });

    await modal.present();
  }

  /**
   * Shows an alert to enter a group code for joining a group.
   *
   * @returns {Promise<void>} A promise that resolves when the alert is presented.
   */
  async showEnterGroupCodeAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: `Enter code:`,
      inputs: [{
        name: 'groupCode',
        type: 'text'
      }],
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async (data) => {
            try {
              await this.databaseService.joinGroup(data.groupCode);
              return true;
            } catch (error) {
              alert.message = 'Group not found';
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

}
