import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';

import {enableMultiTabIndexedDbPersistence,
  getFirestore, provideFirestore} from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore();
      enableMultiTabIndexedDbPersistence(firestore);
      return firestore;
    }),
    provideAuth(() => getAuth())
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
