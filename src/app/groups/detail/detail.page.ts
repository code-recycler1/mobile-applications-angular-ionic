import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../data/services/group.service';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../data/types/group';
import {Profile} from '../../data/types/profile';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  group!: Group;
  members: Profile[] = [];
  isGroupOwner!: boolean;

  constructor(public groupService: GroupService,
              public activatedRoute: ActivatedRoute,
              public actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit(): void {
    console.log('DetailPage triggered...');
    this.setData();
  }

  setData(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id === null) return;

    const group = this.groupService.getGroupById(Number(id));

    if (group) {
      this.group = group;
    }
  }

  async presentEditMemberAlert(member: Profile): Promise<void> {
    let ownerButtons = [{
      text: 'Give ownership',
      cssClass: '',
      handler: () => {
        this.giveOwnership(member.id);
      }
    }, {
      text: 'Remove',
      cssClass: '',
      handler: () => {
        this.deleteMember(member.id);
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

  private giveOwnership(userId: string): void {
    console.log(`Gave ownership to ${userId}`);
  }

  private deleteMember(userId: string): void {

  }
}
