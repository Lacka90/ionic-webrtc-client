import { SocketService } from './../../services/socketService';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { UserService } from '../../common/user';
import { Subscription } from 'rxjs/Subscription';
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
  private calling = false;
  private muted = false;
  private answer$: Subscription = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private socketService: SocketService,
    private alertCtrl: AlertController,
    private userService: UserService
  ) {
    this.initPeer();
  }

  initPeer() {
    navigator.getUserMedia(VIDEO_CONSTRAINTS, (stream) => {
      this.selfVideo.nativeElement.src = window.URL.createObjectURL(stream);

      try {
        this.selfVideo.nativeElement.play();
      } catch (err) {
        console.error(err);
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
        this.answer$ = this.userService.answerRoom(this.selectedUser._id, connection).subscribe((result) => {
          console.log(result);
        }, (err) => {
          console.error(err);
        });
      });

      this.peer.on('stream', (stream) => {
        this.calling = true;
        this.localVideo.nativeElement.src = window.URL.createObjectURL(stream);
        try {
          this.localVideo.nativeElement.play();
        } catch (err) {
          console.error(err);
        }
      })

      this.peer.on('close', (stream) => {
        this.calling = false;
      });
    }, err => console.error(err));
  }

  showUsers() {
    const connected$ = this.socketService.userConnected().subscribe((data) => {
      const user = data['user'];
      if (user) {
        this.users.push(user);
      }
    });

    const disConnected$ = this.socketService.userDisconnected().subscribe((data) => {
      const userId = data['userId'];
      if (userId) {
        this.users = _.filter(this.users, (user) => user['_id'] !== userId);
      }
    });

    const available$ = this.userService.getAvailableUsers().subscribe(({ users }) => {
      const options = {
        title: 'Select user',
        buttons: [{
          text: 'Select',
          handler: (data) => {
            connected$.unsubscribe();
            disConnected$.unsubscribe();
            available$.unsubscribe();
            this.connect(data);
          }
        }],
      };

      options['inputs'] = users.map((user) => {
        return { name : 'options', value: user, label: user.username, type: 'radio' };
      });

      let alert = this.alertCtrl.create(options);
      alert.present();
    });
  }

  muteToggle() {
    this.muted = !this.muted;
    this.localVideo.nativeElement.muted = this.muted;
  }

  hang() {
    if (this.answer$) {
      this.answer$.unsubscribe();
    }
    this.calling = false;
    this.peer.destroy();
    this.initPeer();
  }

  ngOnDestroy() {
    this.hang();
  }

  connect(user) {
    this.selectedUser = user;
    return this.userService.getRoomById(user._id).toPromise().then(({ room }) => {
      this.peer.signal(room.offer);
    });
  }
}
