import {Component, Input, OnInit} from '@angular/core';
import {Profile} from '../../../data/types/profile';
import {DatabaseService} from '../../../data/services/database.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {

  @Input()
  member!: Profile;
  @Input()
  isGroupOwner!: boolean;
  @Input()
  ownerId!: string;
  @Input()
  groupId?: string | null;

  //region ctor
  constructor(private databaseService: DatabaseService, public alertController: AlertController) {
  }

  //endregion

  //region ng
  ngOnInit(): void {

  }

  //endregion


 async presentDeleteMemberAlert() : Promise<void> {
    const alert = await this.alertController.create({
      header: `Are you sure you want to delete ${this.member.firstname} ${this.member.lastname}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            console.log(this.groupId, this.member.id)
            if (this.groupId){
              await this.databaseService.deleteMember(this.groupId, this.member.id);
            }
          },
        },
      ]
    });

    await alert.present();
  }
}
