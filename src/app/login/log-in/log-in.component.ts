import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../data/services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {

  email: string = 'bart.simp@groening.com';
  password: string = 'test123';
  error: string = '';

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  async validate(): Promise<void> {
    if (!this.email || !this.password) {
      return;
    }

    try {
      await this.authService.logInWithEmailAndPassword(this.email, this.password);
    } catch (e: any) {
      if (e) {
        this.error = 'E-mail not found.'
      }
    }
  }
}
