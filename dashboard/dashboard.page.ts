import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Todo } from '../models/todo';
import { Storage } from "@ionic/storage-angular";
import { WeatherService } from '../services/weather.service';
import { FormGroup,FormControl, ReactiveFormsModule, Validators } from "@angular/forms";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  user:any={};
  id:string;
  today: number = Date.now()
  dynamicColor:string;
  userId:string;
  todos:Todo[]

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private weatherService: WeatherService,
    private storage: Storage
  ) { 
    this.dynamicColor='light';
  }

  async ngOnInit() {
    this.afauth.authState.subscribe(user => {
      this.id = user.uid;
      //gets user id

      //gets user data using id
      this.afs.collection('users').doc(this.id).valueChanges()
        .subscribe(singleDoc =>{
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
          this.todos.push(todo); //pushes list into todos array
          
        })
        
      })
    })
    await this.storage.create();
		this.getWeather();
    //store weather data in a storage

   
  }
    
  public weatherForm = new FormGroup({
    city: new FormControl("", Validators.required), //creating form
  });
  public weather: Object;
  public city: string;

  search(formData: FormData) {
    console.log(formData)
    this.storage.set("city", formData["city"]);
    //store weather data of each city, depending on what user keys in

    this.weatherService
      .getWeatherFromApi(formData["city"]) //weather data of each city
      .subscribe((weather) => {
        this.weather = weather;
        console.log(weather)
      });
  }

  getWeather() {
    this.storage
      .get("city") //getting city weather storage 
      .then((city)=>{
        if(city == null){
          this.weatherService
          .getWeatherFromApi("madrid")
          .subscribe((weather)=>{
            this.weather = weather;
            console.log("weather from madrid, storage empty",weather)
            //if no request, show empty storage
          });
        }
        else{
          //get weather by city
          this.weatherService.getWeatherFromApi(city).subscribe((weather)=>{
            this.weather=weather;
            console.log(weather);
          });
          }

      })
      .catch((err)=>{
        console.log(err);
      })
  }
  

}
