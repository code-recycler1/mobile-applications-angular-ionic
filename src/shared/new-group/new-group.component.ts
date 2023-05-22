import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {DatabaseService} from '../../app/data/services/database.service';
import {Group} from '../../app/data/types/group';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss'],
})
export class NewGroupComponent implements OnInit {

  @Input()
  group?: Group = undefined;
  @Input()
  groupId?: string;
  name: string = '';
  street: string = '';
  city: string = '';
  error: string = '';

  constructor(private databaseService: DatabaseService,
              public modalCtrl: ModalController,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    if (this.group) {
      console.log(this.groupId);
      this.name = this.group.name;
      this.street = this.group.street;
      this.city = this.group.city;
    }
  }

  async cancel(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  async createGroup(): Promise<void> {
    if (!this.name || !this.street || !this.city) {
      this.error = 'All fields are required.';
      return;
    }

    if (this.group && this.groupId) {
      await this.databaseService.editGroup(this.groupId, this.name, this.street, this.city);
    } else {
      await this.databaseService.createGroup(this.name, this.street, this.city);
    }
    await this.modalCtrl.dismiss();
  }
}
