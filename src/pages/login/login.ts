import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../common/user';
import { HomePage } from '../../pages/home/home';
import { Remote } from '../../pages/remote/remote';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  private username = '';
  private password = '';

  constructor(public navCtrl: NavController, public userService: UserService) {
  }

  login() {
    this.userService.login(this.username, this.password);
  }

  logout() {
    this.username = '';
    this.password = '';
    this.userService.logout();
  }

  startVideo() {
    this.navCtrl.push(HomePage);
  }

  userList() {
    this.navCtrl.push(Remote);
  }

}
