import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { UserService } from '../../common/user';
import * as Peer from 'simple-peer';
import 'rxjs/add/operator/toPromise';

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
  @ViewChild('selfVideo') selfVideo;
  @ViewChild('textarea') textarea;

  private user = {};
  private peer;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private userService: UserService
  ) {
    this.userService.getUser().then((user) => {
      this.user = user;
    });

    navigator.getUserMedia(VIDEO_CONSTRAINTS, (stream) => {
      this.selfVideo.nativeElement.src = window.URL.createObjectURL(stream);
      this.selfVideo.nativeElement.play();

      this.peer = new Peer({
        initiator: this.viewCtrl.name === 'HomePage',
        trickle: false,
        reconnectTimer: 60000,
        stream,
      });

      this.peer.on('signal', (data) => {
        const connection = JSON.stringify(data);

        this.userService.offerRoom(connection).subscribe((result) => {
          this.getRoom().then((room) => {
            this.connect(room.answer);
          });
        });
      });

      this.peer.on('stream', (stream) => {
        this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
        this.localVideo.nativeElement.play();
      });
    }, err => console.error(err));
  }

  getRoom() {
    return this.userService.getRoom().toPromise().then(({ room }) => {
      if (!room.answer) {
        return this.getRoom();
      }
      return room;
    });
  }

  connect(answer: string) {
    this.peer.signal(JSON.parse(answer));
  }

  ngOnDestroy() {}
}
