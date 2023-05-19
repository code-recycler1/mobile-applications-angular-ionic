import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SwiperModule} from 'swiper/angular';

import {IonicModule} from '@ionic/angular';

import {LoginPageRoutingModule} from './login-routing.module';

import {LoginPage} from './login.page';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LogInComponent} from './log-in/log-in.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SwiperModule
  ],
  declarations: [
    LoginPage,
    ForgetPasswordComponent,
    LogInComponent,
    SignUpComponent
  ]
})
export class LoginPageModule {
}
