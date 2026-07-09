import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDatetimePickerComponent } from '@app/modals/modal-datetime-picker/modal-datetime-picker.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepTaiLieuCuocHop_danhsachphonghop } from 'src/api_repository/repTaiLieuCuocHop';
import { APP_AUTHENTICATE_IsAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-document-room',
  templateUrl: './document-room.page.html',
  styleUrls: ['./document-room.page.scss'],
})
export class DocumentRoomPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;
  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;

  public filter: { search?: string, dateFrom?: any, dateTo?: any } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 20, active: true };
  public listData: Array<any> = [];

  public tabActive: number = 1;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) {
    let tab = activatedRoute.snapshot.queryParams['tab'];
    if (tab) {
      this.tabActive = parseInt(tab) || 1;
    }
  }

  ngOnInit() {
    (async () => {
      if (await APP_AUTHENTICATE_IsAuth()) {
        this.loadData();
      }
    })();
  }

  //

  pushData(data: Array<any>) {
    if (this.paging.page == 1) {
      this.listData.length = 0;
    }

    this.listData = this.listData.concat(data);

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

    //
    RepTaiLieuCuocHop_danhsachphonghop({
      loadingController: this.loadingController,
      params: {
        pageNumber: this.paging.page,
        pageSize: this.paging.limit,
        dateFrom: !this.filter.dateFrom ? undefined : APP_FUNC_FormatDate(this.filter.dateFrom, 'YYYY-MM-DD'),
        dateTo: !this.filter.dateTo ? undefined : APP_FUNC_FormatDate(this.filter.dateTo, 'YYYY-MM-DD'),
        search: this.filter.search,
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.pushData(res?.data || []);
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

  navigateByUrl(url: string) {
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
