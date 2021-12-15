import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Todo } from '../models/todo';
import { AuthService } from '../services/auth.service';
import { TodoService } from '../services/todo.service';
import firebase from 'firebase/app';
import { start } from 'repl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({

  selector: 'app-email',

  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
  providers: [TodoService]
})
export class EmailPage implements OnInit {
  todoId: string;
  title: string;
  desc: string;
  todos: Todo[];
  priority: string;
  status: string;
  userid: string;
  user: any = {}
  category: string;
  categories = ['WORK', 'HOME', 'PERSONAL']
  notification: string;
  http: HttpClient;
  mailgunUrl: string;
  mailgunApiKey: string;
  todoCol: AngularFirestoreCollection<Todo>;
  todoDoc: AngularFirestoreDocument<Todo>;
  todoz:Observable<Todo[]>;
  todo: Observable<Todo>;
  todo$: any;

  id: string;


  startTime: string;
  endTime: string;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private afs: AngularFirestore,
    private router: Router,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    public navCtrl: NavController, public navParams: NavParams, http: HttpClient,
  ) {
    this.http = http;
    this.mailgunUrl = "sandbox707bbb5170944e8cbf041af5bb612b7b.mailgun.org";
    this.mailgunApiKey = window.btoa("api:513472cbcfb90832d79946f51eab2475-64574a68-4ef3d8c2");
  }//end of constructor

  ionViewWillEnter() {
    this.loadTodo(this.todoId);
    console.log(this.todoId)
  }//end of view will enter
  ngOnInit() {
    
    this.todoId = this.route.snapshot.params['todoId'];
  }

  send(recipient: string, title: string,startTime:string, category:string, desc: string) {
    //use the mailgun service - user use individual mailgun url and apikey to send message in the form receipient,title,time,category and desc
    this.http.post("https://api.mailgun.net/v3/" + this.mailgunUrl + "/messages", "from=admin@test101.com&to=" + recipient + "&subject=" + title + "&text="+startTime+"&text="+category + "&text=" + desc,
      { 
        //authorize user and using the apikey to send message
        headers: { 'Authorization': 'Basic ' + window.btoa("api:513472cbcfb90832d79946f51eab2475-64574a68-4ef3d8c2"), "Content-Type": "application/x-www-form-urlencoded" },
      }).subscribe(success => {
        console.log("SUCCESS -> " + JSON.stringify(success));
        //on success message sent
        this.toast("Successfully sent task!", 'success')
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
        //failed message sent
        this.toast("Failed to send task!", 'danger')

      });
    }


    async loadTodo(todoId) {
      const loading = await this.loadingCtrl.create({
        message: 'Loading..',
        spinner: 'crescent',
        showBackdrop: true
      });
  
      loading.present();
  
  
      this.afauth.authState.subscribe(user => {
        this.userid = user.uid;
        //get user id
  
        //using user id to get the todo collection of the user
        this.afs.collection('users').doc(this.userid).collection('todo').snapshotChanges().subscribe(colSnap => {
          this.todos = []
          colSnap.forEach(snap => {
            this.afs.collection('users').doc(this.userid).collection('todo').doc(todoId).valueChanges().subscribe(tod => {
              tod.startTime = tod.startTime.toDate();
              tod.endTime = tod.endTime.toDate();
  
              this.title = tod?.title;
              this.desc = tod?.desc;
              this.startTime = tod?.startTime.toISOString();
              this.endTime = tod?.endTime.toISOString();
              this.priority = tod?.priority;
              this.status = tod?.status;
              this.category = tod?.category;
              this.notification = tod?.notification;
              loading.dismiss();
  
            })
          })
        })
      })
  
    }//end of load todo


  async toast(message, status) {
    //creating toast form
    const toast = await this.toaster.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  }//end of toast

}
