import {Injectable} from '@angular/core';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {Router} from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signOut,
  Unsubscribe
} from '@angular/fire/auth';
import {updateProfile, EmailAuthProvider, User} from 'firebase/auth';
import {Capacitor} from '@capacitor/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);

  #authUnsubscribe: Unsubscribe;

  constructor(private auth: Auth, private router: Router) {
    this.#authUnsubscribe = this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }

  /**
   * Checks if a user is currently logged in.
   * @returns {boolean} - True if a user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  //region Get methods

  /**
   * Retrieves the display name of the current user.
   * @returns {string | undefined} - The display name of the current user, or undefined if not available.
   */
  getDisplayName(): string | undefined {
    return this.currentUser.value?.displayName ?? undefined;
  }

  /**
   * Retrieves the UID (unique identifier) of the current user.
   * @returns {string | undefined} - The UID of the current user, or undefined if not available.
   */
  getUserUID(): string | undefined {
    return this.currentUser.value?.uid;
  }

  //endregion

  /**
   * Signs out the current user.
   * @returns {Promise<void>} - A promise that resolves when the sign-out process is completed.
   */
  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();

    if (Capacitor.isNativePlatform()) {
      await signOut(this.auth);
    }
  }

  //TODO: Is the if statement necessary?
  /**
   * Deletes the current user account.
   * @returns {Promise<void>} - A promise that resolves when the account deletion process is completed.
   */
  async deleteMyAccount(): Promise<void> {
    await FirebaseAuthentication.deleteUser();

    // if (Capacitor.isNativePlatform()) {
    //   await deleteUser();
    // }

    await this.router.navigate(['/login']);
  }

  /**
   * Sends a password reset email to the provided email address.
   * @param {string} email - The email address to send the password reset email to.
   * @returns {Promise<void>} - A promise that resolves when the password reset email is sent.
   */
  async forgotPassword(email: string): Promise<void> {
    await FirebaseAuthentication.sendPasswordResetEmail({email});
  }

  //region Log in with email and password

  /**
   * Logs in a user using their email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<void>} - A promise that resolves when the login process is completed.
   */
  async logInWithEmailAndPassword(email: string, password: string): Promise<void> {
    const credential = EmailAuthProvider.credential(email, password);
    await signInWithCredential(this.auth, credential);
  }

  //endregion

  //region Sign up

  /**
   * Creates a new user account with the provided email, display name, and password.
   * @param {string} email - The user's email address.
   * @param {string} displayName - The user's display name.
   * @param {string} password - The user's password.
   * @returns {Promise<User>} - A promise that resolves with the created user object.
   */
  async signUp(email: string, displayName: string, password: string): Promise<User> {
    const {user} = await createUserWithEmailAndPassword(this.auth, email, password);

    await this.updateDisplayName(`${displayName}`);

    return user;
  }

  //endregion

  /**
   * Updates the display name of the current user.
   * @param {string} displayName - The new display name.
   * @returns {Promise<void>} - A promise that resolves when the display name is updated.
   */
  async updateDisplayName(displayName: string): Promise<void> {
    if (!this.auth.currentUser) {
      return;
    }

    await updateProfile(this.auth.currentUser, {
      displayName
    });
  }

  /**
   * Sets the current user and performs navigation based on the user's authentication state.
   * @private
   * @param {User | null} user - The current user or null if no user is authenticated.
   * @returns {Promise<void>} - A promise that resolves when the user is set and navigation is performed.
   */
  private async setCurrentUser(user: User | null): Promise<void> {
    this.currentUser.next(user);
    if (this.currentUser.value) {
      await this.router.navigate(['/']);
    } else {
      await this.router.navigate(['/login']);
    }
  }
}
