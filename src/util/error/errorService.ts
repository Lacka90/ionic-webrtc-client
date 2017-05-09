import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ErrorService {
  constructor(
    private alertCtrl: AlertController,
  ) {}

  makeAlert(boomError): void {
    const alert = this.alertCtrl.create({
      title: boomError.statusText,
      subTitle: boomError._body,
      buttons: ['OK']
    });
    alert.present();
  }
}
