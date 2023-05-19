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
import {DatabaseService} from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);

  #authUnsubscribe: Unsubscribe;

  constructor(private auth: Auth, private router: Router) {
    this.#authUnsubscribe = this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  //region Get methods

  getDisplayName(): string | undefined {
    return this.currentUser.value?.displayName ?? undefined;
  }

  getEmail(): string | undefined {
    return this.currentUser.value?.email ?? undefined;
  }

  getUserUID(): string | undefined {
    return this.currentUser.value?.uid;
  }

  //endregion

  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();

    if (Capacitor.isNativePlatform()) {
      await signOut(this.auth);
    }
  }

  async deleteMyAccount(): Promise<void> {
    await FirebaseAuthentication.deleteUser();

    // if (Capacitor.isNativePlatform()) {
    //   await deleteUser();
    // }

    await this.router.navigate(['/login']);
  }

  async forgotPassword(email: string): Promise<void> {
    await FirebaseAuthentication.sendPasswordResetEmail({email});
  }

  //region Log in with email and password

  async logInWithEmailAndPassword(email: string, password: string): Promise<void> {
    const credential = EmailAuthProvider.credential(email, password);
    await signInWithCredential(this.auth, credential);
  }

  //endregion

  //region Sign up
  async signUp(email: string, displayName: string, password: string): Promise<User> {
    const {user} = await createUserWithEmailAndPassword(this.auth, email, password);

    await this.updateDisplayName(`${displayName}`);

    return user
  }

  //endregion

  async updateDisplayName(displayName: string): Promise<void> {
    if (!this.auth.currentUser) {
      return;
    }

    await updateProfile(this.auth.currentUser, {
      displayName
    });
  }

  private async setCurrentUser(user: User | null): Promise<void> {
    this.currentUser.next(user);
    if (this.currentUser.value) {
      await this.router.navigate(['/']);
    } else {
      await this.router.navigate(['/login']);
    }
  }
}
