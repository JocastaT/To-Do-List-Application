import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedPageRoutingModule } from './completed-routing.module';

import { CompletedPage } from './completed.page';
import {Ng2SearchPipeModule} from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [CompletedPage]
})
export class CompletedPageModule {}
