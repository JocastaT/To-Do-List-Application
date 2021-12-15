import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Todo} from '../models/todo';
import {map} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable()
export class TodoService {

  todoCol: AngularFirestoreCollection<Todo>;
  todoDoc: AngularFirestoreDocument<Todo>;
  todos:Observable<Todo[]>;
  todo: Observable<Todo>;
  todo$: any;
  todoId: string;
  userId:string;


  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) 
  {
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      //get user id
    
      //store todo collection in  todo firestore collection
    this.todoCol = this.afs.collection('users').doc(this.userId).collection<Todo>('todo',ref => ref.orderBy('createdAt','desc'));
    this.todos = this.todoCol.snapshotChanges().pipe(
      map(action => {
        return action.map(
          a =>
          {
            //get todo 
            const data:any = a.payload.doc.data() as Todo;
  
                  data.todoId=a.payload.doc.id;
      
                  return data;
          }
        )
      })
    )
    })
   // end of constructor
  }

   getTodos()
   {
     return this.todos;
   }// end of get todo list

   getTodo(todoId)
   {
     //get todo collection
    this.todoCol = this.afs.collection('users', ref => ref.orderBy('createdAt','desc')).doc(this.userId).collection<Todo>('todo');
    return this.todo = this.todoDoc.valueChanges();
  }// end of get todo
  
}
