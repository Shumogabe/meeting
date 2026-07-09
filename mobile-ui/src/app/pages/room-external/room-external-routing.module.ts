import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomExternalPage } from './room-external.page';

const routes: Routes = [
  {
    path: '',
    component: RoomExternalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomExternalPageRoutingModule {}
