import {Injectable} from '@angular/core';
import {Group} from '../datatypes/group';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {MemberService} from './member.service';
import {User} from '../datatypes/user';
import {Router} from '@angular/router';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  #groupList: Group[] = [];
  #id: number = 1;
  #ownerId: number = 1;

  constructor(public memberService: MemberService,
              public userService: UserService,
              private router: Router,
              private actionSheetCtrl: ActionSheetController,
              private alertController: AlertController) {
    this.#groupList = this.getAllGroups();
  }

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
      _id: this.#id,
      name,
      code: this.generateRandomCode(10),
      ownerId: this.#ownerId,
      members: [this.#ownerId]
    });
    this.#id++;
  }

  //endregion

  //region Delete Group
  async presentDeleteGroupActionSheet(id: number, name?: string): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Are you sure you want to delete "${name}"`,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteGroup(id);
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

  private deleteGroup(id: number): void {
    this.#groupList = this.#groupList.filter(t => t._id !== id);
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
            this.joinGroup(data.code);
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

  private joinGroup(code: string): void {
    this.#groupList.push();
  }

  //endregion

  //region Leave Group
  async presentLeaveGroupActionSheet(id: number, name: string): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Are you sure you want to leave "${name}" ?`,
      buttons: [
        {
          text: 'Leave',
          role: 'destructive',
          handler: () => {
            this.leaveGroup(id);
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

  private leaveGroup(id: number): void {
    this.#groupList = this.#groupList.filter(t => t._id !== id);
  }

  //endregion

  //region Helper Methods
  generateDummyGroups(): void {
    for (let i = 1; i <= 10; i++) {
      this.#groupList.push({
        name: 'Group ' + i,
        _id: this.#id,
        code: i == 2 ? 'testGroupCode' : this.generateRandomCode(10),
        ownerId: i == this.#ownerId ? this.#ownerId : i,
        members: this.memberService.generateDummyMembers()
      });
      this.#id++;
    }
  }

  getAllGroups(): Group[] {
    return this.#groupList;
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
  getGroup(id: number): Group | undefined {
    return this.#groupList.find(g => g._id == id);
  }

  getAllGroupMembers(memberIds: number[]): User[] {
    const users: User[] = [];
    for (const id in memberIds) {
      const user = this.userService.getUserById(Number(id));
      if (user !== undefined) {
        users.push(user);
      }
    }
    return users;
  }
}
