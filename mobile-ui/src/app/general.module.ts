import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { SafePipeModule } from 'safe-pipe';
import { I18nModule } from "./i18n/i18n.module";
import { ChartModule, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { CategoryService, ColumnSeriesService, DataLabelService, LegendService, PieSeriesService, TooltipService } from '@syncfusion/ej2-angular-charts';
import { AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService } from '@syncfusion/ej2-angular-charts';

import { FooterTabsComponent } from "./components/footer-tabs/footer-tabs.component";

import { ModalDatetimePickerComponent } from "./modals/modal-datetime-picker/modal-datetime-picker.component";
import { ModalUserSearchComponent } from "./modals/modal-user-search/modal-user-search.component";
import { ModalDocumentDetailComponent } from "./modals/modal-document-detail/modal-document-detail.component";

import { ModalScheduleAddComponent } from "./modals/modal-schedule-add/modal-schedule-add.component";
import { ModalScheduleAddAdvanceComponent } from "./modals/modal-schedule-add-advance/modal-schedule-add-advance.component";

import { ModalVoteInRoomComponent } from "./modals/modal-vote-in-room/modal-vote-in-room.component";
import { ModalVoteChoiceComponent } from "./modals/modal-vote-choice/modal-vote-choice.component";
import { ModalVoteDetailComponent } from "./modals/modal-vote-detail/modal-vote-detail.component";
import { ModalDocumentInRoomComponent } from "./modals/modal-document-in-room/modal-document-in-room.component";

//ORg4AjUWIQA/Gnt2UlhhQlVMfV5AQmJOYVF2R2dJe1R1c19FYkwgOX1dQl9nSH9ScUVmWX9feXxcTmY=

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SafePipeModule,
        I18nModule,
        ChartModule,    //chart column
        AccumulationChartModule //chart pie
    ],
    providers: [
        //chart column
        ColumnSeriesService, CategoryService, LegendService, TooltipService, DataLabelService,
        //chart pie
        PieSeriesService, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AccumulationAnnotationService,
    ],
    declarations: [
        FooterTabsComponent,
        //
        ModalDatetimePickerComponent,
        ModalUserSearchComponent,

        ModalScheduleAddComponent,
        ModalScheduleAddAdvanceComponent,

        ModalVoteInRoomComponent,
        ModalVoteChoiceComponent,
        ModalVoteDetailComponent,

        ModalDocumentInRoomComponent,
        ModalDocumentDetailComponent,
    ],
    exports: [
        SafePipeModule,
        I18nModule,
        FooterTabsComponent,
    ]
})
export class GeneralModule { }
