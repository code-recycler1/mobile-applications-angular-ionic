import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../../datatypes/group';
import {UserService} from '../../../services/user.service';
import {User} from '../../../datatypes/user';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  group!: Group;
  members: User[] = [];
  isGroupOwner!: boolean;

  constructor(public groupService: GroupService,
              public userService: UserService,
              public activatedRoute: ActivatedRoute,
              public actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit(): void {
    console.log('DetailPage triggered...')
    this.setData();
  }

  setData(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id === null) {
      return;
    }
    const group = this.groupService.getGroupById(Number(id));

    if (group) {
      this.group = group;
    }

    if (group?.ownerId == this.userService.getUserById(1)?._id) {
      this.isGroupOwner = true;
    }

    for (const memberId in group?.memberIds) {
      const user: User | undefined = this.userService.getUserById(Number(memberId));
      if (user) {
        this.members.push(user);
      }
    }
    console.log(this.members);
  }

  async presentEditMemberAlert(member: User): Promise<void> {
    let ownerButtons = [{
      text: 'Give ownership',
      cssClass: '',
      handler: () => {
        this.giveOwnership(member._id);
      }
    }, {
      text: 'Remove',
      cssClass: '',
      handler: () => {
        this.deleteMember(member._id);
      }
    }];

    const alert = await this.actionSheetCtrl.create({
      header: `${member.firstname} ${member.lastname}`,
      buttons: [{
        text: '',
        cssClass: 'copy-button',
        handler: () => {
          this.copyPhoneNumber(member.phoneNumber);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary'
      }].concat(this.isGroupOwner ? ownerButtons : [])
    });

    await alert.present();

    const copyButtonEl = document.querySelector('.copy-button');
    copyButtonEl!.innerHTML = 'Copy phone number <ion-icon name="copy-outline"></ion-icon>';
  }

  private async copyPhoneNumber(phoneNumber: number): Promise<void> {
    await navigator.clipboard.writeText(String(phoneNumber));
  }

  private giveOwnership(id: number): void {
    console.log(`Gave ownership to ${id}`)
  }

  private deleteMember(id: number): void {

  }
}
