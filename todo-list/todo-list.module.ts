import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodoListPageRoutingModule } from './todo-list-routing.module';

import { TodoListPage } from './todo-list.page';

import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import {PopoverComponent} from 'src/app/components/popover/popover.component'




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodoListPageRoutingModule,
    Ng2SearchPipeModule,


  ],
  declarations: [TodoListPage, PopoverComponent]
})
export class TodoListPageModule {}
