import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
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
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {
  @ViewChild('localVideo') localVideo;

  private peer;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private userService: UserService
  ) {
    navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS)
    .then((stream) => {
      this.peer = new Peer({
        initiator: this.viewCtrl.name === 'HomePage',
        trickle: false,
        stream,
      });

      this.peer.on('signal', (data) => {
        const connection = JSON.stringify(data);
        console.log(connection);
        this.userService.openConnection(this.userService.user._id, connection);
      });

      this.peer.on('stream', (stream) => {
        this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
        this.localVideo.nativeElement.play();
      });
    });
  }

  ngOnDestroy() {
    this.userService.closeConnection(this.userService.user._id);
  }
}
