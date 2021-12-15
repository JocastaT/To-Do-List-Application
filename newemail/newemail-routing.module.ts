import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewemailPage } from './newemail.page';

const routes: Routes = [
  {
    path: '',
    component: NewemailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewemailPageRoutingModule {}
