import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../data/types/group';
import {Profile} from '../../data/types/profile';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {from, Observable} from 'rxjs';
import {DatabaseService} from '../../data/services/database.service';
import {Clipboard} from '@capacitor/clipboard';
import {AuthService} from '../../data/services/auth.service';
import {NewGroupComponent} from '../new-group/new-group.component';
import {NewEventComponent} from './new-event/new-event.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  group!: Observable<Group>;
  membersObservable: Observable<Profile[]> = from([]);
  isGroupOwner!: boolean;

  constructor(public databaseService: DatabaseService,
              public activatedRoute: ActivatedRoute,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.setData();
  }

  setData(): void {
    const groupId = this.activatedRoute.snapshot.paramMap.get('id');

    if (groupId === null) return;

    this.group = this.databaseService.retrieveGroup(groupId);

    // if (this.group.ownerId == this.authService.getUserUID()) {
    //   this.isGroupOwner = true;
    //   return;
    // }
    // this.isGroupOwner = false;
  }

  async showEditMemberActionSheet(member: Profile): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Edit member',
      buttons: [{
        text: 'Remove from group.',
        icon: 'trash',
        handler: () => {
          // this.databaseService.deleteMember(this.group.id)
        }
      },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  /**
   * Copies the provided group code to the device's clipboard.
   *
   * @param {string} groupCode The group code to be copied.
   * @returns {Promise<void>} A promise that resolves when the group code has been copied to the clipboard successfully.
   */
  async copyGroupCode(groupCode: string): Promise<void> {
    console.log('Trying to copy the group code...')
    await Clipboard.write({
      string: `${groupCode}`
    });
  }

  //region Not implemented
  private giveOwnership(userId: string): void {
    console.log(`Gave ownership to ${userId}`);
  }

  private deleteMember(userId: string): void {

  }
  //endregion

  /**
   * Displays a modal for creating a new event.
   *
   * @returns {Promise<void>} A promise that resolves when the modal is presented.
   */
  async showNewEventModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: NewEventComponent
    });
    return await modal.present();
  }
}
