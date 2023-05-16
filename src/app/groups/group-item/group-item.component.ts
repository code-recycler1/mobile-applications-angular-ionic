import {Component, Input, OnInit} from '@angular/core';
import {Group} from '../../data/types/group';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../data/services/group.service';
import {ActionSheetController} from '@ionic/angular';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-group-item[group]',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
})
export class GroupItemComponent implements OnInit {

  @Input()
  group!: Group;

  isGroupOwner!: boolean;

  constructor(public activatedRoute: ActivatedRoute, public router: Router,
              private actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit(): void {
    console.log(this.group);
  }

  async presentDeleteGroupActionSheet(groupId: string, name?: string): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Are you sure you want to delete "${name}"`,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('deleted group');
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

}
