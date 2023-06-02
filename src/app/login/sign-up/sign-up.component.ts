import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../data/services/auth.service';
import {DatabaseService} from '../../data/services/database.service';
import {User} from 'firebase/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  dob: string = '';
  email: string = '';
  firstname: string = '';
  lastname: string = '';
  password: string = '';
  repeatPassword: string = '';
  maxDate: string;
  minimumAge: number = 16;
  error: string = '';

  constructor(private authService: AuthService,
              private databaseService: DatabaseService) {
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear() - this.minimumAge, currentDate.getMonth(), currentDate.getDate());
    this.maxDate = maxDate.toLocaleString();
  }

  ngOnInit(): void {
  }

  /**
   * Validates the selected date of birth and checks if the user is at least 16 years old.
   * If the selected date is invalid or the user is below the age limit, an error message is displayed.
   */
  validateDate(): void {
    const selectedDate = new Date(this.dob);
    const currentDate = new Date();
    const ageLimitDate = new Date(currentDate.getFullYear() - this.minimumAge, currentDate.getMonth(), currentDate.getDate());

    if (selectedDate > currentDate || selectedDate > ageLimitDate) {
      this.dob = '';
      this.error = 'You must be at least 16.';
    } else {
      this.error = '';
    }
  }

  /**
   * Validates the passwords by comparing the password and repeat password fields.
   *
   * @returns {boolean} True if the passwords match, false otherwise.
   */
  validatePasswords(): boolean {
    return this.password === this.repeatPassword;
  }

  /**
   * Validates the user input and performs the sign-up process.
   * If the validation fails or an error occurs during the sign-up process, an error message is set.
   * @returns A Promise that resolves when the sign-up process is complete.
   */
  async validate(): Promise<void> {
    if (!this.dob || !this.email || !this.firstname || !this.lastname || !this.password) {
      return;
    }

    if (!this.validatePasswords()) {
      this.error = 'Passwords do not match';
      return;
    }

    const displayName: string = `${this.firstname} ${this.lastname}`;

    //Sign up
    const user: User = await this.authService.signUp(this.email, displayName, this.password);
    //Create the profile in the database
    await this.databaseService.createProfile(user, this.dob, this.firstname, this.lastname);
  }
}
