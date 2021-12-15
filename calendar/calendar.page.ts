import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  eventSource=[];
  date: string;
  viewTitle;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  selectedDate = new Date();
  todoId:string;
  userid: string;
  constructor(private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private router: Router) {

     }

  ngOnInit() {

    //get user id
    this.afauth.authState.subscribe(user => {
      this.userid = user.uid;

      //using user id to get the todo collection of the user
    this.afs.collection('users').doc(this.userid).collection('todo').snapshotChanges().subscribe(colSnap=>{
      this.eventSource=[]; // store tasks in eventSource
      colSnap.forEach(snap =>{
        //gets task id from the todo collection
        let todo:any = snap.payload.doc.data();
        todo.id= snap.payload.doc.id;
        todo.startTime= todo.startTime.toDate(); //convert nanoseconds into date in DD/MM/YYYY
        todo.endTime= todo.endTime.toDate();
        console.log(todo);
        this.eventSource.push(todo); //push task data into eventSource 
      })
    })
  })
}

  addNewTask(){
    this.router.navigate(['/add']);
    //navigate to add page

  }

  onViewTitleChanged(title) {
    this.viewTitle=title;
    console.log(title);
    //shows the title of the month in the calendar
  }

  onEventSelected(todo) {
    this.todoId=todo.todoId;
    this.router.navigate(['/edit', this.todoId]);
    //on click on task, it will navi
    
    console.log('Task selected:' + todo.startTime + '-' + todo.endTime + ',' + todo.title);
  }

  onTimeSelected(td) {
    console.log('Selected time: ' + td.selectedTime + ', hasEvents: ' +
      (td.todos !== undefined && td.todos.length !== 0) + ', disabled: ' + td.disabled);
    this.selectedDate = td.selectedTime;
    //gets the selected time of the current time
    console.log(this.selectedDate)
  }

  onCurrentDateChanged(todo: Date) {
    console.log('current date change: ' + todo);
    //today's date
  }

  onRangeChanged(td) {
    console.log('range changed: startTime: ' + td.startTime + ', endTime: ' + td.endTime);
    //range between the starttime and end time
  }

}
