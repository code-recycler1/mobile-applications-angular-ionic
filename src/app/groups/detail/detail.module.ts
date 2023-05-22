import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import {MemberItemComponent} from './member-item/member-item.component';
import {NewEventComponent} from './new-event/new-event.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    SharedModule
  ],
  declarations: [DetailPage, MemberItemComponent, NewEventComponent]
})
export class DetailPageModule {}
