import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

const API_BASE = 'https://5da4f996.ngrok.io/api/v1';

@Injectable()
export class ApiService {
  constructor(public http: Http) {}

  login(username: string, password: string) {
    return this.http.post(`${API_BASE}/user/login`, { username, password })
      .map((response) => response.json());
  }

  register(username: string, password: string) {
    return this.http.post(`${API_BASE}/user/register`, { username, password })
      .map((response) => response.json());
  }

  getAvailableUsers() {
    return this.http.get(`${API_BASE}/user/available`)
      .map((response) => response.json());
  }

  openConnection(userId: string, connection: string) {
    return this.http.put(`${API_BASE}/user/${userId}/open`, { connection })
      .map((response) => response.json())
      .subscribe((result) => {
        console.log(result);
      });
  }

  closeConnection(userId: string) {
    return this.http.post(`${API_BASE}/user/${userId}/close`, {})
      .map((response) => response.json())
      .subscribe((result) => {
        console.log(result);
      });
  }

}
