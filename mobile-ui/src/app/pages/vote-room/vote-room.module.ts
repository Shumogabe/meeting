import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoteRoomPageRoutingModule } from './vote-room-routing.module';

import { VoteRoomPage } from './vote-room.page';
import { GeneralModule } from '@app/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoteRoomPageRoutingModule,
    GeneralModule
  ],
  declarations: [VoteRoomPage]
})
export class VoteRoomPageModule { }
