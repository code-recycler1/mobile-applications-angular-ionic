import {Injectable} from '@angular/core';
import {firstValueFrom, map, Observable, Subscription} from 'rxjs';
import {AuthService} from './auth.service';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  deleteDoc,
  updateDoc,
  where, docData, getDocs
} from '@angular/fire/firestore';
import {Profile} from '../types/profile';
import {User} from 'firebase/auth';
import {Group} from '../types/group';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  userSubscription: Subscription;

  constructor(private authService: AuthService, private firestore: Firestore) {
    this.userSubscription = this.authService.currentUser.subscribe(u => this.#handleLogIn(u));
  }

  //region Log in

  async #isFirstLogIn(user: User): Promise<boolean> {
    const result = await firstValueFrom(
      collectionData<Profile>(
        query<Profile>(
          this.#getCollectionRef('profiles'),
          where('id', '==', user.uid)
        )
      )
    );

    return result.length === 0;
  }

  async #handleLogIn(user: User | null): Promise<void> {
    if (!user || !user?.displayName || !user?.email || !user?.photoURL) {
      return;
    }

    const isFirstLogIn = await this.#isFirstLogIn(user);
    if (!isFirstLogIn && user.displayName) {
      return;
    }
  }

  //endregion

  //region getRef

  /**
   * Retrieve a reference to a specific collection, this is required to retrieve data in that collection.
   * The type of the reference (<T>) can be set to the type of object that is stored in the collection.
   *
   * @param collectionName The name of the collection.
   * @private
   */
  #getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }

  /**
   * Retrieve a reference to a specific document in a specific collection, this is required to perform read, update and
   * delete operations on the data in that collection. The type of the reference (<T>) can be set to the type of object
   * that is stored in the document.
   *
   * @param collectionName The name of the collection.
   * @param id             The id of the document to which the reference points.
   * @private
   */
  #getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.firestore, `${collectionName}/${id}`) as DocumentReference<T>;
  }

  //endregion

  //region GroupService

  async createGroup(name: string, street: string, city: string, members: string[] = []): Promise<void> {
    const currentUserId = this.authService.currentUser?.value?.uid;
    if (!currentUserId) {
      throw new Error(`Can't create a new group when not logged in.`);
    }

    const code = this.generateRandomCode(10);

    const newGroup: Group = {
      name,
      street,
      city,
      code,
      ownerId: currentUserId,
      memberIds: [...members, currentUserId]
    };

    await addDoc<Group>(
      this.#getCollectionRef<Group>('groups'),
      newGroup
    );
  }

  //TODO: Get the group document where the document id matches the groupId,
  // remove the this.authService.getUserUID() from the memberIds array
  async leaveGroup(groupId: string): Promise<void> {
    const groupDocData = docData<Group>(this.#getDocumentRef('groups', groupId));
  }

//Not implemented because of free 20k limit of deleting documents on firebase
  async deleteAllOwnedGroups(): Promise<void> {
    const myGroups = await getDocs(query<Group>(
      this.#getCollectionRef('groups'),
      where('ownerId', '==', this.authService.getUserUID())
    ));

    const deletePromises = myGroups.docs.map(group => deleteDoc(group.ref));

    await Promise.all(deletePromises);
  }

  //TODO: Add a check to see if the group.ownerId matches the this.authService.getUserUID()
  async deleteGroup(groupId: string): Promise<void> {
    await deleteDoc(this.#getDocumentRef('groups', groupId));
  }

  retrieveMyGroupsList(): Observable<Group[]> {
    return collectionData<Group>(
      query<Group>(
        this.#getCollectionRef('groups'),
        where('memberIds', 'array-contains', this.authService.getUserUID())
      ),
      {idField: 'id'}
    );
  }

  retrieveGroup(groupId: string): Observable<Group> {
    return docData<Group>(this.#getDocumentRef('groups', groupId));
  }

  //endregion

  //region ProfileService

  async createProfile(user: User, dob: string, firstname: string, lastname: string) {
    if (!user.email) {
      return;
    }
    const newProfile: Profile = {
      dob,
      email: user.email,
      firstname,
      id: user.uid,
      lastname
    };

    await addDoc<Profile>(
      this.#getCollectionRef<Profile>('profiles'),
      newProfile
    );
  }

  //TODO: Get the profile document where the profile.id matches the this.authService.getUserUID()
  retrieveProfile(): Observable<Profile> {
    const queryRef = query<Profile>(
      this.#getCollectionRef('profiles'),
      where('id', '==', this.authService.getUserUID()),
    );

    return collectionData<Profile>(queryRef).pipe(
      map((profiles: Profile[]) => {
        if (profiles.length > 0) {
          return profiles[0];
        } else {
          console.log(profiles);
          throw new Error('Profile not found');
        }
      })
    );
  }

  //TODO: Get the profile document where the profile.id matches the this.authService.getUserUID() and delete it
  async deleteMyProfile(): Promise<void> {

    // await deleteDoc();
  }

  //endregion

  private generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
