import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Todo } from '../models/todo';
import { AuthService } from '../services/auth.service';
import { TodoService } from '../services/todo.service';
import firebase from 'firebase/app';
import { start } from 'repl';

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.page.html',
  styleUrls: ['./todo-edit.page.scss'],
  providers: [TodoService]
})
export class TodoEditPage implements OnInit {
  todoId:string;
  title:string;
  desc:string;
  todos:Todo[];
  priority:string;
  status:string;
  userid: string;
  user:any={}
  category:string;
  categories=['WORK','HOME','PERSONAL']
  notification:string;


  startTime:string;
  endTime:string;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private afs: AngularFirestore,
    private router: Router,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toaster: ToastController
  ) { }//end of constructor

  ngOnInit() {
    this.todoId=this.route.snapshot.params['todoId'];
    //get todoId that was passed from todo edit page
  }

  selectedCategory(index){
    this.category=this.categories[index]
    //categories selected
  }
  ionViewWillEnter()
  {
    this.loadTodo(this.todoId);
    //load todo list with Id
  }//end of view will enter
  async loadTodo(todoId){
    const loading= await this.loadingCtrl.create({
      message: 'Loading..',
      spinner:'crescent',
      showBackdrop:true
    });

    loading.present();
  

    this.afauth.authState.subscribe(user => {
      this.userid = user.uid;
      //get user id
      
      //get todo list
      this.afs.collection('users').doc(this.userid).collection('todo').snapshotChanges().subscribe(colSnap => {
        this.todos=[]
        colSnap.forEach(snap => {
          this.afs.collection('users').doc(this.userid).collection('todo').doc(todoId).valueChanges().subscribe(tod => {
            //get task details by id  from firestore and display
          tod.startTime=tod.startTime.toDate();
          tod.endTime=tod.endTime.toDate();
          
          this.title=tod?.title;
          this.desc=tod?.desc;
          this.startTime=tod?.startTime.toISOString();
          this.endTime=tod?.endTime.toISOString();
          this.priority=tod?.priority;
          this.status=tod?.status;
          this.category=tod?.category;
          this.notification=tod?.notification;
          loading.dismiss();
          
          console.log(this.title)
          })
        })
      })
    })
    
  }//end of load todo

  async updateTodo(){
    const loading=await this.loadingCtrl.create({
      //loading screen
      message:'Updating data..',
      spinner: 'crescent',
      showBackdrop:true
    });
    loading.present();

    
    this.afauth.authState.subscribe(user => {
      this.userid = user.uid; 
      //get user id

      const y = firebase.firestore.Timestamp.fromDate(new Date(this.startTime)).toDate();//convert string to timestamp
      const z = firebase.firestore.Timestamp.fromDate(new Date(this.endTime)).toDate();

    this.afs.collection('users').doc(this.userid).collection('todo').doc(this.todoId).update({
      //updates the task in firestore
        'todoId': this.todoId,
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
      //on success task update
      this.toast('Task Updated!','success');
      console.log(this.todoId);
      this.router.navigate(['/home']);
      //navigate user back to home
    })
    .catch((error)=>{
      loading.dismiss();
      console.log(error.message);
      //on failed user update
      this.toast(error.message,'danger')
    });
  })

  }
  async toast(msg, status){
    //create toast form
    const toast = await this.toaster.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
    
  }// end of toas
}
