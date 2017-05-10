import { SocketService } from './../../services/socketService';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UserService } from '../../common/user';
import * as Peer from 'simple-peer';
import * as _ from 'lodash';

const VIDEO_CONSTRAINTS = {
  audio: true,
  video: {
    width: 640,
    frameRate: 15
  }
};

@Component({
  selector: 'page-remote',
  templateUrl: 'remote.html',
})
export class Remote implements OnDestroy {
  @ViewChild('localVideo') localVideo;
  @ViewChild('selfVideo') selfVideo;
  private selectedUser;
  private users = null;
  private peer;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private socketService: SocketService,
    private userService: UserService
  ) {
    this.userService.getAvailableUsers().subscribe(({ users }) => {
      this.users = users;
    });

    this.socketService.userConnected().subscribe((data) => {
      debugger;
      const user = data['user'];
      if (user) {
        this.users.push(user);
      }
    });

    this.socketService.userDisconnected().subscribe((data) => {
      debugger;
      const userId = data['userId'];
      if (userId) {
        this.users = _.filter(this.users, (user) => user['_id'] !== userId);
      }
    });

    navigator.getUserMedia(VIDEO_CONSTRAINTS, (stream) => {
      this.selfVideo.nativeElement.src = window.URL.createObjectURL(stream);

      try {
        this.selfVideo.nativeElement.play();
      } catch (err) {
        console.log(err);
      }

      this.peer = new Peer({
        initiator: false,
        trickle: false,
        reconnectTimer: 60000,
        stream,
      });

      this.peer.on('signal', (data) => {
        const connection = JSON.stringify(data);
        console.log("REMOTE", connection);
        this.userService.answerRoom(this.selectedUser._id, connection).subscribe((result) => {
          console.log(result);
        }, (err) => {
          debugger;
        });
      });

      this.peer.on('stream', (stream) => {
        this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
        try {
          this.localVideo.nativeElement.play();
        } catch (err) {
          console.log(err);
        }
      })
    }, err => console.error(err));
  }

  ngOnDestroy() {
    // remove data from DB
  }

  connect(user) {
    this.selectedUser = user;
    return this.userService.getRoomById(user._id).toPromise().then(({ room }) => {
      this.peer.signal(room.offer);
    });
  }
}
