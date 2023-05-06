import {Injectable} from '@angular/core';
import {User} from '../datatypes/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #userList: User[] = [{_id: 1, lastname: 'Nijs', firstname: 'Dennis', dob: '23/09/1991', phone: +32782918888}];
  #firstNames: string[] = ['Jackie', 'Emily', 'Lucas', 'Amelia', 'Oliver', 'Isabella', 'Levi', 'Sophie', 'Logan', 'Chloe', 'Benjamin'];
  #lastNames: string[] = ['Robinson', 'Ramirez', 'Williams', 'Davis', 'Johnson', 'Rodriguez', 'Thompson', 'Jackson', 'Garcia', 'Brown', 'Taylor'];

  constructor() {
    this.generateDummyUsers(10);
    this.#userList = this.getAllUsers();
  }

  getUserById(id: number) {
    return this.#userList.find(u => u._id === id);
  }

  getAllUsers(): User[] {
    return this.#userList;
  }

  //region Helper Methods
  generateDateOfBirth(): string {
    let start = new Date(1950, 0, 1);
    let end = new Date(2003, 11, 31);
    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().slice(0, 10);
  }

  generatePhoneNumber(): number {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }

  generateDummyUsers(count: number): void {
    for (let i = 0; i < count; i++) {
      let firstName = this.#firstNames[Math.floor(Math.random() * this.#firstNames.length)];
      let lastName = this.#lastNames[Math.floor(Math.random() * this.#lastNames.length)];
      let dob = this.generateDateOfBirth();
      let phone = this.generatePhoneNumber();
      let user: User =
        {
          _id: i + 1,
          lastname: lastName,
          firstname: firstName,
          dob,
          phone
        };
      this.#userList.push(user);
    }
  }

  //endregion
}
