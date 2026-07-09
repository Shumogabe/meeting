import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentPageRoutingModule } from './document-routing.module';

import { DocumentPage } from './document.page';
import { GeneralModule } from '@app/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentPageRoutingModule,
    GeneralModule
  ],
  declarations: [DocumentPage]
})
export class DocumentPageModule {}
