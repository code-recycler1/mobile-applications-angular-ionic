import {Component, Input, OnInit} from '@angular/core';
import {Group} from '../../app/data/types/group';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupService} from '../../app/data/services/group.service';

@Component({
  selector: 'app-group-item[group]',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
})
export class GroupItemComponent implements OnInit {

  @Input() group!: Group;

  isGroupOwner!: boolean;

  constructor(public groupService: GroupService,
              public activatedRoute: ActivatedRoute, public router: Router) {
  }

  ngOnInit(): void {

  }

}
