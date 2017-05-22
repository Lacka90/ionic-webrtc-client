import { UserService } from './../common/user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private url = location.origin;
  private socket = null;

  constructor(private userService: UserService) {}

  initSocket() {
    this.userService.getUser().then(user => {
      if (user) {
        this.socket = io(this.url, { query: `userId=${user.id}` });
      } else {
        this.socket = null;
      }
    });
  }

  sendMessage(message) {
    if (this.socket) {
      this.socket.emit('add-message', message);
    }
  }

  sendOffer(userId, connection) {
    if (this.socket) {
      this.socket.emit('offerCall', { userId, connection });
    }
  }

  sendAnswer(userId, connection) {
    if (this.socket) {
      this.socket.emit('answerCall', { userId, connection });
    }
  }

  answerRoom() {
    return new Observable(observer => {
      this.socket.on('userCalling', (data) => {
        observer.next(data);
      });
    });
  }

  userConnected() {
    return new Observable(observer => {
      this.socket.on('userConnected', (data) => {
        observer.next(data);
      });
    });
  }

  userDisconnected() {
    return new Observable(observer => {
      this.socket.on('userDisconnected', (data) => {
        observer.next(data);
      });
    });
  }
}
