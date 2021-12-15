import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController,Platform, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/app';
import  "firebase/auth";
import "firebase/firestore";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:string;
  password:string;
  public isGoogleLogin = false;
  public user = null;
  public loading: any;

  constructor(
    private google: GooglePlus,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router,
    private auth: AuthService,
    private toaster: ToastController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private navCtrl:NavController,
    private facebook: Facebook

    
  ) { }

  async ngOnInit() {
    
  }
  

  async facebookAuth(){
    this.afauth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    // facebook popup will show with facebook account details
    .then(res=>{
      console.log(res)

      this.afs.collection('users').doc(res.user.uid).set({
        //add user details to firestore
        'userId': res.user.uid,
        'name': res.user.displayName,
        'email':res.user.email,
        'photoURL':res.user.photoURL,
        'createdAt':Date.now()
      });
      this.router.navigate(['/home']);
    })
  }
  


  register()
  {
    this.router.navigate(['/register']);
    //navigate to register page
  } //end of register

  forgot()
  {
    this.router.navigate(['/forgot-password']);
    //navigate to forget password/

  }//end of forgot password

  doLogin(){
    let params:any;
    if(this.platform.is('cordova')){
      if(this.platform.is('android')){
        params={
          //gets webclient in google credentials
          'webClientId': '638726449275-1m0oal3ap6jq99vi65qfm2t8b43leppm.apps.googleusercontent.com',
          'offline':true
          
        };
      }else{
        params={};
      }
      this.google.login(params)
      .then((response)=>{
        const {idToken,accessToken}=response;
        this.onLoginSuccess(idToken,accessToken);
        //get token  on google login
      }).catch((error)=>{
        console.log(error);
        alert('error:'+JSON.stringify(error));
      });
    }else{
      this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      //google login pop up with google email accounts
    .then( res=> {
      console.log('From --Google--');
      console.log(res);

      this.afs.collection('users').doc(res.user.uid).set({
        //store user details from google email to firestore
        'userId': res.user.uid,
        'name': res.user.displayName,
        'photoURL':res.user.photoURL,
        'email':res.user.email,
        'createdAt':Date.now()
      });
      this.router.navigate(['/home']);
      
    })
    }
  }

  onLoginSuccess(accessToken,accessSecret){
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
    .credential(accessToken,accessSecret):firebase.auth.GoogleAuthProvider
    .credential(accessToken);
    //google  auth gets token

    this.afauth.signInWithCredential(credential)
    //sign in using google credentials
    .then(res=>{
      this.isGoogleLogin=true;
      this.user=res.user;
      this.afs.collection('users').doc(res.user.uid).set({
        //store user details into firestore
        'userId':res.user.uid,
        'name':res.user.displayName,
        'email':res.user.email,
        'createdAt':Date.now()
        
      }).then(res=>{
      this.router.navigate(['/home']);
      alert('successfully');
      this.loading.dismiss();
      })
    });
  }
  loginWithGoogle(){
    this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then( res=> {
      console.log('From --Google--');
      console.log(res);

      this.afs.collection('users').doc(res.user.uid).set({
        'userId': res.user.uid,
        'name': res.user.displayName,
        'email':res.user.email,
        'createdAt':Date.now()
      });
      this.router.navigate(['/home']);
    })
  }
  async login()
  {
    if(this.email && this.password)
    {
      const loading = await this.loadingCtrl.create({
        message: 'Logging in..',
        spinner: 'crescent',
        showBackdrop:true
      });

      loading.present();
      
      this.afauth.signInWithEmailAndPassword(this.email,this.password)
      //login with email and password - when user key in their email and password correctly
      .then(()=> {
        loading.dismiss();
        this.toast('Successfully logged in','success')
        this.router.navigate(['/home']);
        console.log('success') 
        //successful login and navigate user to home page
      })
      .catch((error)=> {
        loading.dismiss();
        this.toast(error.message,'danger')
        this.router.navigate(['/login']);
        console.log(error.message)
        //failed login and navigate user back to login page
      });

    }else{
      this.toast('Please enter your email and password!','danger')
    }
  }//end of login

  async toast(message, status)
  {
    //create toast format
    const toast=await this.toaster.create({
      message: message,
      position:'top',
      color: status,
      duration:2000
    });
    toast.present();
  }//end of toast
}
