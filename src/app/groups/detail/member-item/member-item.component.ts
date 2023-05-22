import {Component, Input, OnInit} from '@angular/core';
import {Profile} from '../../../data/types/profile';
import {DatabaseService} from '../../../data/services/database.service';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {

  @Input()
  member!: Profile;

  isGroupOwner!: boolean;
  isEmpty!: boolean;

  //region ctor
  constructor(public databaseService: DatabaseService) {
  }

  //endregion

  //region ng
  ngOnInit(): void {
    console.log('MemberItemComponent triggered...');
  }

  //endregion


}
