import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Todo } from './models/todo';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user:any={};
  id:string;
  today: number = Date.now()
  dynamicColor:string;
  userId:string;
  todos:Todo[]
  private authService:AuthService

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router:Router
  ) { 
    this.dynamicColor='light';

  }
  


  ngOnInit() {
    this.afauth.authState.subscribe(user => {
      this.id = user.uid;

      //get user by id
      this.afs.collection('users').doc(this.id).valueChanges()
        .subscribe(singleDoc =>{
        this.user = singleDoc;
        //get user from singledoc
        console.log(this.user);
      });

    });
    this.afauth.authState.subscribe(user => {
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
          this.todos.push(todo);//push todo list into todos array
          
        })
        
      })
    })

   
  }

  logout() {
    //logout user and navigate user to login
    return this.afauth.signOut().then(() => {
      this.router.navigate(['/login']);

    });

  }

}