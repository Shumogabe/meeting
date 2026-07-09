import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomExternalPageRoutingModule } from './room-external-routing.module';

import { RoomExternalPage } from './room-external.page';
import { GeneralModule } from '@app/general.module';
import { RoomModule } from '@app/room.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomExternalPageRoutingModule,
    GeneralModule,
    RoomModule
  ],
  declarations: [RoomExternalPage]
})
export class RoomExternalPageModule { }
