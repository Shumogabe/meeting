import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletedPageRoutingModule } from './deleted-routing.module';

import { DeletedPage } from './deleted.page';
import { GeneralModule } from '@app/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletedPageRoutingModule,
    GeneralModule
  ],
  declarations: [DeletedPage]
})
export class DeletedPageModule {}
