import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController} from '@ionic/angular';

import {Todo} from '../models/todo';
import { AngularFireAuth } from '@angular/fire/auth';
import { time } from 'console';
import firebase from 'firebase/app';
import { start } from 'repl';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.page.html',
  styleUrls: ['./todo-add.page.scss'],
})

export class TodoAddPage implements OnInit {
  title: string;
  desc: string;

  priority: string;
  startTime:string;
  endTime:string;
  allDay:string;
  xx:string;
  categories=['WORK','HOME','PERSONAL']
  category:string;
notification:string;
  user:any={}
  userid: string;
  todoId:string;


  constructor
  (
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
   this.todoId=this.route.snapshot.params['todoId'];
   //get todoId 
  
  }

  selectedCategory(index){
    this.category=this.categories[index]
    //choosing category
  }

  async addTask()
  {
    if(this.title && this.desc && this.startTime && this.endTime)
    {
      const loading = await this.loadingCtrl.create({
        message: 'add task..',
        spinner: 'crescent',
        showBackdrop:true
      });
      loading.present();

      const todoId = this.afs.createId();
      //creating new id when new task creates

      this.afauth.authState.subscribe(user => {
        this.userid = user.uid;
        //get user id

        const y = firebase.firestore.Timestamp.fromDate(new Date(this.startTime)).toDate();
        const z = firebase.firestore.Timestamp.fromDate(new Date(this.endTime)).toDate(); //convert string to timestamp

      this.afs.collection('users').doc(this.userid).collection('todo').doc(todoId).set ({
        //store task information  into firestore by id
        'todoId': todoId,
        'title': this.title,
        'desc': this.desc,
        'priority':this.priority,
        'startTime':y,
        'endTime':z,
        'allDay':'false',
        'status': 'Incomplete',
        'createdAt': Date.now(),
        'category':this.category,
        'notification':'not set'
      })
      .then(()=>{
        loading.dismiss();
        
        this.toast('Task Successfully Added!', 'success')
        //on success adding of task
          
        this.router.navigate(['/home']);

        this.afauth.authState.subscribe(user => {
          this.userid = user.uid;
          //get user id
    
                //get todo from todo collection of specific user
          this.afs.collection('users').doc(this.userid).collection<Todo>('todo').doc(todoId).valueChanges().subscribe(todo=>{ 
            console.log(todo);
      })
    })
      })
      .catch((error)=>{
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
      })

      }
      else{
        this.toast('Please fill up all fields','danger');
      }
    
  }// end of addtask()

  async toast(msg, status){
    //create toast form
    const toast = await this.toaster.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  }// end of toast

}
