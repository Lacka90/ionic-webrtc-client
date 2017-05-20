import { SocketService } from './../../services/socketService';
import { Component, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { UserService } from '../../common/user';
import * as Peer from 'simple-peer';
import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs/Subscription';

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
  private muted = false;
  private offer$: Subscription = null;
  private answer$: Subscription = null;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private socketService: SocketService,
    private alertCtrl: AlertController,
    private userService: UserService,
    private zone: NgZone
  ) {
    this.userService.getUser().then((user) => {
      this.user = user;
    });

    this.initPeer();
  }

  initPeer() {
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
          this.offer$ = this.userService.offerRoom(user.id, connection).subscribe((result) => {
            this.answer$ = this.socketService.answerRoom().subscribe((data) => {
              const answerString = data['answer'];

              if (answerString) {
                this.callConfirm(answerString);
              }
            });
          }, (err) => {
            console.error(err);
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

      this.peer.on('error', (err) => {
        alert(err);
      });

      this.peer.on('close', () => {
        if (this.calling) {
          this.zone.run(() => {
            this.hang();
          });
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

  muteToggle() {
    this.muted = !this.muted;
    this.localVideo.nativeElement.muted = this.muted;
  }

  hang() {
    this.calling = false;
    if (this.offer$) {
      this.offer$.unsubscribe();
    }

    if (this.answer$) {
      this.answer$.unsubscribe();
    }
    this.peer.destroy();
    this.initPeer();
  }

  connect(answer: string) {
    this.peer.signal(JSON.parse(answer));
  }

  ngOnDestroy() {
    this.hang();
  }
}
