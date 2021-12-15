import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { PopoverController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';



@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  todos:Todo[]
  todoCol: AngularFirestoreCollection<Todo>;

  userId:string;
  constructor(private popCtrl: PopoverController,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,) { }

  ngOnInit() {}

  //dismiss(item:string){
  
    //this.popCtrl.dismiss({
      //"fromPopover":item
   // })
  //}

  sortAlphabetically(){
    
    //gets user id
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;

      //sort by title by getting the 'todo' collection
      this.afs.collection('users').doc(this.userId).collection<Todo>('todo', ref => ref.orderBy('title', 'asc')).snapshotChanges().subscribe(colSnap => {
        this.todos = []
        colSnap.forEach(snap => {
          let todo: any = snap.payload.doc.data();
          todo.id = snap.payload.doc.id;
          todo.startTime = todo.startTime.toDate();
          todo.endTime = todo.endTime.toDate();
          this.todos.push(todo); //pushes list into todos array

          this.popCtrl.dismiss({
            "fromPopover":this.todos

            //closes popup aft click
        })
      })
    })
  })

        
  }

  sortDate1(){
    
     this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      //gets user id

      //sort by date ascending by getting the 'todo' collection
      this.afs.collection('users').doc(this.userId).collection<Todo>('todo', ref => ref.orderBy('startTime', 'asc')).snapshotChanges().subscribe(colSnap => {
        this.todos = []
        colSnap.forEach(snap => {
          let todo: any = snap.payload.doc.data();
          todo.id = snap.payload.doc.id;
          todo.startTime = todo.startTime.toDate();
          todo.endTime = todo.endTime.toDate();
          this.todos.push(todo); // push the list of data in todos

          this.popCtrl.dismiss({
            "fromPopover":this.todos
        })
      })
    })
  })


  }
  sortDate2(){
    
     this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      //gets user id

      //sort by date descending order by getting the 'todo' collection
      this.afs.collection('users').doc(this.userId).collection<Todo>('todo', ref => ref.orderBy('startTime', 'desc')).snapshotChanges().subscribe(colSnap => {
        this.todos = []
        colSnap.forEach(snap => {
          let todo: any = snap.payload.doc.data();
          todo.id = snap.payload.doc.id;
          todo.startTime = todo.startTime.toDate();
          todo.endTime = todo.endTime.toDate();
          this.todos.push(todo);//pushes list into todos array

          this.popCtrl.dismiss({
            "fromPopover":this.todos
        })
      })
    })
  })

  }

  priority(){
    
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      //gets user id

      //sort by priority ascending order by getting the 'todo' collection
      this.afs.collection('users').doc(this.userId).collection<Todo>('todo', ref => ref.orderBy('priority', 'asc')).snapshotChanges().subscribe(colSnap => {
        this.todos = []
        colSnap.forEach(snap => {
          let todo: any = snap.payload.doc.data();
          todo.id = snap.payload.doc.id;
          todo.startTime = todo.startTime.toDate();
          todo.endTime = todo.endTime.toDate();
          this.todos.push(todo); //pushes list into todos array

          this.popCtrl.dismiss({
            "fromPopover":this.todos
            //popup closes aft clicking on an option
        })
      })
    })
  })


  }

  
}
