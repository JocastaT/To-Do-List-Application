import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  name: string;
  email: string;
  id: string;
  user: any = "";
  userId: string;


  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute

  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.name = params.name;
      this.email = params.email;

    });

  }
  ngOnInit() {
    //this.userId=this.route.snapshot.params['userId'];
    this.afauth.authState.subscribe(user => {
      this.id = user.uid;
      //get user id

      //using user id to get user
      this.afs.collection('users').doc(this.id).valueChanges()
        .subscribe(singleDoc => {
          //getting user stored in 'singledoc'
          this.user = singleDoc;
          console.log(this.user);
        });

    });
  }



  async updateProfile() {
    const loading = await this.loadingCtrl.create({
      message: 'Updating..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afauth.authState.subscribe(user => {
      this.id = user.uid;
      //get user id

      //when name or email changed, name and email are updated by getting user from their id
      this.afs.collection('users').doc(this.id).update({
        'name': this.name,
        'email': this.email,
      })
      user.updateEmail(this.email)
      //updates user email
        .then(() => {
          this.email = '';
        })
        .catch(err => {
          this.toast(err.message, 'danger');

        });
        // on sucess email update, it will go back to the profile page
    }); this.router.navigate(['/home/tabs/profile']);
    loading.dismiss();

  }

  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      color: status,
      position: 'top',
      duration: 2000
    });

    toast.present();
  }

}

