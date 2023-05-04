import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  readonly #key = '';
  readonly #value = '';

  constructor() {
    this.#loadData().then();
  }

  async setTheme(): Promise<void> {
    await Preferences.set({
      key: 'theme',
      value: 'true' ? 'false' : 'true'
    });
    console.log(`dark theme: ${this.#value}`);
  }

  async getTheme(): Promise<void> {
    await Preferences.get({
      key: this.#key
    });
  }

  async #loadData(): Promise<void> {
    await this.getTheme();
  }

}
