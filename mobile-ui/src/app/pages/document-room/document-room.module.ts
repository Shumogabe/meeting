import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentRoomPageRoutingModule } from './document-room-routing.module';

import { DocumentRoomPage } from './document-room.page';
import { GeneralModule } from '@app/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentRoomPageRoutingModule,
    GeneralModule
  ],
  declarations: [DocumentRoomPage]
})
export class DocumentRoomPageModule {}
