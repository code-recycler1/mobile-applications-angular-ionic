import { Component, OnInit } from '@angular/core';
import {ActionSheetController, AlertController} from '@ionic/angular';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  constructor(private actionSheetCtrl: ActionSheetController, private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentCreateGroupActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header:'New',
      buttons: [
        {
          text: 'Group',
          data: {
            action: 'share',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async presentLeaveGroupAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to leave "Not Fast, Just Furious" ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK'/*,
            handler: (data) => {
              this.newTask(data.name);
          }*/
        }
      ]
    });

    await alert.present();
  }

  async presentEnterCodeAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Enter the code of the group you want to join:',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK'/*,
            handler: (data) => {
              this.newTask(data.name);
          }*/
        }
      ],
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: ''
        }
      ]
    });

    await alert.present();
  }

  async presentDeleteGroupAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete "Broekkant" ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK'/*,
            handler: (data) => {
              this.newTask(data.name);
          }*/
        }
      ]
    });

    await alert.present();
  }
}
