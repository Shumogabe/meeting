import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import moment from 'moment';
import { RepQuanLyLapLich_danhsachserver, RepQuanLyLapLich_them } from 'src/api_repository/repQuanLyLapLich';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';
import { ModalDatetimePickerComponent } from '../modal-datetime-picker/modal-datetime-picker.component';
import { IUser } from 'src/app_models/Auth';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { MeetingType, StatusSchedule } from 'src/app_func/appLookup';
import { ModalUserSearchComponent } from '../modal-user-search/modal-user-search.component';

@Component({
  selector: 'app-modal-schedule-add-advance',
  templateUrl: './modal-schedule-add-advance.component.html',
  styleUrls: ['./modal-schedule-add-advance.component.scss'],
})
export class ModalScheduleAddAdvanceComponent implements OnInit {

  @ViewChild('inputTitle') inputTitle?: IonInput;
  @ViewChild('inputRoomPwd') inputRoomPwd?: IonInput;

  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;

  public MeetingTypes: Array<any> = [];
  public MeetingServers: Array<any> = [];

  public dataForm: { title?: string, content?: string, place?: string, roomName?: string, password?: string, startTime?: any, endTime?: any, isLobby?: boolean, isPublished?: boolean, serverId?: number, typeId?: number, userChairMan?: any, userShareRole?: any } = {
    roomName: moment(new Date()).format('YYYYMMDDHHmmss'),
    isLobby: false,
    isPublished: true
  };
  public isPwd?: boolean;

  public user?: IUser;

  constructor(private router: Router, private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    (async () => {
      this.user = (await APP_AUTHENTICATE_GetAuth()).data;
      this.dataForm.userChairMan = this.user;

      this.MeetingTypes = MeetingType._data;

      //thiết lập dữ liệu ban đầu
      if (this.MeetingTypes.length) {
        this.dataForm.typeId = this.MeetingTypes[0].id;
      }

      //danh sách server
      RepQuanLyLapLich_danhsachserver({
        callback: (res?: IOptionResponse) => {
          if (res?.status) {
            this.MeetingServers = res.data || [];

            //thiết lập dữ liệu ban đầu
            if (this.MeetingServers.length) {
              this.dataForm.serverId = this.MeetingServers.find(f => f.default)?.id;
              //console.log(this.MeetingServers.find(f => f.default));
            }
          }
          else {
            APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
          }
        }
      });

    })();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputTitle?.setFocus();
    }, 300);
  }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit() {
    RepQuanLyLapLich_them({
      params: {
        title: this.dataForm.title,
        content: this.dataForm.content,
        startTime: this.dataForm.startTime,
        endTime: this.dataForm.endTime,
        place: this.dataForm.place,

        roomName: this.dataForm.roomName,
        password: this.dataForm.password,

        status: StatusSchedule.CHODUYET,
        start: false,

        isLobby: this.dataForm.isLobby,
        isPublished: this.dataForm.isPublished,

        chairMan: this.dataForm.userChairMan?.id,
        sharedRole: this.dataForm.userShareRole?.id,

        serverId: this.dataForm.serverId,
        typeId: this.dataForm.typeId,
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        //
        if (res?.status) {
          this.modalController.dismiss().then(() => {

            //
            if (res.data) {
              this.router.navigateByUrl(APP_ROUTE.SCHEDULE_DETAIL_ID.replace(':id', res.data));
            }
            else {
              this.router.navigateByUrl(APP_ROUTE.SCHEDULE);
            }

          });
        }
      }
    });
  }

  get modalSubmit_Disabled() {
    return !this.dataForm.title
      || !this.dataForm.roomName
      || !this.dataForm.password && this.isPwd
      || !this.dataForm.startTime
      || !this.dataForm.endTime
      ? true : false
  }

  async changeIsPwd(ev: any) {
    this.isPwd = ev.detail.checked;

    if (this.isPwd) {
      if (!this.dataForm.title) {
        this.dataForm.title = 'Họp trực tuyến';
      }

      setTimeout(() => {
        this.inputRoomPwd?.setFocus();
      }, 300);
    }
  }

  async changeIsLobby(ev: any) {
    this.dataForm.isLobby = ev.detail.checked;
  }

  async changeIsPublished(ev: any) {
    this.dataForm.isPublished = ev.detail.checked;
  }

  async changeTitle(ev: any) {
    this.dataForm.title = ev.detail.value?.trim();
  }

  async changeContent(ev: any) {
    this.dataForm.content = ev.detail.value?.trim();
  }

  async changePlace(ev: any) {
    this.dataForm.place = ev.detail.value?.trim();
  }

  async changeRoomName(ev: any) {
    this.dataForm.roomName = ev.detail.value?.replace(/[^a-zA-Z0-9]/g, '');
  }

  async changePassword(ev: any) {
    this.dataForm.password = ev.detail.value?.trim();
  }

  async changeType(ev: any) {
    this.dataForm.typeId = ev.detail.value;
  }

  async changeServer(ev: any) {
    this.dataForm.serverId = ev.detail.value;
  }

  //

  removeChairMan() {
    this.dataForm.userChairMan = undefined;
  }

  removeShareRole() {
    this.dataForm.userShareRole = undefined;
  }

  //

  async presentModalDatetimePicker_DateFrom() {
    const modal = await this.modalController.create({
      component: ModalDatetimePickerComponent,
      componentProps: {
        options: {
          presentation: 'date-time',
          min: new Date(),
          value: this.dataForm.startTime,
        }
      },
      cssClass: 'ion-modal-auto'
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.dataForm.startTime = e.data;
      }
    });

    modal.present();
  }

  async presentModalDatetimePicker_DateTo() {
    const modal = await this.modalController.create({
      component: ModalDatetimePickerComponent,
      componentProps: {
        options: {
          presentation: 'date-time',
          min: new Date(),
          value: this.dataForm.endTime,
        }
      },
      cssClass: 'ion-modal-auto'
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.dataForm.endTime = e.data;
      }
    });

    modal.present();
  }

  async presentModalUserSearch_chairman() {
    let modal = await this.modalController.create({
      component: ModalUserSearchComponent,
      cssClass: 'ion-modal-breakpoint',
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.dataForm.userChairMan = e.data;
      }
    });

    modal.present();
  }

  async presentModalUserSearch_sharedRole() {
    let modal = await this.modalController.create({
      component: ModalUserSearchComponent,
      cssClass: 'ion-modal-breakpoint',
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.dataForm.userShareRole = e.data;
      }
    });

    modal.present();
  }

}
