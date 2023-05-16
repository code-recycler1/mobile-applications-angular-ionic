import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../data/services/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {

  email: string = 'test@test.com';
  password: string = '123456';
  // Used when this is the first login, the user must set a display name because
  // it can't be retrieved from a phone number. Google, Facebook, Twitter, ... don't require this.
  gettingUserInformation = false;

  // The chosen display name.
  displayName = '';

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  async validate(): Promise<void> {
    if (!this.email || !this.password) {
      return;
    }

    await this.authService.signInWithEmailAndPassword(this.email, this.password);
//
    await this.#handleFirstLogIn();
  }

  async setUserName(): Promise<void> {
    await this.authService.updateDisplayName(this.displayName);
  }

  async #handleFirstLogIn(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.gettingUserInformation = true;

    const displayName = this.authService.getDisplayName();
    if (displayName && displayName.length > 0) {
      console.log(`Displayname is ${displayName}`);
    } else {
      this.gettingUserInformation = true;
    }
  }
}
