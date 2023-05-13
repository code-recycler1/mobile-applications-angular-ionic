import { Component, OnInit } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AuthService} from '../data/services/auth.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {

  constructor(public authService: AuthService, private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentEditProfileAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header:'Edit Profile',
      inputs: [
        {
          placeholder: 'First name',
        },
        {
          placeholder: 'Last name',
        },
        {
          type: 'date',
          placeholder: 'A little about yourself',
        },
      ]
    });

    await alert.present();

  }
}
