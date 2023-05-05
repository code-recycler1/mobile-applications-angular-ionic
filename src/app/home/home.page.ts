import { Component, OnInit } from '@angular/core';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header:'New',
      buttons: [
        {
          text: 'Event',
          data: {
            action: 'share',
          },
        },
      ],
    });

    await actionSheet.present();
  }
}
