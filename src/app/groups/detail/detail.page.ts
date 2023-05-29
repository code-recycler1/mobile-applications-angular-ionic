import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../data/types/group';
import {Profile} from '../../data/types/profile';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {firstValueFrom, Observable, of} from 'rxjs';
import {DatabaseService} from '../../data/services/database.service';
import {Clipboard} from '@capacitor/clipboard';
import {AuthService} from '../../data/services/auth.service';
import {NewEventComponent} from '../../../shared/new-event/new-event.component';
import {NewGroupComponent} from '../../../shared/new-group/new-group.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  group!: Observable<Group>;
  groupId!: string | null;
  membersObservable: Observable<Profile[]> = of([]);
  isGroupOwner!: boolean;
  isPartOfGroup!: boolean;

  constructor(public databaseService: DatabaseService,
              private activatedRoute: ActivatedRoute,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.setData();
  }

  setData(): void {
    this.groupId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.groupId === null) return;

    this.group = this.databaseService.retrieveGroup(this.groupId);
    const currentUserId = this.authService.getUserUID();

    if (!currentUserId) return;

    this.group.subscribe((group: Group) => {
      if (group.memberIds?.includes(currentUserId)) {
        this.isGroupOwner = group.ownerId === currentUserId;
      } else {
        this.isPartOfGroup = false;
      }
    });
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
    console.log('Trying to copy the group code...');
    await Clipboard.write({
      string: `${groupCode}`
    });
  }

  //region Not implemented
  private giveOwnership(userId: string): void {

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
      component: NewEventComponent,
      componentProps: {
        groupId: this.groupId,
        groupName: await firstValueFrom(this.group).then(g => g.name),
      }
    });
    return await modal.present();
  }

  async showEditGroupModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: NewGroupComponent,
      componentProps: {
        group: await firstValueFrom(this.group),
        groupId: this.groupId
      }
    });
    return await modal.present();
  }
}
