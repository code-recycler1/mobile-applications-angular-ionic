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
  where, docData, getDocs, getDoc, WhereFilterOp, Query, Timestamp
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

  /**
   * Checks if the user is logging in for the first time.
   *
   * @private
   * @param {User} user - The user object.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether it is the user's first login.
   */
  async #isFirstLogIn(user: User): Promise<boolean> {
    const queryRef = this.#createQuery<Profile>('profiles', 'id', '==', user.uid);
    const result = await firstValueFrom(
      collectionData<Profile>(queryRef)
    );

    return result.length === 0;
  }

  /**
   * Handles the login process for the user.
   *
   * @private
   * @param {User | null} user - The user object or null if no user is logged in.
   * @returns {Promise<void>} A Promise that resolves once the login process is handled.
   */
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

  /**
   * Creates a new event for a group.
   *
   * @param {string} groupId - The ID of the group.
   * @param {string} group - The name of the group.
   * @param {string} opponent - The name of the opponent.
   * @param {boolean} atHome - A boolean indicating if the event is held at home.
   * @param {string} address - The address of the event.
   * @param {string} type - The type of the event.
   * @param {string} date - The date of the event in string format.
   * @returns {Promise<void>} A Promise that resolves once the event is created.
   * @throws {Error} Throws an error if the user is not logged in.
   */
  async createEvent(groupId: string, group: string, opponent: string, atHome: boolean,
                    address: string, type: string, date: string): Promise<void> {
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
    const dateTimestamp = Timestamp.fromDate(new Date(date));

    const newEvent: Event = {
      groupId: groupId,
      ownerId: currentUserId,
      home: atHome ? group : opponent,
      away: atHome ? opponent : group,
      address,
      type,
      date: dateTimestamp,
      yes: [],
      maybe: [],
      no: [],
      allUsers: memberIds
    };

    await addDoc<Event>(
      this.#getCollectionRef<Event>('events'),
      newEvent
    );
  }

  async editEvent(): Promise<void> {
//Not implemented
  }

  /**
   * Deletes an event by its ID.
   *
   * @param {string} eventId - The ID of the event to delete.
   * @returns {Promise<void>} A Promise that resolves once the event is deleted.
   */
  async deleteEvent(eventId: string): Promise<void> {
    await deleteDoc(this.#getDocumentRef('events', eventId));
  }

  /**
   * Retrieves a list of events for the current user.
   *
   * @returns {Observable<Event[]>} An Observable that emits an array of events belonging to the current user.
   */
  retrieveMyEventsList(): Observable<Event[]> {
    const currentUserId = this.authService.getUserUID();

    const eventsCollection = this.#getCollectionRef<Event>('events');
    const myEventsQuery = query(
      eventsCollection,
      where('allUsers', 'array-contains', currentUserId),
      orderBy('date', 'asc')
    );
    return collectionData(myEventsQuery, {idField: 'id'});
  }

  /**
   * Updates the attendance status for a specific event.
   *
   * @param {string} eventId - The ID of the event.
   * @param {string} attendance - The attendance status ('yes', 'maybe', or 'no').
   * @returns {Promise<void>} A Promise that resolves once the attendance is updated.
   * @throws {Error} Throws an error if the user is not logged in.
   */
  async updateAttendance(eventId: string, attendance: string): Promise<void> {
    const eventDocRef = this.#getDocumentRef<Event>('events', eventId);
    const eventSnapshot = await getDoc(eventDocRef);

    if (eventSnapshot.exists()) {
      const event = eventSnapshot.data() as Event;

      const currentUserId = this.authService.getUserUID();
      if (!currentUserId) {
        throw new Error(`Can't update attendance when not logged in.`);
      }

      const {yes, maybe, no} = event;

      const updatedYes = yes?.filter(userId => userId !== currentUserId);
      const updatedMaybe = maybe.filter(userId => userId !== currentUserId);
      const updatedNo = no?.filter(userId => userId !== currentUserId);

      if (attendance === 'yes') {
        updatedYes?.push(currentUserId);
      } else if (attendance === 'maybe') {
        updatedMaybe.push(currentUserId);
      } else if (attendance === 'no') {
        updatedNo?.push(currentUserId);
      }

      await updateDoc(eventDocRef, {
        yes: updatedYes,
        maybe: updatedMaybe,
        no: updatedNo
      });
    }
  }

  //endregion

  //region GroupService

  /**
   * Creates a new group with the provided information.
   *
   * @param {string} name The name of the group.
   * @param {string} street The street address of the group.
   * @param {string} city The city of the group.
   * @returns {Promise<void>} A promise that resolves when the group has been created successfully.
   * @throws {Error} Throws an error if the user is not logged in.
   */
  async createGroup(name: string, street: string, city: string): Promise<void> {
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
    const queryRef = this.#createQuery<Group>('groups', 'code', '==', groupCode);
    const groupDocs = await firstValueFrom(collectionData<Group>(queryRef, { idField: 'id' }));

    if (groupDocs && groupDocs.length > 0) {
      const groupId = groupDocs[0].id!;
      const groupDocRef = this.#getDocumentRef('groups', groupId);

      const groupSnapshot = await getDoc(groupDocRef);
      if (groupSnapshot.exists()) {
        const groupData = groupSnapshot.data() as Group;
        const updatedMemberIds = [...(groupData.memberIds || []), this.authService.getUserUID()];

        // Update the group memberIds
        await updateDoc(groupDocRef, { memberIds: updatedMemberIds });

        // Add the user to all events associated with the group
        const eventsQueryRef = this.#createQuery<Event>('events', 'groupId', '==', groupId);
        const eventsDocs = await firstValueFrom(collectionData<Event>(eventsQueryRef, { idField: 'id' }));

        const promises = eventsDocs.map((event) => {
          const eventDocRef = this.#getDocumentRef('events', event.id!);
          const updatedAllUsers = [...(event.allUsers || []), this.authService.getUserUID()];
          return updateDoc(eventDocRef, { allUsers: updatedAllUsers });
        });

        await Promise.all(promises);
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
      const userId = this.authService.getUserUID();
      const updatedMemberIds = groupData?.memberIds?.filter(
        memberId => memberId !== userId
      );

      await updateDoc(groupDocRef, { memberIds: updatedMemberIds });

      // Remove the user from all events associated with the group
      const eventsQueryRef = this.#createQuery<Event>('events', 'groupId', '==', groupId);
      const eventsDocs = await firstValueFrom(collectionData<Event>(eventsQueryRef, { idField: 'id' }));

      const promises = eventsDocs.map((event) => {
        const eventDocRef = this.#getDocumentRef('events', event.id!);
        const updatedAllUsers = event.allUsers?.filter(
          userId => userId !== this.authService.getUserUID()
        );
        const updatedYes = event.yes?.filter(
          userId => userId !== this.authService.getUserUID()
        );
        const updatedMaybe = event.maybe?.filter(
          userId => userId !== this.authService.getUserUID()
        );
        const updatedNo = event.no?.filter(
          userId => userId !== this.authService.getUserUID()
        );

        return updateDoc(eventDocRef, {
          allUsers: updatedAllUsers,
          yes: updatedYes,
          maybe: updatedMaybe,
          no: updatedNo
        });
      });

      await Promise.all(promises);
    } else {
      throw new Error('Group not found');
    }
  }

  async deleteMember(groupId: string, memberId: string) {

  }

  /**
   * Deletes a group with the given group ID.
   *
   * @param {string} groupId - The ID of the group to delete.
   * @returns {Promise<void>} - A Promise that resolves when the group deletion is complete.
   */
  async deleteGroup(groupId: string): Promise<void> {
    const groupDocRef = this.#getDocumentRef<Group>('groups', groupId);

    // Delete the group document
    await deleteDoc(groupDocRef);

    // Delete all events associated with the group
    const eventsQueryRef = this.#createQuery<Event>('events', 'groupId', '==', groupId);
    const eventsDocs = await firstValueFrom(collectionData<Event>(eventsQueryRef, { idField: 'id' }));

    const promises = eventsDocs.map((event) => {
      const eventDocRef = this.#getDocumentRef('events', event.id!);
      return deleteDoc(eventDocRef);
    });

    await Promise.all(promises);
  }

  retrieveMyGroupsList(): Observable<Group[]> {
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


  retrieveProfiles(userIds: string[]): Observable<Profile[]> {
    const queryRef = query<Profile>(this.#getCollectionRef<Profile>('profiles'),
      where('id', 'in', userIds));

    return collectionData<Profile>(queryRef);
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
