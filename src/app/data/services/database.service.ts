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
  DocumentData,
  Firestore,
  orderBy,
  query,
  deleteDoc,
  updateDoc,
  where, docData, getDocs, getDoc, WhereFilterOp, Query
} from '@angular/fire/firestore';
import {Profile} from '../types/profile';
import {User} from 'firebase/auth';
import {Group} from '../types/group';
import {Event} from '../types/event';

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
    const queryRef = this.#createQuery<Profile>('profiles', 'id', '==', user.uid);
    const result = await firstValueFrom(
      collectionData<Profile>(queryRef)
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

  //region Firestore Methods

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

  /**
   * Creates a Firestore query based on the provided parameters.
   *
   * @template T The type of the collection items.
   * @param {string} collectionName The name of the collection.
   * @param {string} fieldPath The path to the field you want to query.
   * @param {WhereFilterOp} opStr The operator for the query (e.g., '==', '<', '>', 'array-contains', etc.).
   * @param {any} value The value to compare against.
   * @returns {Query<T>} The Firestore query.
   */
  #createQuery<T>(collectionName: string, fieldPath: string, opStr: WhereFilterOp, value: string | undefined): Query<T> {
    return query<T>(this.#getCollectionRef<T>(collectionName), where(fieldPath, opStr, value));
  }

  //endregion

  //region Helper Methods

  /**
   * Generates a random code of the specified length.
   *
   * @param {number} length The length of the code to generate.
   * @returns {string} A random code of the specified length.
   */
  private generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //endregion

  //region EventService

  async createEvent(groupId: string, group: string, opponent: string, atHome: boolean, address: string, type: string, date: string): Promise<void> {
    console.log('Trying to create a event...');
    const currentUserId = this.authService.getUserUID();
    if (!currentUserId) {
      throw new Error(`Can't create a new group when not logged in.`);
    }

    const groupDocRef = this.#getDocumentRef<Group>('groups', groupId);
    const groupSnapshot = await getDoc(groupDocRef);
    const memberIds: string[] = [];
    if (groupSnapshot.exists()) {
      const groupDataMemberIds = groupSnapshot.data()?.memberIds;
      if (groupDataMemberIds) {
        memberIds.push(...groupDataMemberIds);
      }
    }

    const newEvent: Event = {
      home: atHome ? group : opponent,
      away: atHome ? opponent : group,
      address,
      type,
      date,
      yes: [],
      maybe: memberIds,
      no: []
    };

    await addDoc<Event>(
      this.#getCollectionRef<Event>('events'),
      newEvent
    );
  }

  async editEvent(): Promise<void> {

  }

  async deleteEvent(): Promise<void> {

  }

  //endregion

  //region GroupService

  /**
   * Creates a new group with the provided information.
   *
   * @param {string} name The name of the group.
   * @param {string} street The street address of the group.
   * @param {string} city The city of the group.
   * @param {string[]} [members=[]] Optional array of member IDs to include in the group.
   * @returns {Promise<void>} A promise that resolves when the group has been created successfully.
   * @throws {Error} Throws an error if the user is not logged in.
   */
  async createGroup(name: string, street: string, city: string): Promise<void> {
    console.log('Trying to create a group...');
    const currentUserId = this.authService.getUserUID();
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
      memberIds: [currentUserId]
    };

    await addDoc<Group>(
      this.#getCollectionRef<Group>('groups'),
      newGroup
    );
  }

  /**
   Edits a group with the specified details.
   @param {string} groupId - The ID of the group to edit.
   @param {string} name - The new name for the group.
   @param {string} street - The new street address for the group.
   @param {string} city - The new city for the group.
   @returns {Promise<void>} A promise that resolves when the group is successfully edited.
   @throws {Error} If the group is not found.
   */
  async editGroup(groupId: string, name: string, street: string, city: string): Promise<void> {
    console.log('Trying to edit a group...');
    const groupDocRef = this.#getDocumentRef<Group>('groups', groupId);

    if (groupDocRef) {
      await updateDoc(groupDocRef, {name, street, city});
    } else {
      throw new Error('Group not found');
    }
  }

  /**
   Joins a group using the specified group code.
   @param {string} groupCode - The code of the group to join.
   @returns {Promise<void>} A promise that resolves when the user successfully joins the group.
   @throws {Error} If the group is not found.
   */
  async joinGroup(groupCode: string): Promise<void> {
    console.log('Trying to join a group...');

    const queryRef = this.#createQuery<Group>('groups', 'code', '==', groupCode);
    const groupDocs = await firstValueFrom(collectionData<Group>(queryRef, {idField: 'id'}));

    if (groupDocs && groupDocs.length > 0) {
      const groupId = groupDocs[0].id!;
      const groupDocRef = this.#getDocumentRef('groups', groupId);

      const groupSnapshot = await getDoc(groupDocRef);
      if (groupSnapshot.exists()) {
        const groupData = groupSnapshot.data() as Group;
        const updatedMemberIds = [...(groupData.memberIds || []), this.authService.getUserUID()];

        await updateDoc(groupDocRef, {memberIds: updatedMemberIds});
      } else {
        throw new Error('Group not found');
      }
    } else {
      throw new Error('Group not found');
    }

  }

  /**
   * Leaves a group identified by the given group ID.
   *
   * @param {string} groupId - The ID of the group to leave.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - Throws an error if the group is not found.
   */
  async leaveGroup(groupId: string): Promise<void> {
    const groupDocRef = this.#getDocumentRef<Group>('groups', groupId);

    const groupSnapshot = await getDoc(groupDocRef);
    if (groupSnapshot.exists()) {
      const groupData = groupSnapshot.data();
      const updatedMemberIds = groupData?.memberIds?.filter(
        memberId => memberId !== this.authService.getUserUID()
      );

      await updateDoc(groupDocRef, {memberIds: updatedMemberIds});
    } else {
      throw new Error('Group not found');
    }
  }

  async deleteAllOwnedGroups(): Promise<void> {
    const myGroups = await getDocs(query<Group>(
      this.#getCollectionRef('groups'),
      where('ownerId', '==', this.authService.getUserUID())
    ));

    const deletePromises = myGroups.docs.map(group => deleteDoc(group.ref));

    await Promise.all(deletePromises);
  }

  /**
   * Deletes a group with the given group ID.
   *
   * @param {string} groupId - The ID of the group to delete.
   * @returns {Promise<void>} - A Promise that resolves when the group deletion is complete.
   */
  async deleteGroup(groupId: string): Promise<void> {
    await deleteDoc(this.#getDocumentRef('groups', groupId));
  }

  retrieveMyGroupsList(): Observable<Group[]> {
    console.log('Trying to retrieve my groups...');
    const queryRef = this.#createQuery<Group>('groups', 'memberIds', 'array-contains', this.authService.getUserUID());

    return collectionData<Group>(queryRef,
      {idField: 'id'}
    );
  }

  retrieveGroup(groupId: string): Observable<Group> {
    return docData<Group>(this.#getDocumentRef('groups', groupId));
  }

  //endregion

  //region ProfileService

  /**
   * Create a new profile document for the specified user.
   *
   * @param user The user for whom the profile is created.
   * @param dob The date of birth for the profile.
   * @param firstname The first name for the profile.
   * @param lastname The last name for the profile.
   * @returns A promise that resolves when the profile is successfully created.
   */
  async createProfile(user: User, dob: string, firstname: string, lastname: string) {
    console.log('Trying to create a new profile...');
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

  /**
   * Retrieves the profile associated with the current user.
   * The profile is retrieved by querying the 'profiles' collection where the 'id' field matches the user's ID.
   * Throws an error if the profile is not found.
   *
   * @returns An observable that emits the retrieved profile.
   * @throws An error if the profile is not found.
   */
  retrieveProfile(): Observable<Profile> {
    console.log('Trying to retrieve my profile...');
    const queryRef = this.#createQuery<Profile>('profiles', 'id', '==', this.authService.getUserUID());

    return collectionData<Profile>(queryRef).pipe(
      map((profiles: Profile[]) => {
        if (profiles.length > 0) {
          return profiles[0];
        } else {
          throw new Error('Profile not found');
        }
      })
    );
  }

  /**
   * Deletes the profile of the current user.
   *
   * @returns {Promise<void>} - A Promise that resolves when the profile deletion is complete.
   * @throws {Error} - Throws an error if the user ID is undefined.
   */
  async deleteMyProfile(): Promise<void> {
    console.log('Trying to delete my profile...');

    const userId = this.authService.getUserUID();
    if (!userId) {
      throw new Error('User ID is undefined');
    }

    const profileRef = this.#getDocumentRef('profiles', userId);

    await deleteDoc(profileRef);
  }

  //endregion
}
