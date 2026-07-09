import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { SafePipeModule } from 'safe-pipe';

import { JitsiMeetComponent } from "./components/jitsi-meet/jitsi-meet.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SafePipeModule,
    ],
    declarations: [
        JitsiMeetComponent
    ],
    exports: [
        SafePipeModule,
        JitsiMeetComponent
    ]
})
export class RoomModule { }
