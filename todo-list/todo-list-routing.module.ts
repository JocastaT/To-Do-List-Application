import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoListPageModule } from '../todo-list/todo-list.module';

import { TodoListPage } from './todo-list.page';

const routes: Routes = [
  {
    path: '',
    component: TodoListPage
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoListPageRoutingModule {}
