import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { httpFactory } from '../util/http/JwtHttp';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Remote } from '../pages/remote/remote';
import { Login } from '../pages/login/login';

import { ApiService } from '../common/api';
import { UserService } from '../common/user';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Remote,
    Login,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Remote,
    Login,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    UserService,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ]
})
export class AppModule {}
