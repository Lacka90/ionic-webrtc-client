import { Injectable } from '@angular/core';
import { ApiService } from './api';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  public user = null;

  constructor(public api: ApiService) {}

  login(username: string, password: string) {
    return this.api.login(username, password).subscribe((response) => {
      this.user = response.user[0];
      return this.user;
    });
  }

  logout() {
    this.user = null;
  }

  getAvailableUsers() {
    return this.api.getAvailableUsers();
  }

  register(username: string, password: string) {
    this.login(username, password);
  }

  openConnection(userId: string, connection: string) {
    this.api.openConnection(userId, connection);
  }

  closeConnection(userId: string) {
    this.api.closeConnection(userId);
  }

}
