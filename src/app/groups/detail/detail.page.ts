import {Component, OnInit} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  constructor(private actionSheetCtrl: ActionSheetController) {
  }

  ngOnInit() {
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
