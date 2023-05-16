import {Injectable} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DatabaseService} from './database.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  //region ctor
  constructor(private router: Router,
              private actionSheetCtrl: ActionSheetController) {
  }

  //endregion

  //region Delete Group



  //endregion

  //region Join Group
  // private joinGroup(code: string): void {
  //   const group = this.getGroupByCode(code);
  //
  //   if (group) {
  //     if (this.#myGroups.indexOf(group)) return;
  //     this.#myGroups.push(group);
  //   }
  // }

  //endregion

  //region Leave Group
  async presentLeaveGroupActionSheet(groupId: string, groupName: string): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Are you sure you want to leave "${groupName}" ?`,
      buttons: [
        {
          text: 'Leave',
          role: 'destructive',
          handler: () => {
            this.leaveGroup(groupId);
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

  private leaveGroup(groupId: string): void {
  }

  //endregion

  //region Helpers



  //endregion

  //region Methods
  //region Get
  // getGroupById(groupId: string): Group | undefined {
  //   return this.#groupList.find(g => g.id == groupId);
  // }
  //
  // getGroupByCode(code: string): Group | undefined {
  //   return this.#groupList.find(g => g.code == code);
  // }
  //
  // getAllGroups(): Group[] {
  //   return this.#groupList;
  // }
  //
  // getMyGroups(): Group[] {
  //   return this.#groupList;
  // }

  //endregion
  //endregion

}
