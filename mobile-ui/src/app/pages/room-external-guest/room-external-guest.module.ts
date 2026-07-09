import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomExternalGuestPageRoutingModule } from './room-external-guest-routing.module';

import { RoomExternalGuestPage } from './room-external-guest.page';
import { GeneralModule } from '@app/general.module';
import { RoomModule } from '@app/room.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomExternalGuestPageRoutingModule,
    GeneralModule,
    RoomModule
  ],
  declarations: [RoomExternalGuestPage]
})
export class RoomExternalGuestPageModule { }
