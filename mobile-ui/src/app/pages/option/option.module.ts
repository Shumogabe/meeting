import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionPageRoutingModule } from './option-routing.module';

import { OptionPage } from './option.page';
import { GeneralModule } from '@app/general.module';
import { ModalOptionAddComponent } from '@app/modals/modal-option-add/modal-option-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionPageRoutingModule,
    GeneralModule
  ],
  declarations: [OptionPage, ModalOptionAddComponent]
})
export class OptionPageModule { }
