import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AuthService} from '../data/services/auth.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {

  constructor(public authService: AuthService, private alertController: AlertController) {
  }

  ngOnInit(): void {
  }

  async presentEditProfileAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Edit Profile',
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

  async presentDeleteAccountAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete your account?',
      subHeader:'This action can\'t be undone!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.authService.deleteMyAccount();
          },
        },
      ]
    });

    await alert.present();
  }
}
