import { Injectable } from '@angular/core';
import { ApiService } from './api';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  constructor(public api: ApiService) {}

  getUser() {
    return this.api.whoami();
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
    return this.login(username, password);
  }

  offerRoom(connection: string) {
    return this.api.offerRoom(connection);
  }

  answerRoom(connection: string) {
    return this.api.answerRoom(connection);
  }

  getRoom() {
    return this.api.getRoom();
  }

  getRoomById(userId: string) {
    return this.api.getRoomById(userId);
  }
}
