import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string;
  email: string;
  password:string;
  confirmPassword:string;

  passwordMatch: boolean;

  constructor(
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async register(){
    if(this.name && this.email && this.password)
    {
      const loading = await this.loadingCtrl.create({
        message: 'loading..',
        spinner: 'crescent',
        showBackdrop: true
      });

      loading.present();
      this.afauth.createUserWithEmailAndPassword(this.email, this.password).then((data)=>{
        //creating an account with email and password -email auth
        this.afs.collection('users').doc(data.user.uid).set({
          //input user data into users collection with an individual user id
          'userId': data.user.uid,
          'name': this.name,
          'email':this.email,
          'photoURL':'',
          'createdAt':Date.now()

        });

        
      })
      .then(()=>{
        loading.dismiss();
        this.toast('Registered Successfully!', 'success');
        //on success registration
        this.router.navigate(['/login']);
      })
      .catch((error)=> {
        loading.dismiss();
        //on failed registration
        this.toast(error.message, 'danger');
      })
    }else{
      this.toast('Please Fill Up The Form!','danger');
      //when there are empty field in the form
    }
  } //end of register

  checkPassword()
  {
    //check if password and confirm password matches
    if(this.password == this.confirmPassword){
      this.passwordMatch = true;
    }else{
      this.passwordMatch = false;
    }
  }

  async toast(message, status)
  //create toast format
  {
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  }//end of toast

  login()
  {
    this.router.navigate(['/login']);
  } //end of register


}
