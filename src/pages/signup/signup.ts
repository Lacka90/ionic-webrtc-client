import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../common/user';
import { Login } from '../login/login';

/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {

  constructor(
    public navCtrl: NavController,
    private userService: UserService
  ) {}

  signup(username: string, password: string) {
    this.userService.register(username, password).subscribe(() => {
      this.navCtrl.push(Login);
    });
  }

}
