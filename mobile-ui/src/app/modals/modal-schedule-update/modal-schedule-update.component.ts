import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import moment from 'moment';
import { RepQuanLyLapLich_chinhsua, RepQuanLyLapLich_danhsachserver, RepQuanLyLapLich_them, RepQuanLyLapLich_thongtin } from 'src/api_repository/repQuanLyLapLich';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';
import { ModalDatetimePickerComponent } from '../modal-datetime-picker/modal-datetime-picker.component';
import { IUser } from 'src/app_models/Auth';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { MeetingType } from 'src/app_func/appLookup';
import { ModalUserSearchComponent } from '../modal-user-search/modal-user-search.component';

@Component({
  selector: 'app-modal-schedule-update',
  templateUrl: './modal-schedule-update.component.html',
  styleUrls: ['./modal-schedule-update.component.scss'],
})
export class ModalScheduleUpdateComponent implements OnInit {

  @Input({ required: true }) id?: any;

  @ViewChild('inputTitle') inputTitle?: IonInput;
  @ViewChild('inputRoomPwd') inputRoomPwd?: IonInput;

  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;

  public MeetingTypes: Array<any> = [];
  public MeetingServers: Array<any> = [];

  public dataForm?: any;
  public isPwd?: boolean;

  public user?: IUser;

  constructor(private router: Router, private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.refreshData();

    (async () => {
      this.user = (await APP_AUTHENTICATE_GetAuth()).data;

      this.MeetingTypes = MeetingType._data;

      //danh sách server
      RepQuanLyLapLich_danhsachserver({
        callback: (res?: IOptionResponse) => {
          if (res?.status) {
            this.MeetingServers = res.data || [];
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

  async refreshData() {
    RepQuanLyLapLich_thongtin({
      loadingController: this.loadingController,
      params: {
        id: this.id
      },
      callback: (res?: IOptionResponse) => {

        if (res?.status) {
          this.dataForm = res?.data || {};
          this.isPwd = this.dataForm.password ? true : false;
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }

      }
    });
  }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit() {
    RepQuanLyLapLich_chinhsua({
      params: Object.assign(this.dataForm, {
        status: 1,
        password: this.isPwd ? this.dataForm.password : null,
        chairMan: this.dataForm.userChairMan?.id,
        sharedRole: this.dataForm.userShareRole?.id,
      }),
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        //
        if (res?.status) {
          this.modalController.dismiss(null, 'success');
        }
      }
    });
  }

  get modalSubmit_Disabled() {
    return !this.dataForm
      || !this.dataForm.title
      || !this.dataForm.roomName
      || !this.dataForm.password && this.isPwd
      || !this.dataForm.startTime
      || !this.dataForm.endTime
      || !this.dataForm.typeId
      || !this.dataForm.serverId
      || !this.dataForm.userChairMan?.id
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

  async changeRoomPwd(ev: any) {
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
          min: moment(new Date()).format('YYYY-MM-DD'),
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
