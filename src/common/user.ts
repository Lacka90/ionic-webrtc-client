import { Injectable } from '@angular/core';
import { ApiService } from './api';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  constructor(public api: ApiService) {}

  getUser() {
    return this.api.whoami().toPromise()
      .then((response) => {
        return response.user;
      })
      .catch((error) => {
        if (error.status === 511) {
          this.logout();
        }
      });
  }

  login(username: string, password: string) {
    return this.api.login(username, password);
  }

  logout() {
    return window.localStorage.removeItem('token');
  }

  getAvailableUsers() {
    return this.api.getAvailableUsers();
  }

  register(username: string, password: string) {
    return this.api.register(username, password);
  }

  offerRoom(connection: string) {
    return this.api.offerRoom(connection);
  }

  answerRoom(userId: string, connection: string) {
    return this.api.answerRoom(userId, connection);
  }

  getRoom() {
    return this.api.getRoom();
  }

  getRoomById(userId: string) {
    return this.api.getRoomById(userId);
  }
}
