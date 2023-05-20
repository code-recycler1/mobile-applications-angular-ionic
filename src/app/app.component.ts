import {Component, OnInit} from '@angular/core';
import {SettingService} from './data/services/setting.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private settingService: SettingService) {

  }

  ngOnInit(): void {
    this.setData().then();
  }

  async setData(): Promise<void> {
    this.settingService.getTheme().then();
  }

}
