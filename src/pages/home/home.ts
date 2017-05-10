import { SocketService } from './../../services/socketService';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
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

  private user = {};
  private peer;
  private calling = false;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private socketService: SocketService,
    private alertCtrl: AlertController,
    private userService: UserService
  ) {
    this.userService.getUser().then((user) => {
      this.user = user;
    });

    navigator.getUserMedia(VIDEO_CONSTRAINTS, (stream) => {
      this.selfVideo.nativeElement.src = window.URL.createObjectURL(stream);
      try {
        this.selfVideo.nativeElement.play();
      } catch (err) {
        console.log(err);
      }

      this.peer = new Peer({
        initiator: true,
        trickle: false,
        reconnectTimer: 60000,
        stream,
      });

      this.peer.on('signal', (data) => {
        const connection = JSON.stringify(data);

        this.userService.getUser().then((user) => {
          this.userService.offerRoom(user._id, connection).subscribe((result) => {
            this.socketService.answerRoom().subscribe((data) => {
              const answerString = data['answer'];

              if (answerString) {
                this.callConfirm(answerString);
              }
            });
          }, (err) => {
            debugger;
          });
        });
      });

      this.peer.on('stream', (stream) => {
        this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
        try {
          this.localVideo.nativeElement.play();
        } catch (err) {
          console.log(err);
        }
      });
    }, err => console.error(err));
  }

  callConfirm(answer: string) {
    let alert = this.alertCtrl.create({
      title: 'Incoming call',
      message: 'Do you want to receive?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.calling = false;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.connect(answer);
            this.calling = true;
          }
        }
      ]
    });
    alert.present();
  }

  hang() {
    this.peer.destroy();
  }

  connect(answer: string) {
    this.peer.signal(JSON.parse(answer));
  }

  ngOnDestroy() {
    this.hang();
    this.calling = false;
  }
}
