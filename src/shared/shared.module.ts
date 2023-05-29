import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewGroupComponent} from './new-group/new-group.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {NewEventComponent} from './new-event/new-event.component';


@NgModule({
  declarations: [NewGroupComponent, NewEventComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class SharedModule {
}
