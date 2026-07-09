import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleDetailPageRoutingModule } from './schedule-detail-routing.module';

import { ScheduleDetailPage } from './schedule-detail.page';
import { ModalScheduleUpdateComponent } from '@app/modals/modal-schedule-update/modal-schedule-update.component';
import { GeneralModule } from '@app/general.module';
import { ScheduleInfoComponent } from '@app/components/schedule-detail/schedule-info/schedule-info.component';
import { ScheduleDocumentComponent } from '@app/components/schedule-detail/schedule-document/schedule-document.component';
import { ScheduleVoteComponent } from '@app/components/schedule-detail/schedule-vote/schedule-vote.component';
import { ScheduleConslusionComponent } from '@app/components/schedule-detail/schedule-conslusion/schedule-conslusion.component';
import { ModalVoteAddComponent } from '@app/modals/modal-vote-add/modal-vote-add.component';
import { ModalVoteUpdateComponent } from '@app/modals/modal-vote-update/modal-vote-update.component';
import { ModalConslusionAddComponent } from '@app/modals/modal-conslusion-add/modal-conslusion-add.component';
import { ModalConslusionUpdateComponent } from '@app/modals/modal-conslusion-update/modal-conslusion-update.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleDetailPageRoutingModule,
    GeneralModule
  ],
  declarations: [
    ScheduleDetailPage,
    ModalScheduleUpdateComponent,
    ScheduleInfoComponent,
    ScheduleDocumentComponent,
    ScheduleVoteComponent,
    ScheduleConslusionComponent,
    ModalVoteAddComponent,
    ModalVoteUpdateComponent,
    ModalConslusionAddComponent,
    ModalConslusionUpdateComponent,
  ]
})
export class ScheduleDetailPageModule { }
