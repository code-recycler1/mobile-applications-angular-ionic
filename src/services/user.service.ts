import {Injectable} from '@angular/core';
import {User} from '../datatypes/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #firstNames: string[] = ['Jackie', 'Emily', 'Lucas', 'Amelia', 'Oliver', 'Isabella', 'Levi', 'Sophie', 'Logan', 'Chloe', 'Benjamin'];
  #lastNames: string[] = ['Robinson', 'Ramirez', 'Williams', 'Davis', 'Johnson', 'Rodriguez', 'Thompson', 'Jackson', 'Garcia', 'Brown', 'Taylor'];
  #userList: User[] = this.generateDummyUsers(10);

  //region ctor
  constructor() {
    console.log('User list', this.#userList);
    console.log('Test user', this.#userList[0]);
  }

  //endregion

  //region Methods

  //region Get
  getAllUsers(): User[] {
    return this.#userList;
  }

  getTestUser(): User | undefined {
    return this.#userList[0];
  }

  getUserById(userId: number): User | undefined {
    return this.#userList.find(u => u._id === userId);
  }

  //endregion

  //region Delete User
  deleteUser(userId: number): void {
    this.#userList = this.#userList.filter(u => u._id !== userId);
  }
  //endregion



  //endregion

  //region Helpers
  generateDateOfBirth(): string {
    let start = new Date(1960, 0, 1);
    let end = new Date(2003, 11, 31);
    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('en-GB');
  }

  generatePhoneNumber(): number {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }

  private generateDummyUsers(count: number): User[] {
    const dummyUsers: User[] =
      [{_id: 1, lastname: 'Nijs', firstname: 'Dennis', dob: '23/09/1991', phoneNumber: 4782918888}];

    for (let i = 1; i <= count; i++) {
      let firstName = this.#firstNames[Math.floor(Math.random() * this.#firstNames.length)];
      let lastName = this.#lastNames[Math.floor(Math.random() * this.#lastNames.length)];
      let dob = this.generateDateOfBirth();
      let phoneNumber = this.generatePhoneNumber();
      let user: User =
        {
          _id: i + 1,
          lastname: lastName,
          firstname: firstName,
          dob,
          phoneNumber
        };
      dummyUsers.push(user);
    }

    return dummyUsers;
  }

  //endregion
}
