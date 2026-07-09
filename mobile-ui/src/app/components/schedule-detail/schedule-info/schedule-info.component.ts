import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalScheduleUpdateComponent } from '@app/modals/modal-schedule-update/modal-schedule-update.component';
import { ModalUserSearchComponent } from '@app/modals/modal-user-search/modal-user-search.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepQuanLyLapLich_huyxacnhan, RepQuanLyLapLich_thongtin, RepQuanLyLapLich_xacnhan, RepQuanLyLapLich_xoa } from 'src/api_repository/repQuanLyLapLich';
import { RepThanhPhanThamGia_them } from 'src/api_repository/repThanhPhanThamGia';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_CopyToClipboard, APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { Role, StatusSchedule } from 'src/app_func/appLookup';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { ColorStatusSchedule } from 'src/app_func/appUIStatus';
import { IRole } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-schedule-info',
  templateUrl: './schedule-info.component.html',
  styleUrls: ['./schedule-info.component.scss'],
})
export class ScheduleInfoComponent implements OnInit {

  @Input({ required: true }) itemData: any;
  @Input() inherits?: { refreshDataId?: Function };

  public APP_ROUTE = APP_ROUTE;
  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;

  public StatusSchedule = StatusSchedule;
  public ColorStatusSchedule = ColorStatusSchedule;

  public isShowPwd?: boolean;
  public isCopied?: boolean;

  public listUser: Array<any> = [];

  public Role = Role;
  public userRoles?: Array<IRole>;

  public isAddEdit?: boolean;
  public isEnd?: boolean;

  constructor(private router: Router, private toastController: ToastController, private modalController: ModalController, private loadingController: LoadingController) { }

  ngOnInit() {
    APP_AUTHENTICATE_GetAuth().then(user => {
      this.userRoles = user.roles;

      this.isEnd = !this.itemData?.start && this.itemData.status == StatusSchedule.HUYDUYET;

      //thông tin sở hữu
      this.isAddEdit = this.itemData?.userCreatedBy?.id == user.data?.id
        || this.itemData?.userChairMan?.id == user.data?.id
        || this.itemData?.userShareRole?.id == user.data?.id;

      //chưa bị xóa
      this.isAddEdit = this.isAddEdit && !this.itemData?.isDeleted;

      //chưa kết thúc
      this.isAddEdit = this.isAddEdit && !this.isEnd;
    });

    this.listUser = this.itemData.meetingMember || [];
  }

  refreshData(callback?: Function) {
    RepQuanLyLapLich_thongtin({
      loadingController: this.loadingController,
      params: {
        id: this.itemData.id
      },
      callback: (res?: IOptionResponse) => {
        this.itemData = res?.data;

        this.listUser = this.itemData?.meetingMember || [];

        if (callback) callback();
      }
    });
  }

  async changeIsPwd(flag: boolean) {
    this.isShowPwd = flag;
  }

  async copyRoomCode(data: string) {
    this.isCopied = APP_FUNC_CopyToClipboard(data);

    if (this.isCopied) {
      APP_COMPONENT_IonToast(this.toastController, { color: 'success', message: 'Đã sao chép mã phòng họp!' }).then(toast => toast.present());
    }
  }

  async navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  //

  async presentModalScheduleUpdate() {
    const modal = await this.modalController.create({
      component: ModalScheduleUpdateComponent,
      componentProps: {
        id: this.itemData.id
      }
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.refreshData();
      }
    });

    modal.present();
  };

  //

  async confirmScheduleOk(id: any) {
    RepQuanLyLapLich_xacnhan({
      loadingController: this.loadingController,
      params: {
        id: id
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          //
          this.refreshData();
        }
      }
    });
  }

  async confirmScheduleCancel(id: any) {
    RepQuanLyLapLich_huyxacnhan({
      loadingController: this.loadingController,
      params: {
        id: id
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          //
          this.refreshData();
        }
      }
    });
  }

  async confirmDelete(modal?: any) {
    RepQuanLyLapLich_xoa({
      loadingController: this.loadingController,
      params: {
        id: this.itemData.id
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          //
          modal?.dismiss();

          //
          this.router.navigateByUrl(APP_ROUTE.SCHEDULE, { replaceUrl: true });
        }
      }
    });
  }

  //

  async presentModalUserSearch_invite() {
    let modal = await this.modalController.create({
      component: ModalUserSearchComponent,
      cssClass: 'ion-modal-breakpoint',
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        RepThanhPhanThamGia_them({
          params: {
            scheduleId: this.itemData.id,
            userId: e.data.id,
            email: e.data.email,
            activated: true
          },
          callback: (res?: IOptionResponse) => {

            APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

            if (res?.status) {
              this.refreshData();
            }
          }
        });
      }
    });

    modal.present();
  }

}
