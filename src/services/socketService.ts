import { UserService } from './../common/user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private url = location.origin;
  private socket = null;

  constructor(private userService: UserService) {
    this.socket = io(this.url);
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
      this.socket.on('userCalling', (data) => {
        debugger;
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  userConnected() {
    return new Observable(observer => {
      this.socket.on('userConnected', (data) => {
        debugger;
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  userDisconnected() {
    return new Observable(observer => {
      this.socket.on('userDisconnected', (data) => {
        debugger;
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
