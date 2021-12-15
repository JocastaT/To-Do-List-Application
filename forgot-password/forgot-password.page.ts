import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email:string;

  constructor(
    private afauth: AngularFireAuth,
    private toaster: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

   async resetPassword()
   {
     if(this.email){
      //when email is keyed in
     const loading = await this.loadingCtrl.create({
       message: 'Sending reset password link..',
       spinner: 'crescent',
       showBackdrop: true
     });
     loading.present();

     this.afauth.sendPasswordResetEmail(this.email).then(()=> {
       //sending password reset link to email
       loading.dismiss();
       this.toast('Please Check your Email','success');
       this.router.navigate(['/login']);
       //success sent link - navigate to login page
     })
     .catch((error)=> {
       //on failed link
       this.toast(error.message, 'danger');
     })
    }else{
      //if user did not type in an email
      this.toast('Please enter your email address!','danger');

    }
   } //end of reset password

   async toast(message, status)
  {
    //create toast format
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present;
  }//end of toast
}
