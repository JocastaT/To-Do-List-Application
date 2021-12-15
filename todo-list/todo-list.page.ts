import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { AlertController, LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { totalmem } from 'os';
import { error } from 'protractor';
import { Todo } from '../models/todo';
import { TodoService } from '../services/todo.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { PopoverComponent } from '../components/popover/popover.component';
import { addDays } from "date-fns";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
  providers: [TodoService]
})
export class TodoListPage implements OnInit {

  todos: Todo[]
  currentDate;
  today: number = Date.now()

  confirm: any;
  title: string;
  searchTerm: string;
  userId: string;
  todoId: string;
  todoing: Todo[];
  category: string;
  notification: string;

  startTime: string;
  endTime: string;
  desc: string;
  priority: string;
  a: string;


  user: any = {};
  id: string;

  constructor(
    private afauth: AngularFireAuth,
    private todoService: TodoService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toaster: ToastController,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private localNotifications: LocalNotifications,
    private popCtrl: PopoverController,
    private alertCtrl: AlertController

  ) { }


  ngOnInit() {
    this.afauth.authState.subscribe(user => {
      this.id = user.uid;
      //get user id

      //gets user by id
      this.afs.collection('users').doc(this.id).valueChanges()
        .subscribe(singleDoc => {
          this.user = singleDoc;
          console.log(this.user);
        });

    });
    this.afauth.authState.subscribe(user => {
      this.userId = user.uid;
      //gets user id

            //get todo from todo collection of specific user
      this.afs.collection('users').doc(this.userId).collection<Todo>('todo', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges().subscribe(colSnap => {
        this.todos = []
        colSnap.forEach(snap => {
          let todo: any = snap.payload.doc.data();
          todo.id = snap.payload.doc.id;
          todo.startTime = todo.startTime.toDate();
          todo.endTime = todo.endTime.toDate();
          this.todos.push(todo); //pushes todo list into todos array

        })

      })
    })

    //get current date
    this.currentDate = new Date();
    console.log(this.currentDate)
  }




  async deleteUser() {
    const loading = await this.loadingCtrl.create({
      message: 'Deleting..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afauth.authState.subscribe(user => {
      this.userId = user.uid;
      //get user id

      //get user id to delete
      this.afs.collection('users').doc(this.userId).delete()
        .then(() => {
          user.delete().then(() => {
            // User deleted.
            loading.dismiss();
            this.toast('User Deleted!', 'success');
            this.afauth.signOut().then(() => {
              //navigate user to login page aft deleting
              this.router.navigate(['/login']);
            }, function (error) {
              console.log(error)
              // An error happened.
            });
          })
            .catch((error) => {
              loading.dismiss();
              console.log(error.message)
            });
        });
    })
  }


  async openPopover(ev: any) {
    // console.log("popover")
    const popover = await this.popCtrl.create({
      component: PopoverComponent,
      event: ev,
      cssClass: 'my-popover-class'
    })
    //popover dismisses aft click
    popover.onDidDismiss().then((data) =>
      this.todos = data.data.fromPopover
      //pass todos array from popover into todo list to display the list
    )

    return await popover.present()
  }


  async getTime(todoId) {
    const loading = await this.loadingCtrl.create({
      //loading message
      message: 'Logging in..',
      spinner: 'crescent',
      showBackdrop: true
    });

    let alert = await this.alertCtrl.create({
      //pop up alert
      header: 'Turn on notifications',
      message: 'Do you want to turn on notification for this task?',
      buttons: [
        {
          text: 'Set',
          handler: () => {
            this.afauth.authState.subscribe(user => {
              this.userId = user.uid;
              //get user id

                    //get todo from todo collection of specific user
              this.afs.collection('users').doc(this.userId).collection<Todo>('todo').snapshotChanges().subscribe(colSnap => {
                this.todos = []
                colSnap.forEach(snap => {
                  let todo: any = snap.payload.doc.data();
                  todo.id = snap.payload.doc.id;
                  todo.startTime = todo.startTime.toDate();
                  todo.endTime = todo.endTime.toDate();
                  this.todos.push(todo); // pushes todo list into todos array

                  //get todo Id to set notification for task that user set to turn on notification
                  this.afs.collection('users').doc(this.userId).collection<Todo>('todo').doc(todoId).snapshotChanges().subscribe(todos => {
                    let date = todo.startTime;
                    this.localNotifications.schedule({
                      //schedule the timing, with task title and desc in the message
                      id: new Date().getTime(),
                      title: todo.title,
                      text: todo.desc,
                      sound: "file://ionic-apps/assets/notif.mp3",
                      trigger: { at: date },
                      data: { secret: 'key_data' }
                    })

                  })
                  this.afs.collection('users').doc(this.userId).collection('todo').doc(todoId).update({
                    //update task details to notifications being set
                    'notification': 'set'
                  }).then(() => {
                    //on sucessful setting of notification
                    loading.dismiss();
                  }).catch((error) => {
                    //failure on setting notification
                    loading.dismiss();
                    this.toast(error.message, 'danger')
                  });
                })

              })
            })

            console.log('Set clicked');
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





  addNewTask() {
    this.router.navigate(['/add']);
    //navigate to add page

  }

  edit(todoId) {
    this.router.navigate(['/edit', todoId]);
    console.log(todoId)
    //get task id to pass data into edit page
  }

  email(todoId) {
    this.router.navigate(['/email', todoId]);
    //get task id to pass data into email page
    console.log(todoId)
  }

  async delete(todoId) {
    const loading = await this.loadingCtrl.create({
      //loading message
      message: 'Deleting..',
      spinner: 'crescent',
      showBackdrop: true
    });

    let alert = await this.alertCtrl.create({
      //alert popup shows
      header: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            loading.present();

            this.afauth.authState.subscribe(user => {
              this.userId = user.uid;
              //get user id

              //get task id to delete the task selected
              this.afs.collection('users').doc(this.userId).collection<Todo>('todo').doc(todoId).delete()
                .then(() => {
                  this.afs.collection('users').doc(this.userId).collection<Todo>('done').doc(todoId).delete()
                  //delete  task from completed task 

                  loading.dismiss();
                  console.log(todoId)
                  this.toast('Task Deleted!', 'success');
                  //on success deleting of task
                })
                .catch((error) => {
                  loading.dismiss();
                  this.toast(error.message, 'danger')
                  //on failure to delete task
                });
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
  
}//end of delete task

async done(todoId) {
  const loading = await this.loadingCtrl.create({
    message: 'Updating status..',
    spinner: 'crescent',
    showBackdrop: true
  });

  loading.present();

  this.afauth.authState.subscribe(user => {
    this.userId = user.uid;
    //get user id

      //get todo from todo collection of specific user
    this.afs.collection('users').doc(this.userId).collection<Todo>('todo').doc(todoId).valueChanges().subscribe(todo => {
      this.title = todo?.title;
      this.desc = todo?.desc;
      this.priority = todo?.priority;
      //get task information by id

      this.afs.collection('users').doc(this.userId).collection('done').doc(todoId).set({
        //add task into another list by getting task info by task id to store in another list
        'todoId': todoId,
        'title': todo?.title,
        'desc': todo?.desc,
        'priority': todo?.priority,
        'startTime': todo?.startTime,
        'endTime': todo?.endTime,
        'allDay': 'false',
        'status': 'Completed',
        'createdAt': Date.now(),
        'category': todo?.category,
        'notification': todo?.notification
      }).then(() => {
        loading.dismiss();
        this.afs.collection('users').doc(this.userId).collection<Todo>('todo').doc(todoId).update({
          //update task to completed status
          'status': 'Completed',
        })
      }).catch((error) => {
        loading.dismiss();
        this.toast(error.message, 'danger')
      });

    })
  })

}




async toast(msg, status) {
  const toast = await this.toaster.create({
    message: msg,
    position: 'top',
    color: status,
    duration: 2000
  });
  toast.present();
}//end of toast

}
