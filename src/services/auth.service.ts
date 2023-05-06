import {Injectable} from '@angular/core';
import {updateProfile, PhoneAuthProvider, User} from 'firebase/auth';
import {Auth, signInWithCredential, signOut, Unsubscribe} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {Capacitor} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);
  #verificationId?: string;
  #authUnsubscribe: Unsubscribe;

  constructor(private auth: Auth, private router: Router) {
    this.#authUnsubscribe = this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }
  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }
  getDisplayName(): string | undefined {
    return this.currentUser.value?.displayName ?? undefined;
  }
  async sendPhoneVerificationCode(phoneNumber: string): Promise<void> {
    const listener = FirebaseAuthentication.addListener('phoneCodeSent', ({verificationId}) => {
      this.#verificationId = verificationId;
      listener.remove();
    });
    await FirebaseAuthentication.signInWithPhoneNumber({phoneNumber});
  }

  async signInWithPhoneNumber(verificationCode: string): Promise<void> {
    if (!this.#verificationId) {
      throw new Error(`No valid verificationId found, ensure the sendPhoneVerificationCode method was called first.`);
    }

    const credential = PhoneAuthProvider.credential(this.#verificationId, verificationCode);
    await signInWithCredential(this.auth, credential);
  };

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
  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();

    if (Capacitor.isNativePlatform()) {
      await signOut(this.auth);
    }
  }
}
