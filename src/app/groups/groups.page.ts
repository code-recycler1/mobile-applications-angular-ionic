import {Component, OnInit} from '@angular/core';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  constructor(public groupService: GroupService) {
  }

  ngOnInit() {
  }
}
