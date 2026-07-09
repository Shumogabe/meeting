import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomJoinPageRoutingModule } from './room-join-routing.module';

import { RoomJoinPage } from './room-join.page';
import { GeneralModule } from '@app/general.module';
import { RoomModule } from '@app/room.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomJoinPageRoutingModule,
    GeneralModule
  ],
  declarations: [RoomJoinPage]
})
export class RoomJoinPageModule { }
