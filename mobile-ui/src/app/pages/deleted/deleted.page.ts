import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDocumentDetailComponent } from '@app/modals/modal-document-detail/modal-document-detail.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepQuanLyLapLich_danhsach, RepQuanLyLapLich_danhsachdaxoa, RepQuanLyLapLich_khoiphuc, RepQuanLyLapLich_xoahoantoan } from 'src/api_repository/repQuanLyLapLich';
import { RepTaiLieuCuocHop_danhsachdaxoa, RepTaiLieuCuocHop_khoiphuc, RepTaiLieuCuocHop_xoahoantoan } from 'src/api_repository/repTaiLieuCuocHop';
import { APP_AUTHENTICATE_IsAuthRequire } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-deleted',
  templateUrl: './deleted.page.html',
  styleUrls: ['./deleted.page.scss'],
})
export class DeletedPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;

  public tabActive: number = 1;

  public filter: { search?: string, dateFrom?: any, dateTo?: any, status?: number, start?: boolean, isdeleted?: boolean } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 20, active: true };
  public listData: Array<any> = [];

  public selectedId?: any;

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
      case 1: {
        RepQuanLyLapLich_danhsach({
          loadingController: this.loadingController,
          params: {
            pageNumber: this.paging.page,
            pageSize: this.paging.limit,
            isdeleted: true
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
        break;
      }
      case 2: {
        RepTaiLieuCuocHop_danhsachdaxoa({
          loadingController: this.loadingController,
          params: {
            pageNumber: this.paging.page,
            pageSize: this.paging.limit,
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
        break;
      }
    }

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

  async detailItem(item: any) {
    switch (this.tabActive) {
      case 1: {
        this.navigateByUrl(APP_ROUTE.SCHEDULE_DETAIL_ID.replace(':id', item.id));
        break;
      }
      case 2: {
        this.presentModalDocumentDetail(item.fileOriginalName, item.fileType, item.fileUrl, item.scheduleId);
        break;
      }
    }
  }

  //

  async confirmRestore(modal?: any) {
    switch (this.tabActive) {
      case 1: {
        RepQuanLyLapLich_khoiphuc({
          loadingController: this.loadingController,
          params: {
            id: this.selectedId
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
        break;
      }
      case 2: {
        RepTaiLieuCuocHop_khoiphuc({
          loadingController: this.loadingController,
          params: {
            id: this.selectedId
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
        break;
      }
    }
  }

  async confirmDelete(modal?: any) {
    switch (this.tabActive) {
      case 1: {
        RepQuanLyLapLich_xoahoantoan({
          loadingController: this.loadingController,
          params: {
            id: this.selectedId
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
        break;
      }
      case 2: {
        RepTaiLieuCuocHop_xoahoantoan({
          loadingController: this.loadingController,
          params: {
            id: this.selectedId
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
        break;
      }
    }
  }

  async presentModalDocumentDetail(fileName: string, fileType: string, fileUrl: string, scheduleId: string) {
    const modal = await this.modalController.create({
      component: ModalDocumentDetailComponent,
      componentProps: {
        fileName: fileName,
        fileType: fileType,
        fileUrl: fileUrl,
        scheduleId: scheduleId,
        mod: 'document'
      }
    });
    modal.present();
  }

}
