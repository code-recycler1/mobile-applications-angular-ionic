import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AuthService} from '../data/services/auth.service';
import {Profile} from '../data/types/profile';
import {Observable} from 'rxjs';
import {DatabaseService} from '../data/services/database.service';
import {SettingService} from '../data/services/setting.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {

  profile!: Observable<Profile>;
  darkTheme!: boolean;

  constructor(private authService: AuthService,
              private alertController: AlertController,
              private databaseService: DatabaseService,
              private settingService: SettingService) {
  }

  ngOnInit(): void {
    this.setData().then();
  }

  async setData(): Promise<void> {
    this.darkTheme = await this.settingService.getTheme() === 'true';

    const uid = this.authService.currentUser.value?.uid;
    console.log(uid);

    if (!uid) return;

    this.profile = this.databaseService.retrieveProfile(uid);
    console.log(this.profile);
  };

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  async toggleTheme(): Promise<void> {
    this.darkTheme = !this.darkTheme;
    await this.settingService.setTheme(this.darkTheme);
  }

  async presentDeleteAccountAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete your account?',
      subHeader: 'This action can\'t be undone!',
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
