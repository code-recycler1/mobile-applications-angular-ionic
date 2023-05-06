import {Component, Input, OnInit} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import {User} from '../../datatypes/user';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {

  @Input() member!: User;

  isGroupOwner!: boolean;
  isEmpty!: boolean;

  //region ctor
  constructor(public groupService: GroupService,
              private actionSheetCtrl: ActionSheetController) {
  }
  //endregion

  ngOnInit(): void {
    if (this.member._id == this.groupService.getGroup(1)?.ownerId){
      this.isGroupOwner = true;
    }
  }

  async presentEditMemberAlert(): Promise<void> {
    const alert = await this.actionSheetCtrl.create({
      header: 'Jackie Robinson',
      buttons: [{
        text: '',
        cssClass: 'copy-button'
      }, {
        text: 'Give ownership'
      }, {
        text: 'Remove'
      }, {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary'
      }]
    });

    await alert.present();

    const copyButtonEl = document.querySelector('.copy-button');
    copyButtonEl!.innerHTML = 'Copy phone number <ion-icon name="copy-outline"></ion-icon>';
  }
}
