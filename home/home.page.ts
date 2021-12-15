import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  splash=true;
  tabBarElement:any;

  constructor() {
    //this.tabBarElement=document.querySelector('.tabbar');
  }

  //ionViewDidLoad(){
   // this.tabBarElement.style.display='none';
   // setTimeout(()=>{
     // this.splash=false;
      //this.tabBarElement.style.display='flex';

   // },4000);
 // }

}
