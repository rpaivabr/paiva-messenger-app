import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TalkPageRoutingModule } from './talk-routing.module';
import { TalkPage } from './talk.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TalkPageRoutingModule
  ],
  declarations: [TalkPage]
})
export class TalkPageModule {}
