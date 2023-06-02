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

  /**
   * Sets the theme value in preferences and applies the theme.
   *
   * @param {boolean} darkTheme - A boolean value indicating whether the dark theme should be set (true) or unset (false).
   * @returns {Promise<void>} A promise that resolves when the theme is successfully set and applied.
   */
  async setTheme(darkTheme: boolean): Promise<void> {
    await Preferences.set({
      key: this.#key,
      value: darkTheme.toString()
    });
    this.#toggleTheme(darkTheme);
  }

  /**
   * Retrieves the current theme value from the preferences.
   *
   * @returns {Promise<string>} A promise that resolves with the current theme value.
   */
  async getTheme(): Promise<string> {
    const {value} = await Preferences.get({key: this.#key});
    return value ?? '';
  }

  /**
   * Loads data asynchronously, including retrieving the current theme value from preferences and applying the theme.
   *
   * @returns {Promise<void>} A promise that resolves when the data loading is complete.
   * @private
   */
  async #loadData(): Promise<void> {
    const darkTheme = await this.getTheme() === 'true';
    this.#toggleTheme(darkTheme);
  }

  /**
   * Toggles the theme of the application by adding or removing the 'dark' class from the body element.
   *
   * @param {boolean} darkTheme - A boolean value indicating whether the dark theme should be applied (true) or removed (false).
   * @returns {void}
   * @private
   */
  #toggleTheme(darkTheme: boolean): void {
    document.body.classList.toggle('dark', darkTheme);
  }
}
