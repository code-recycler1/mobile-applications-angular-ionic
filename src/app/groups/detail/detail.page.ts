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
  groupId?: string | null;
  members: Observable<Profile[]> = of([]);
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

  /**
   * Sets the data for the component, including retrieving the group information and checking the user's membership status.
   * Also retrieves and sets the profiles of the group members.
   *
   * @returns {void}
   */
  setData(): void {
    this.groupId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.groupId === null) return;

    this.group = this.databaseService.retrieveGroup(this.groupId);
    const currentUserId = this.authService.getUserUID();

    if (!currentUserId) return;

    this.group.subscribe((group: Group) => {
      if (group.memberIds?.includes(currentUserId)) {
        this.isPartOfGroup = true;
        this.isGroupOwner = group.ownerId === currentUserId;
      } else {
        this.isPartOfGroup = false;
      }
      if (group.memberIds) {
        this.databaseService.retrieveProfiles(group.memberIds).subscribe((profiles: Profile[]) => {
          this.members = of(profiles);
        });
      }
    });
  }

  /**
   * Lifecycle hook that is called when the component is being destroyed.
   * Unsubscribes from the group subscription to prevent memory leaks.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.group.subscribe().unsubscribe();
  }

  /**
   * Copies the provided group code to the device's clipboard.
   *
   * @param {string} groupCode The group code to be copied.
   * @returns {Promise<void>} A promise that resolves when the group code has been copied to the clipboard successfully.
   */
  async copyGroupCode(groupCode: string): Promise<void> {
    await Clipboard.write({
      string: `${groupCode}`
    });
  }

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

  /**
   * Shows a modal for editing a group.
   *
   * @returns {Promise<void>} A promise that resolves when the modal is presented.
   */
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
