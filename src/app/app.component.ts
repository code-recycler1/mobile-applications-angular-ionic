import {Component} from '@angular/core';
import {GroupService} from '../services/group.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public groupService: GroupService,
              public userService: UserService) {
    this.userService.generateDummyUsers(20);
    this.groupService.generateDummyGroups();
  }
}
