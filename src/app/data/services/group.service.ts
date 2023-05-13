import {Injectable} from '@angular/core';
import {Group} from '../types/group';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  #id: number = 1;
  #ownerId: number = 1;
  #groupList: Group[] = this.generateDummyGroups(10);
  #myGroups: Group [] = this.getMyGroups();

  //region ctor
  constructor(private router: Router,
              private actionSheetCtrl: ActionSheetController,
              private alertController: AlertController) {
    console.log('All Groups', this.#groupList);
  }

  //endregion

  //region Create Group
  async presentCreateGroupAlert(name?: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'New Group',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {
            if (data.name.trim() === '') {
              this.presentInvalidGroupNameAlert();
              return false;
            } else if (this.#groupList.find(g => g.name == data.name)) {
              this.presentGroupNameTakenAlert(data.name);
              return false;
            } else {
              return this.createGroup(data.name);
            }
          }
        }
      ],
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: `${name ?? ''}`,
          placeholder: 'Enter group name',
          attributes: {
            minlength: 1,
            maxlength: 30
          }
        }
      ]
    });

    await alert.present();
  }

  async presentInvalidGroupNameAlert(): Promise<void> {
    const alert = await this.alertController.create({
      message: 'Group name cannot be empty. Please enter a valid name.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentGroupNameTakenAlert(groupName: string): Promise<void> {
    const alert = await this.alertController.create({
      message: `"${groupName}" already exists. Please choose a different name.`,
      buttons: ['OK']
    });

    await alert.present();
  }

  private createGroup(name: string): void {
    this.#groupList.push({
      id: this.#id,
      name,
      code: this.generateRandomCode(10),
      ownerId: this.#ownerId,
      memberIds: [this.#ownerId]
    });
    this.#id++;
  }

  //endregion

  //region Delete Group
  async presentDeleteGroupActionSheet(groupId: number, name?: string): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Are you sure you want to delete "${name}"`,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteGroup(groupId);
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

  private deleteGroup(groupId: number): void {
    this.#groupList = this.#groupList.filter(t => t.id !== groupId);
    this.router.navigateByUrl('/tabs/groups').then();
  }

  //endregion

  //region Join Group
  async presentEnterGroupCodeAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Enter the code of the group you want to join:',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Join',
          handler: (data) => {

          }
        }
      ],
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: ''
        }
      ]
    });

    await alert.present();
  }

  async presentInvalidCodeAlert(): Promise<void> {
    const alert = await this.alertController.create({
      message: 'Please enter a valid code.',
      buttons: ['OK']
    });

    await alert.present();
  }

  private joinGroup(code: string): void {
    const group = this.getGroupByCode(code);

    if (group) {
      if (this.#myGroups.indexOf(group)) return;
      this.#myGroups.push(group);
    }
  }

  //endregion

  //region Leave Group
  async presentLeaveGroupActionSheet(groupId: number, groupName: string): Promise<void> {
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

  private leaveGroup(groupId: number): void {
    this.#groupList = this.#groupList.filter(t => t.id !== groupId);
  }

  //endregion

  //region Helpers
  generateDummyGroups(count: number): Group[] {
    const dummyGroups: Group[] = [];

    for (let i = 1; i <= count; i++) {
      let group = {
        name: 'Group ' + i,
        id: this.#id,
        code: i == 2 ? 'testGroupCode' : this.generateRandomCode(10),
        ownerId: i,
        memberIds: [i]
      };
      dummyGroups.push(group);
      this.#id++;
    }

    return dummyGroups;
  }

  private generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //endregion

  //region Methods
  //region Get
  getGroupById(groupId: number): Group | undefined {
    return this.#groupList.find(g => g.id == groupId);
  }

  getGroupByCode(code: string): Group | undefined {
    return this.#groupList.find(g => g.code == code);
  }

  getAllGroups(): Group[] {
    return this.#groupList;
  }

  getMyGroups(): Group[] {
    return this.#groupList;
  }

  //endregion
  //endregion

}
