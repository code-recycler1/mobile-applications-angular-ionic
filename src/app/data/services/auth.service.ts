import {Injectable} from '@angular/core';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {Router} from '@angular/router';
import {Auth, signInWithCredential, signOut, Unsubscribe} from '@angular/fire/auth';
import {updateProfile, GoogleAuthProvider, PhoneAuthProvider, User} from 'firebase/auth';
import {Capacitor} from '@capacitor/core';
import {BehaviorSubject} from 'rxjs';

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

  getProfilePic(): string {
    const placeholder = '/assets/Portrait_Placeholder.png';
    return this.currentUser.value?.photoURL ?? placeholder;
  }

  getDisplayName(): string | undefined {
    return this.currentUser.value?.displayName ?? undefined;
  }

  getEmail(): string | undefined {
    return this.currentUser.value?.email ?? undefined;
  }

  getUserUID(): string | undefined {
    return this.currentUser.value?.uid;
  }

  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();

    if (Capacitor.isNativePlatform()) {
      await signOut(this.auth);
    }
  }

  async signInWithGoogle(): Promise<void> {
    // Sign in on the native layer.
    const {credential} = await FirebaseAuthentication.signInWithGoogle();

    // Sign in on the web layer.
    // The plug-in only handles the native layer, for PWA this isn't a problem.
    // However, for native apps this is a problem, as the app is web-based.
    if (Capacitor.isNativePlatform() && credential?.idToken) {
      // A credential can be generated for each supported provider,
      // however, the signature of these methods is varied.
      // Make sure to check the Firebase JavaScript SDK docs to find the required parameters.
      // https://firebase.google.com/docs/auth/web/google-signin
      const newCredential = GoogleAuthProvider.credential(credential?.idToken);
      await signInWithCredential(this.auth, newCredential);
    }
  }

  /**
   * The login process for a phone is seperated in 2 part.
   *  1. A Verification code is send to the user. <-- This method.
   *  2. The verification code is entered on the website and used to log in.
   *
   * @param phoneNumber The phone number to which the verification code must be sent.
   */
  async sendPhoneVerificationCode(phoneNumber: string): Promise<void> {
    const listener = FirebaseAuthentication.addListener('phoneCodeSent', ({verificationId}) => {
      this.#verificationId = verificationId;
      listener.remove();
    });
    await FirebaseAuthentication.signInWithPhoneNumber({phoneNumber});
  }

  /**
   * Authenticate the user through the verification send to his phone number.
   *
   * @param verificationCode
   */
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

  /**
   * Save the new user as an instance variable, and perform any necessary reroutes.
   *
   * @param user The new user.
   * @private
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
