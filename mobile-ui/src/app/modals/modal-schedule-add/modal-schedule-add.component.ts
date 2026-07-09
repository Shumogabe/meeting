import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, ModalController, ToastController } from '@ionic/angular';
import { RepQuanLyLapLich_danhsachserver, RepQuanLyLapLich_them } from 'src/api_repository/repQuanLyLapLich';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { MeetingType, StatusSchedule } from 'src/app_func/appLookup';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-schedule-add',
  templateUrl: './modal-schedule-add.component.html',
  styleUrls: ['./modal-schedule-add.component.scss'],
})
export class ModalScheduleAddComponent implements OnInit {

  @ViewChild('inputRoomName') inputRoomName?: IonInput;
  @ViewChild('inputRoomPwd') inputRoomPwd?: IonInput;

  public dataForm: { title?: string, password?: string, serverId?: number } = {};
  public isPwd?: boolean;
  public MeetingServers: Array<any> = [];
  constructor(private router: Router, private toastController: ToastController, private modalController: ModalController) { }

  ngOnInit() {
    //danh sách server
    RepQuanLyLapLich_danhsachserver({
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          let MeetingServers = res.data || [];
          //thiết lập dữ liệu ban đầu
          if (MeetingServers.length) {
            //this.dataForm.serverId = MeetingServers[0].id;
            this.dataForm.serverId = this.MeetingServers.find(f => f.default)?.id;
            //console.log(MeetingServers[0]);
          }
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputRoomName?.setFocus();
    }, 300);
  }

  modalClose() {
    this.modalController.dismiss();
  }

  async changeIsPwd(ev: any) {
    this.isPwd = ev.detail.checked;

    if (this.isPwd) {
      if (!this.dataForm.title) {
        this.dataForm.title = 'Họp ngay ' + APP_FUNC_FormatDate();
      }

      setTimeout(() => {
        this.inputRoomPwd?.setFocus();
      }, 300);
    }
  }

  async changeTitle(ev: any) {
    this.dataForm.title = ev.detail.value?.trim();
  }

  async changePassword(ev: any) {
    this.dataForm.password = ev.detail.value?.trim();
  }

  get submitRoomAdd_Disabled() {
    return !this.dataForm.title
      || !this.dataForm.password && this.isPwd
      ? true : false
  }

  async submitRoomAdd() {
    RepQuanLyLapLich_them({
      params: {
        title: this.dataForm.title,
        password: this.dataForm.password,
        place: "Họp trực tuyến",
        serverId: this.dataForm.serverId,
        typeId: MeetingType.GIAOBAN,
        status: StatusSchedule.DADUYET,
        start: true,
        isLobby: false,
        isPublished: true,
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        //
        if (res?.status) {
          this.modalController.dismiss().then(() => {

            //
            if (res.data) {
              this.router.navigateByUrl(APP_ROUTE.ROOM_EXTERNAL_ID.replace(':id', res.data));
            }
            else {
              this.router.navigateByUrl(APP_ROUTE.HOME);
            }

          });
        }
      }
    });
  }
}
