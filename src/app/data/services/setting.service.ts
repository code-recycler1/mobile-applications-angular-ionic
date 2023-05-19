import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  readonly #key = 'darkTheme';
  #value = '';

  constructor() {
    this.#loadData().then();
  }

  async setTheme(): Promise<void> {
    this.#value = this.#value === 'light' ? 'dark' : 'light';
    await Preferences.set({
      key: this.#key,
      value: this.#value
    });
  }

  async getTheme(): Promise<boolean> {
    const theme = await Preferences.get({ key: this.#key });
    this.#value = theme?.value ?? '';
    return this.#value === 'dark';
  }

  async #loadData(): Promise<void> {
    await this.getTheme();
  }

}
