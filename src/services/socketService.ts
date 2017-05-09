import { UserService } from './../common/user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private url = 'http://localhost:3000';
  private socket = null;

  constructor(private userService: UserService) {
    this.socket = io(this.url);

    this.socket.on('connect', (data) => {
      this.updateSocketAtLogin();
    });
  }

  updateSocketAtLogin() {
    this.userService.getUser().then(user => {
      if (user) {
        this.socket.emit('socketChange', { userId : user._id });
      }
    });
  }

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  answerRoom() {
    return new Observable(observer => {
      this.socket.on('userConnected', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
