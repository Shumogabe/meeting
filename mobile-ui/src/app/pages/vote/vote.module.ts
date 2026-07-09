import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotePageRoutingModule } from './vote-routing.module';

import { VotePage } from './vote.page';
import { GeneralModule } from '@app/general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotePageRoutingModule,
    GeneralModule
  ],
  declarations: [VotePage]
})
export class VotePageModule { }
