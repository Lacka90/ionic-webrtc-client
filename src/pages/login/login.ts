import { SocketService } from './../../services/socketService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../common/user';
import { ErrorService } from '../../util/error/errorService';
import { HomePage } from '../../pages/home/home';
import { Remote } from '../../pages/remote/remote';
import { Signup } from '../../pages/signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login implements OnInit, OnDestroy {
  private loginForm: FormGroup = null;
  private user = null;

  constructor(
    public navCtrl: NavController,
    private errorService: ErrorService,
    private fb: FormBuilder,
    public userService: UserService,
    public socketService: SocketService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
    this.getUser();
  }

  ngOnDestroy() {}

  login() {
    const formValues = this.loginForm.value;
    this.userService.login(formValues.username, formValues.password).subscribe(() => {
      this.getUser();
    }, (err) => {
      this.errorService.makeAlert(err);
    });
  }

  goToSignup() {
    this.navCtrl.push(Signup);
  }

  getUser() {
    this.userService.getUser()
    .then((user) => {
      this.user = user;
      this.socketService.initSocket();
    })
    .catch((err) => {
      this.errorService.makeAlert(err);
    })
  }

  logout() {
    this.loginForm.reset();
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
