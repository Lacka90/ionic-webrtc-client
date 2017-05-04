import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UserService } from '../../common/user';
import * as Peer from 'simple-peer';

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
  private selectedUser;
  private users = null;
  private peer;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private userService: UserService
  ) {
    this.userService.getAvailableUsers().subscribe((response) => {
      this.users = response.users;
    });
    navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS)
    .then((stream) => {
      this.peer = new Peer({
        initiator: this.viewCtrl.name === 'HomePage',
        trickle: false,
        stream,
      });

      this.peer.on('signal', (data) => {
        const connection = JSON.stringify(data);
        this.connectData(connection);
      });

      this.peer.on('stream', (stream) => {
        this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
        this.localVideo.nativeElement.play();
      })
    });
  }

  ngOnDestroy() {
    // remove data from DB
  }

  connect(user) {
    this.selectedUser = user;
    this.peer.signal(user.connection);
  }

  connectData(connection) {
    this.peer.signal(connection);
  }
}
