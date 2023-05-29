import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AuthService} from '../data/services/auth.service';
import {Profile} from '../data/types/profile';
import {Observable, of, Subscription} from 'rxjs';
import {DatabaseService} from '../data/services/database.service';
import {SettingService} from '../data/services/setting.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit, OnDestroy {
  profile!: Observable<Profile | null>;
  darkTheme!: boolean;
  error: string = '';
  authSubscription!: Subscription;

  constructor(private authService: AuthService,
              private alertController: AlertController,
              private databaseService: DatabaseService,
              private settingService: SettingService) {

  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.setData().then();
      } else {
        this.profile = of(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  async setData(): Promise<void> {
    this.darkTheme = await this.settingService.getTheme() === 'true';
    this.profile = this.databaseService.retrieveProfile();
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
          handler: async () => {
            try {
              await this.databaseService.deleteMyProfile();
              await this.authService.deleteMyAccount();
            } catch (error: any) {
              if (error.code == 'auth/requires-recent-login') {
                this.error = 'You\'re log in is outdated, please log in again.';
              }
            }
          },
        },
      ]
    });

    await alert.present();
  }
}
