import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewemailPageRoutingModule } from './newemail-routing.module';

import { NewemailPage } from './newemail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewemailPageRoutingModule
  ],
  declarations: [NewemailPage]
})
export class NewemailPageModule {}
