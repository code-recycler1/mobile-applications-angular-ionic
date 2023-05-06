import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {User} from '../datatypes/user';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  #userList: User[] = [];

  constructor(public userService: UserService) {
    this.#userList = this.userService.getAllUsers();
  }

  //region Helper Methods
  generateDummyMembers(): number[] {
    const numMembers = Math.floor(Math.random() * 10) + 1;
    const memberIds: number[] = [];

    // loop through and generate unique member IDs
    while (memberIds.length < numMembers) {
      const userId = Math.floor(Math.random() * this.#userList.length) + 1;
      if (!memberIds.includes(userId)) {
        memberIds.push(userId);
      }
    }

    return memberIds;
  }

  //endregion
}
