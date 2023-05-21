import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {DatabaseService} from '../../data/services/database.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss'],
})
export class NewGroupComponent implements OnInit {

  name: string = '';
  street: string = '';
  streetNumber: string = '';
  city: string = '';
  error: string = '';

  constructor(private databaseService: DatabaseService,
              public modalCtrl: ModalController) {
  }

  ngOnInit(): void {
  }

  async cancel(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  async createGroup(): Promise<void> {
    if (!this.name || !this.street || !this.streetNumber|| !this.city) {
      this.error = 'All fields are required.'
      return;
    }
    const streetAndNumber = `${this.street} ${this.streetNumber}`

    await this.databaseService.createGroup(this.name, streetAndNumber, this.city);
    await this.modalCtrl.dismiss();
  }
}
