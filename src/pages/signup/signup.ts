import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { NavController } from 'ionic-angular';
import { UserService } from '../../common/user';
import { ErrorService } from '../../util/error/errorService';
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
export class Signup implements OnInit {
  private signupForm: FormGroup = null;

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private errorService: ErrorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signup() {
    const formValues = this.signupForm.value;
    this.userService.register(formValues.username, formValues.password).subscribe(() => {
      this.navCtrl.push(Login);
    }, (err) => {
      this.errorService.makeAlert(err);
    });
  }

}
