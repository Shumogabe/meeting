import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalOptionAddComponent } from '@app/modals/modal-option-add/modal-option-add.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepCauHinhCuocHop_danhsach } from 'src/api_repository/repCauHinhCuocHop';
import { APP_AUTHENTICATE_IsAuthRequire } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;

  public filter: { search?: string } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 20, active: true };
  public listData: Array<any> = [];

  constructor(private router: Router, private loadingController: LoadingController, private toastController: ToastController, private modalController: ModalController) { }

  ngOnInit() {
    (async () => {
      if (await APP_AUTHENTICATE_IsAuthRequire()) {
        this.refreshData();
      }
    })();
  }

  onIonRefresher(ev: any) {

    this.filter = {};

    //
    this.refreshData(() => {
      ev.target.complete();
    });
  }

  onIonInfinite(ev: any) {
    this.loadMore(() => {
      ev.target.complete();
    });
  }

  pushData(data: Array<any>) {
    if (this.paging.page == 1) {
      this.listData.length = 0;
    }

    this.listData = this.listData.concat(data);

  }

  refreshData(callback?: Function) {
    this.filter = {};
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit(callback);
  }

  loadMore(callback?: Function) {
    this.paging.page += 1;
    this.loadData_Paging_Limit(callback);
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
    RepCauHinhCuocHop_danhsach({
      loadingController: this.loadingController,
      params: {
        pageNumber: this.paging.page,
        pageSize: this.paging.limit,
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

  async navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  //

  async presentModalOptionAdd(item?: any) {
    const modal = await this.modalController.create({
      component: ModalOptionAddComponent,
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.refreshData();
      }
    });

    modal.present();
  }

}
