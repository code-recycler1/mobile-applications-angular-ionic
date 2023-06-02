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

  /**
   * Sets the initial data for the component.
   * - Retrieves the theme preference from the setting service.
   * - Retrieves the profile data from the database service.
   * @returns A Promise that resolves when the data is retrieved and set.
   */
  async setData(): Promise<void> {
    this.darkTheme = await this.settingService.getTheme() === 'true';
    this.profile = this.databaseService.retrieveProfile();
  };

  /**
   * Signs out the current user.
   * @returns A Promise that resolves when the sign-out process is complete.
   */
  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  /**
   * Toggles the theme between dark and light.
   * Updates the `darkTheme` property and sets the theme using the `settingService`.
   * @returns A Promise that resolves when the theme is successfully set.
   */
  async toggleTheme(): Promise<void> {
    this.darkTheme = !this.darkTheme;
    await this.settingService.setTheme(this.darkTheme);
  }

  /**
   * Presents an alert to confirm the deletion of the user's account.
   * If the deletion is confirmed, the user's profile and account are deleted from the database and authentication service.
   * If an error occurs during the deletion process, an error message is set.
   * @returns A Promise that resolves when the deletion process is complete.
   */
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
