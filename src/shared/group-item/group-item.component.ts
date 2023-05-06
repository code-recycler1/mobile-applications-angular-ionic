import {Component, Input, OnInit} from '@angular/core';
import {Group} from '../../datatypes/group';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../services/group.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-group-item[group]',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
})
export class GroupItemComponent implements OnInit {

  @Input() group!: Group;

  isGroupOwner!: boolean;

  constructor(public groupService: GroupService, public userService: UserService,
              public activatedRoute: ActivatedRoute, public router: Router) {
  }

  ngOnInit(): void {
    if (this.group?.ownerId == this.userService.getUserById(1)?._id){
      this.isGroupOwner = true;
    }
  }

}
