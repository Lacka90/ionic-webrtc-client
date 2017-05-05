import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../common/user';
import { HomePage } from '../../pages/home/home';
import { Remote } from '../../pages/remote/remote';
import { Signup } from '../../pages/signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login implements OnInit {
  private username = '';
  private password = '';
  private user = null;

  constructor(public navCtrl: NavController, public userService: UserService) {}

  ngOnInit() {
    this.getUser();
  }

  login() {
    this.userService.login(this.username, this.password).subscribe(() => {
      this.getUser();
    });
  }

  goToSignup() {
    this.navCtrl.push(Signup);
  }

  getUser() {
    this.userService.getUser().then((user) => {
      this.user = user;
    });
  }

  logout() {
    this.username = '';
    this.password = '';
    this.userService.logout();
    this.user = null;
  }

  startVideo() {
    this.navCtrl.push(HomePage);
  }

  userList() {
    this.navCtrl.push(Remote);
  }

}
