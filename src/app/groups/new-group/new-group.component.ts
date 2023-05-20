import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GroupService} from '../../data/services/group.service';
import {DatabaseService} from '../../data/services/database.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss'],
})
export class NewGroupComponent implements OnInit {

  name: string = '';
  street: string = '';
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
    if (!this.name || !this.street || !this.city) {
      this.error = 'All fields are required.'
      return;
    }
    await this.databaseService.createGroup(this.name, this.street, this.city);
    await this.modalCtrl.dismiss();
  }
}
