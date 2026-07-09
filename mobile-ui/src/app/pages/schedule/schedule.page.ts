import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDatetimePickerComponent } from '@app/modals/modal-datetime-picker/modal-datetime-picker.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { APP_AUTHENTICATE_IsAuthRequire } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';
import moment from 'moment';
import { RepQuanLyLapLich_danhsach, RepQuanLyLapLich_danhsachdaxoa, RepQuanLyLapLich_khoiphuc, RepQuanLyLapLich_xoahoantoan } from 'src/api_repository/repQuanLyLapLich';
import { ColorStatusSchedule } from 'src/app_func/appUIStatus';
import { StatusSchedule } from 'src/app_func/appLookup';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  public APP_ROUTE = APP_ROUTE;
  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;

  public StatusSchedule = StatusSchedule;

  public ColorStatusSchedule = ColorStatusSchedule;
  public StatusSchedules: Array<any> = StatusSchedule._data;

  public tabActive: number = -1;
  public roomId?: any;

  public filter: { search?: string, dateFrom?: any, dateTo?: any, status?: number, start?: boolean, isdeleted?: boolean } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 20, active: true };
  public listData: Array<any> = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private loadingController: LoadingController, private toastController: ToastController, private modalController: ModalController) {
    let tab = activatedRoute.snapshot.queryParams['tab'];
    if (tab) {
      this.tabActive = parseInt(tab) || 1;
    }
  }

  private IsOnInit?: boolean;

  ngOnInit() {
    //khởi tạo lần đầu
    this.IsOnInit = true;

    (async () => {
      if (await APP_AUTHENTICATE_IsAuthRequire()) {
        this.refreshData();
      }
    })();
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

  //

  pushData(data: Array<any>) {
    if (this.paging.page == 1) {
      this.listData.length = 0;
    }

    this.listData = this.listData.concat(data);

    //
    this.listData.forEach(f => {
      f.startDate = moment(f.startTime).format('DD/MM/YYYY');
    });
    this.listData = this.listData.sort((b: any, a: any) => moment(a.startTime).diff(b.startTime))
  }

  refreshData() {
    this.filter = {};
    this.paging.page = 1;
    this.paging.active = true;

    this.loadData();
  }

  loadData(callback?: Function) {
    this.loadData_Paging_Limit(callback);
  }

  loadData_More(callback?: Function) {
    this.paging.page += 1;
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
    switch (this.tabActive) {
      //đang trực tuyến
      case -1: {
        this.filter.status = 2;
        this.filter.start = true;
        this.filter.isdeleted = false;
        break;
      }
      //đã kết thúc
      case -2: {
        this.filter.status = undefined;
        this.filter.start = false;
        this.filter.isdeleted = false;
        break;
      }
      //đã xóa
      case -3: {
        this.filter.status = undefined;
        this.filter.start = undefined;
        this.filter.isdeleted = true;
        break;
      }
      default: {
        this.filter.status = this.tabActive;
        this.filter.start = undefined;
        this.filter.isdeleted = false;
        break;
      }
    }

    RepQuanLyLapLich_danhsach({
      loadingController: this.loadingController,
      params: {
        pageNumber: this.paging.page,
        pageSize: this.paging.limit,
        search: this.filter.search,
        dateFrom: !this.filter.dateFrom ? undefined : APP_FUNC_FormatDate(this.filter.dateFrom, 'YYYY-MM-DD'),
        dateTo: !this.filter.dateTo ? undefined : APP_FUNC_FormatDate(this.filter.dateTo, 'YYYY-MM-DD'),
        status: this.filter.status,
        start: this.filter.start,
        isdeleted: this.filter.isdeleted,
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

  refresherChange(ev: any) {
    this.filter = {};
    this.paging.page = 1;
    this.paging.active = true;

    this.loadData(() => {
      ev.target.complete();
    });
  }

  infiniteChange(ev: any) {
    this.loadData_More(() => {
      ev.target.complete();
    });
  }

  searchChange(ev: any) {
    this.filter.search = ev.target.value.replace(/\s+/g, ' ').trim();
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit();
  }

  filterChange() {
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit();
  }

  //

  groupStartDate() {
    return this.listData.map(m => m.startDate).filter((value, index, array) => array.indexOf(value) == index);
  }

  filterStartDate(startDate?: string) {
    if (!startDate) {
      startDate = moment(new Date()).format('DD/MM/YYYY');
    }
    return this.listData.filter(f => f.startDate == startDate);
  }

  //

  async navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  async changeTab(ev: any) {
    this.tabActive = ev.detail.value;

    //
    this.filterChange();

    //
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { tab: this.tabActive },
        queryParamsHandling: 'merge',
        replaceUrl: true
      }
    );
  }

  //

  async confirmRestore(modal?: any) {
    RepQuanLyLapLich_khoiphuc({
      loadingController: this.loadingController,
      params: {
        id: this.roomId
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          //
          modal?.dismiss();

          //
          this.refreshData();
        }
      }
    });
  }

  async confirmDelete(modal?: any) {
    RepQuanLyLapLich_xoahoantoan({
      loadingController: this.loadingController,
      params: {
        id: this.roomId
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          //
          modal?.dismiss();

          //
          this.refreshData();
        }
      }
    });
  }

  //

  async presentModalDatetimePicker_DateFrom() {
    const modal = await this.modalController.create({
      component: ModalDatetimePickerComponent,
      componentProps: {
        options: {
          presentation: 'date',
          value: this.filter.dateFrom,
        },
      },
      cssClass: 'ion-modal-auto'
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.filter.dateFrom = e.data;
        this.filterChange();
      }
    });

    modal.present();
  }

  async presentModalDatetimePicker_DateTo() {
    const modal = await this.modalController.create({
      component: ModalDatetimePickerComponent,
      componentProps: {
        options: {
          presentation: 'date',
          value: this.filter.dateTo,
        },
      },
      cssClass: 'ion-modal-auto'
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.filter.dateTo = e.data;
        this.filterChange();
      }
    });

    modal.present();
  }

}
