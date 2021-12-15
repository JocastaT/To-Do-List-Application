import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, ToastController } from '@ionic/angular';

import { Todo } from '../models/todo';
@Component({
  selector: 'app-completed',
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
})
export class CompletedPage implements OnInit {
  userId:string;
  todos: Todo[];
  today: number = Date.now()

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,


  ) { }

  ngOnInit() {
    //get user id
    this.afauth.authState.subscribe(user => {
      this.userId = user.uid;

            //get todo from todo collection of specific user
      this.afs.collection('users').doc(this.userId).collection<Todo>('done', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges().subscribe(colSnap => {
        this.todos = []
        colSnap.forEach(snap => {
          let todo: any = snap.payload.doc.data(); 
          todo.id = snap.payload.doc.id;
          todo.startTime = todo.startTime.toDate(); // convert  nanoseconds into date form
          todo.endTime = todo.endTime.toDate();
          this.todos.push(todo); //pushes data into todo array
          
        })
        
      })
    })
  }

  async undo(todoId) {
    const loading = await this.loadingCtrl.create({
      message: 'Updating status..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afauth.authState.subscribe(user => {
      this.userId = user.uid;
      //gets user id

        this.afs.collection('users').doc(this.userId).collection<Todo>('done').doc(todoId).delete()
        // gets the task id and delete task from 'done' collection of specific user
        .then(() => {
          this.toast("Removed from completed",'danger')
          loading.dismiss();
          //update the status of the task
          this.afs.collection('users').doc(this.userId).collection<Todo>('todo').doc(todoId).update({
            'status': 'Incomplete',
          })
        }).catch((error) => {
          loading.dismiss();
          this.toast(error.message, 'danger')
        });

      })
    

  }

  async toast(message, status)
  {
    //show toast of a message
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  }//end of toast


}
