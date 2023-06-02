import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../data/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {

  email: string = '';
  error: string = '';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  /**
   * Validates the email and sends a password reset request.
   *
   * @returns {Promise<void>} A promise that resolves when the validation is complete.
   */
  async validate(): Promise<void> {
    if (!this.email) {
      this.error = 'E-mail not found.';
      return;
    }

    try {
      await this.authService.forgotPassword(this.email);
    } catch (e: any) {
      if (e) {
        this.error = 'E-mail not found.';
      }
    }
  }

}
