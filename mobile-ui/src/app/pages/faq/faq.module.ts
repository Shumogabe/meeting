import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';

import { FaqPage } from './faq.page';
import { GeneralModule } from '@app/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    GeneralModule
  ],
  declarations: [FaqPage]
})
export class FaqPageModule { }
