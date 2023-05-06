import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../../datatypes/group';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  group!: Group;
  isGroupOwner!: boolean;

  constructor(public groupService: GroupService,
              public userService: UserService,
              public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.setData();
  }

  setData(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id === null) {
      return;
    }
    const group = this.groupService.getGroup(Number(id));

    if (group) {
      this.group = group;
    }

    if (group?.ownerId == this.userService.getUserById(1)?._id){
      this.isGroupOwner = true;
    }
  }

}
