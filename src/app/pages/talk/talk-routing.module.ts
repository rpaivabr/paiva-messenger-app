import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalkPage } from './talk.page';

const routes: Routes = [
  {
    path: '',
    component: TalkPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalkPageRoutingModule {}
