import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {
  passwords: string
	newpassword: string

  constructor(
    private afauth: AngularFireAuth,
    private toaster:ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  updatePw(){
    this.afauth.authState.subscribe(user => {
      //update password to the new password keyed in by user
      user.updatePassword(this.newpassword).then(() => {
        //on success password update
        this.toast('Password updated successfully!','success')
        this.router.navigate(['/login']);
        //navigate user to login to login with the new password
        console.log(this.newpassword)
      }).catch((error) => {

      });
  })
}
async toast(msg, status){
  //create login form
  const toast = await this.toaster.create({
    message: msg,
    position: 'top',
    color: status,
    duration: 2000
  });

  toast.present();
}// end of toast

}
