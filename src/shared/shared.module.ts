import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {MemberItemComponent} from '../app/groups/detail/member-item/member-item.component';

@NgModule({
  declarations: [MemberItemComponent],
  exports: [
    MemberItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class SharedModule {
}
