import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Todo } from '../models/todo';
import firebase from 'firebase/app';
import  "firebase/auth";
import "firebase/firestore";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [AuthService]
})
export class ProfilePage implements OnInit {
  provider = {
    name: '',
    //profilePicture: '',
    email: '',
    loggedin: false
  }
  user: any = {};
  id: string;
  userId: string;
  todos:Todo[];


  constructor(
    private auth: AuthService,
    private fireauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toaster: ToastController
  ) {

  }

  ngOnInit() {
    this.fireauth.authState.subscribe(user => {
      this.id = user.uid;
      //get user id

      //get user by user id 
      this.afs.collection('users').doc(this.id).valueChanges()
        .subscribe(singleDoc => {
          //user stored in 'singledoc'
          this.user = singleDoc;
          console.log(this.user);
        });

    });
    this.fireauth.authState.subscribe(user => {
      this.userId = user.uid;
      //get user id

            //get todo from todo collection of specific user
      this.afs.collection('users').doc(this.userId).collection<Todo>('todo', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges().subscribe(colSnap => {
        this.todos = []
        colSnap.forEach(snap => {
          let todo: any = snap.payload.doc.data();
          todo.id = snap.payload.doc.id;
          todo.startTime = todo.startTime.toDate();
          todo.endTime = todo.endTime.toDate();
          
          this.todos.push(todo);
          

        })

      })
    })
  }

  editUser() {
    let navigationExtras: NavigationExtras = { queryParams: { name: this.user.name, email: this.user.email } };
    this.router.navigate(['/profiledit'], navigationExtras);
    //passes user details into profile edit page 

  }

  updatePassword() {
    this.router.navigate(['/update-password']);
    //navigate to update password page

  }
  logout() {
    firebase.auth().signOut().then(() => {
      //logout of user account
      
      localStorage.clear();
      //clears storage
      sessionStorage.clear();
      //clear user session 
      this.router.navigate(['/login']);
      //navigate to login aft sign out
      
      });
      
  }



  async deleteUser(todoId) {
    const loading = await this.loadingCtrl.create({
      message: 'Deleting..',
      spinner: 'crescent',
      showBackdrop: true
    });

    let alert = await this.alertCtrl.create({
      header: 'Delete account',
      message: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'Confirm',

          handler: () => {
            loading.present();
            this.fireauth.authState.subscribe(user => {
              this.userId = user.uid;
  
             this.afs.collection('users').doc(this.userId).collection('todo').get().toPromise().then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                  doc.ref.delete();
                })
              }).then(() => {
                this.afs.collection('users').doc(this.userId).collection('done').get().toPromise().then((querySnapshot)=>{
                  querySnapshot.forEach((doc)=>{
                    doc.ref.delete();
                  })
                }).then(() => {
                  this.afs.collection('users').doc(this.userId).delete()
                       .then(() => {
                         user.delete().then(() => {
                          loading.dismiss();
                          this.toast('User Deleted!', 'success');
                          this.router.navigate(['/login']);
                         })
                          // User deleted.
                        })
                        .catch((error) => {
                          loading.dismiss();
                          console.log(error.message)
                        });
                    });
              })
           })

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
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
