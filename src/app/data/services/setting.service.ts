import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  readonly #key = 'darkTheme';

  constructor() {
    this.#loadData().then();
  }

  async setTheme(darkTheme: boolean): Promise<void> {
    await Preferences.set({
      key: this.#key,
      value: darkTheme.toString()
    });
    this.toggleTheme(darkTheme);
  }

  async getTheme(): Promise<string> {
    const {value} = await Preferences.get({key: this.#key});
    return value ?? '';
  }

  async #loadData(): Promise<void> {
    const darkTheme = await this.getTheme() === 'true';
    this.toggleTheme(darkTheme);
  }

  private toggleTheme(darkTheme: boolean) {
    document.body.classList.toggle('dark', darkTheme);
  }
}
