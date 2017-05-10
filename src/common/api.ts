import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export const API_BASE = '/api/v1';

@Injectable()
export class ApiService {
  constructor(public http: Http) {}

  whoami() {
    return this.http.get(`/auth/whoami`)
      .map((response) => response.json());
  }

  login(username: string, password: string) {
    return this.http.post(`/auth/login`, { username, password })
      .map((response) => response.json())
      .map((result) => {
        window.localStorage.setItem('token', result.token);
        return result;
      })
  }

  register(username: string, password: string) {
    return this.http.post(`/auth/register`, { username, password })
      .map((response) => response.json());
  }

  getAvailableUsers() {
    return this.http.get(`/user/available`)
      .map((response) => response.json());
  }

  getRoom() {
    return this.http.get(`/user/room`)
      .map((response) => response.json());
  }

  getRoomById(userId: string) {
    return this.http.get(`/user/room/${userId}`)
      .map((response) => response.json());
  }

  offerRoom(userId: string, connection: string) {
    return this.http.post(`/user/room/offer`, { userId, connection })
      .map((response) => response.json());
  }

  answerRoom(userId: string, connection: string) {
    return this.http.put(`/user/room/answer`, { userId, connection })
      .map((response) => response.json());
  }

}
