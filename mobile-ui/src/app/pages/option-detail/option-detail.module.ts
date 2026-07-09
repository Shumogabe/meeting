import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionDetailPageRoutingModule } from './option-detail-routing.module';

import { OptionDetailPage } from './option-detail.page';
import { GeneralModule } from '@app/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionDetailPageRoutingModule,
    GeneralModule
  ],
  declarations: [OptionDetailPage]
})
export class OptionDetailPageModule {}
