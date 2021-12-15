import { Injectable,NgZone } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute,Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from "@ionic/angular";
import firebase from 'firebase/app';


@Injectable()
export class AuthService {
  user$: Observable<User>;
  users: Observable<User[]>;
  user: Observable<User>;
  userCol: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;


  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private activatedRoute: ActivatedRoute,
    private platform: Platform, 
    private zone: NgZone, 
    private facebook: Facebook
  ) {
    
    this.user$ = this.afauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc('users/${user.uid}').valueChanges();
          //gets user by user id
        }
        else {
          return of(null);
          //if no user
        }

      })
    );
  }//end of constructor
  

  async login(email, pass) {
    const loading = await this.loadingCtrl.create({
      message: 'Authenticating..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    
    this.afauth.signInWithEmailAndPassword(email, pass).then((data) => {
      //login with email and password
      
        loading.dismiss();
        this.router.navigate(['/home']);
      })
    
  }// end of login





  getUsers()
  {
    return this.users;
  }// get user

  getUser(userId)
  {
    //get user document with id
    this.userDoc = this.afs.collection('users').doc(userId);
     return this.user = this.userDoc.valueChanges();
  } // get user

  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  }//end of toast
  
  
}