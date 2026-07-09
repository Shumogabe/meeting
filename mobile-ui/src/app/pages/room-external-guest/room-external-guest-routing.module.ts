import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomExternalGuestPage } from './room-external-guest.page';

const routes: Routes = [
  {
    path: '',
    component: RoomExternalGuestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomExternalGuestPageRoutingModule {}
