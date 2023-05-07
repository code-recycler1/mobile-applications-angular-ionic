import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../datatypes/user';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {

  @Input() member!: User;

  isGroupOwner!: boolean;
  isEmpty!: boolean;

  //region ctor
  constructor(public groupService: GroupService) {
  }

  //endregion

  //region ng
  ngOnInit(): void {
    console.log('MemberItemComponent triggered...');
    if (this.member._id == this.groupService.getGroupById(1)?.ownerId) {
      this.isGroupOwner = true;
    }
    console.log(this.isGroupOwner);
  }

  //endregion


}
