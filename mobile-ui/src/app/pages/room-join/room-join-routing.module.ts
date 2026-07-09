import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomJoinPage } from './room-join.page';

const routes: Routes = [
  {
    path: '',
    component: RoomJoinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomJoinPageRoutingModule {}
