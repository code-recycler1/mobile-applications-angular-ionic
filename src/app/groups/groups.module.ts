import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsPageRoutingModule } from './groups-routing.module';

import { GroupsPage } from './groups.page';
import {GroupItemComponent} from './group-item/group-item.component';
import {NewGroupComponent} from './new-group/new-group.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsPageRoutingModule
  ],
    declarations: [GroupsPage, GroupItemComponent, NewGroupComponent]
})
export class GroupsPageModule {}
