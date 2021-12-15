import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';


// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

//env
import { environment } from '../environments/environment.prod';

//services
import { AuthService } from './services/auth.service';

//guards
import { AuthGuard } from './guards/auth.guard';

import { NgCalendarModule  } from 'ionic2-calendar';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { Facebook } from '@ionic-native/facebook/ngx';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NavController, NavParams } from '@ionic/angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgCalendarModule,
    HttpClientModule,
		IonicStorageModule.forRoot(),
    ReactiveFormsModule


  ],
  providers: [ 
    AuthService,
    AuthGuard,
    LocalNotifications,
    GooglePlus,
    Facebook,
    NavParams,

    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
