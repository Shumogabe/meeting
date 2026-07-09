import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepQuanLyLapLich_thongtinnguoidung } from 'src/api_repository/repQuanLyLapLich';
import { APP_AUTHENTICATE_IsAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IUser } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-user-search',
  templateUrl: './modal-user-search.component.html',
  styleUrls: ['./modal-user-search.component.scss'],
})
export class ModalUserSearchComponent implements OnInit {

  public filter: { search?: string } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 20, active: true };
  public listData: Array<any> = [];

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    (async () => {
      if (await APP_AUTHENTICATE_IsAuth()) {
        this.loadData();
      }
    })();
  }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit(item: any) {
    this.modalController.dismiss(item, 'success');
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
    RepQuanLyLapLich_thongtinnguoidung({
      loadingController: this.loadingController,
      params: {
        pageNumber: this.paging.page,
        pageSize: this.paging.limit,
        search: this.filter.search
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

}
