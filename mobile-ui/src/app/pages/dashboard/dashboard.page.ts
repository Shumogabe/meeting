import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import moment from 'moment';
import { RepQuanLyLapLich_chitietphonghop, RepQuanLyLapLich_danhsach } from 'src/api_repository/repQuanLyLapLich';
import { APP_AUTHENTICATE_GetAuthRequire, APP_AUTHENTICATE_IsAuthRequire } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { StatusSchedule } from 'src/app_func/appLookup';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { ColorStatusSchedule } from 'src/app_func/appUIStatus';
import { IUser } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;
  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;

  public StatusSchedule = StatusSchedule;
  public ColorStatusSchedule = ColorStatusSchedule;

  public user?: IUser;

  public dataForm: { RoomCode?: string } = {};

  public filter: { search?: string } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 100, active: true };
  public listData: Array<any> = [];

  public listData_Online: Array<any> = [];

  constructor(private router: Router, private loadingController: LoadingController, private toastController: ToastController) { }

  private IsOnInit?: boolean;

  ngOnInit() {
    //khởi tạo lần đầu
    this.IsOnInit = true;

    APP_AUTHENTICATE_GetAuthRequire()
      .then(e => {
        this.user = e.data;

        //
        this.refreshData();
      });
  }

  ionViewDidEnter() {
    //chào mừng quay trở lại
    if (this.IsOnInit) {
      this.IsOnInit = false;
      return;
    }

    //
    this.ngOnInit();
  }

  onIonRefresher(ev: any) {

    this.filter = {};

    //
    this.refreshData(() => {
      ev.target.complete();
    });
  }

  pushData(data: Array<any>) {
    if (this.paging.page == 1) {
      this.listData.length = 0;
    }

    this.listData = this.listData.concat(data);

    //
    this.listData_Online = this.listData.filter(f => { return [StatusSchedule.DADUYET, StatusSchedule.CONGBO].includes(f.status) })
  }

  refreshData(callback?: Function) {
    this.filter = {};
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit(callback);
  }

  private limitLoad = 0;
  async loadData_Paging_Limit(callback?: Function) {

    if (this.limitLoad > 0) {
      if (callback) callback();
      return;
    }
    else {
      this.limitLoad = 300;
    }

    let intervalLimitLoad = setInterval(() => {
      this.limitLoad -= 100;

      if (this.limitLoad <= 0) {
        clearInterval(intervalLimitLoad);

        //
        this.loadData_Paging(callback);
      }
    }, 100);
  }

  async loadData_Paging(callback?: Function) {
    RepQuanLyLapLich_danhsach({
      loadingController: this.loadingController,
      params: {
        pageNumber: this.paging.page,
        pageSize: this.paging.limit,
        dateFrom: APP_FUNC_FormatDate(new Date(), 'YYYY-MM-DD'),
        dateTo: APP_FUNC_FormatDate(new Date(), 'YYYY-MM-DD'),
        //dateTo: APP_FUNC_FormatDate(((dt) => { return new Date(dt.setDate(dt.getDate() + 1)) })(new Date()), 'YYYY-MM-DD'),
        //status: 2,
        //start: true,
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.pushData(res?.data ?? []);
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }

        //mở lại lazyload
        if (this.listData.length < this.paging.limit * this.paging.page) {
          this.paging.active = false;
        }

        //
        callback ? callback() : null;
      }
    })
  }

  //

  async navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  async changeRoomCode(ev: any) {
    this.dataForm.RoomCode = ev.detail.value?.trim();
  }

  async submitRoomCode() {
    if (!this.dataForm.RoomCode) {
      return;
    }

    RepQuanLyLapLich_chitietphonghop({
      loadingController: this.loadingController,
      params: {
        roomName: this.dataForm.RoomCode
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          if (this.user?.id) {
            this.router.navigateByUrl(APP_ROUTE.ROOM_EXTERNAL_ID.replace(':id', res.data?.id));
          }
          else {
            this.router.navigateByUrl(APP_ROUTE.ROOM_EXTERNAL_GUEST_ID.replace(':id', this.dataForm.RoomCode ?? ''));
          }
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  //
}
