import { Component, OnInit } from '@angular/core';
import {SettingService} from '../../services/setting.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(public settingService: SettingService) { }

  ngOnInit() {
  }

}
