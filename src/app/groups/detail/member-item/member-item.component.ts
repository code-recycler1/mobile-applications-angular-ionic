import {Component, Input, OnInit} from '@angular/core';
import {Profile} from '../../../data/types/profile';
import {GroupService} from '../../../data/services/group.service';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {

  @Input() member!: Profile;

  isGroupOwner!: boolean;
  isEmpty!: boolean;

  //region ctor
  constructor(public groupService: GroupService) {
  }

  //endregion

  //region ng
  ngOnInit(): void {
    console.log('MemberItemComponent triggered...');
  }

  //endregion


}
