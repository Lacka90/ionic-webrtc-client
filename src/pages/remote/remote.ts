import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
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

  @ViewChild('connectButton') connectButton: HTMLButtonElement;

  private peer;
  private connectionString = 'asdasdasd';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS)
    .then((stream) => {
      this.peer = new Peer({
        initiator: this.viewCtrl.name === 'HomePage',
        trickle: false,
        stream,
      });

      this.peer.on('signal', (data) => {
        this.connectionString = JSON.stringify(data);
        console.log(this.connectionString);
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

  connect(event: HTMLTextAreaElement) {
    this.peer.signal(JSON.parse(event.value));
  }

  toHome() {
    this.navCtrl.push(HomePage);
  }
}
