import {Component, OnInit} from '@angular/core';
import {GroupService} from '../services/group.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public groupService: GroupService,
              public userService: UserService) {
  }

  ngOnInit(): void {
    console.log('AppComponent triggered...');
    this.setData();
  }

  setData(): void {
    this.userService.generateDummyUsers(30);
    this.groupService.generateDummyGroups(20);
  }
}
