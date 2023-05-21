import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../data/types/group';
import {Profile} from '../../data/types/profile';
import {ActionSheetController} from '@ionic/angular';
import {from, Observable} from 'rxjs';
import {DatabaseService} from '../../data/services/database.service';
import {Clipboard} from '@capacitor/clipboard';

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
              public actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit(): void {
    this.setData();
  }

  setData(): void {
    const groupId = this.activatedRoute.snapshot.paramMap.get('id');

    if (groupId === null) return;

    this.group = this.databaseService.retrieveGroup(groupId);
    console.log(this.group);
  }

  async presentEditMemberActionSheet(member: Profile): Promise<void> {
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

  async copyGroupCode(groupCode: string): Promise<void> {
    await Clipboard.write({
      string: `${groupCode}`
    });
  }

  //Not implemented yet
  private giveOwnership(userId: string): void {
    console.log(`Gave ownership to ${userId}`);
  }

  private deleteMember(userId: string): void {

  }

  deleteGroup() {

  }
}
