import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepQuanLyBieuQuyet_danhsachchobieuquyet, RepQuanLyBieuQuyet_danhsachdabieuquyet } from 'src/api_repository/repQuanLyBieuQuyet';
import { APP_AUTHENTICATE_GetAuth, APP_AUTHENTICATE_IsAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IOptionResponse } from 'src/app_models/Repository';
import { ModalVoteChoiceComponent } from '../modal-vote-choice/modal-vote-choice.component';
import { RepBieuQuyet_ketthuc, RepBieuQuyet_kichhoat } from 'src/api_repository/repBieuQuyet';
import { Role } from 'src/app_func/appLookup';
import { IRole, IUser } from 'src/app_models/Auth';
import { ModalVoteDetailComponent } from '../modal-vote-detail/modal-vote-detail.component';
import { APP_FUNC_RoundNumber } from 'src/app_func/appFunc';

@Component({
  selector: 'app-modal-vote-in-room',
  templateUrl: './modal-vote-in-room.component.html',
  styleUrls: ['./modal-vote-in-room.component.scss'],
})
export class ModalVoteInRoomComponent implements OnInit {

  @Input({ required: true }) id?: any;
  @Input({ required: true }) activeVote?: boolean;

  public APP_FUNC_RoundNumber = APP_FUNC_RoundNumber;

  public filter: { search?: string } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 20, active: true };
  public listData: Array<any> = [];

  public tabActive: number = 1;
  public selectedId?: any;

  public Role = Role;
  public userRoles?: Array<IRole>;

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    APP_AUTHENTICATE_GetAuth().then(user => {
      this.userRoles = user.roles;
    });

    APP_AUTHENTICATE_IsAuth().then(status => {
      if (status) {
        this.loadData();
      }
    });
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

    //
    if (this.tabActive == 2) {
      this.listData.forEach(item => {
        item.chart = {} as any;

        item.chart.title = 'Biểu đồ thống kê chọn biểu quyết';
        item.chart.xName = "category";
        item.chart.yName = "value";
        item.chart.name = "Biểu quyết";

        item.chart.dataSource = item.meetingvoted?.map((item: any) => {
          return {
            category: item.title,
            value: item.count || 0
          }
        }) ?? [];

        item.chart.total = item.chart.dataSource.reduce((accumulator: number, currentValue: any) => accumulator + currentValue.value, 0);

        if (item.type) {
          item.chart.primaryXAxis = {
            valueType: 'Category', // Đảm bảo valueType là 'Category'
            labelIntersectAction: 'Rotate45',
            title: 'Lựa chọn'
          };

          item.chart.primaryYAxis = {
            labelFormat: '{value}',
            title: 'Số lượng'
          };
        }
        else {
          item.chart.legendSettings = {
            visible: true,
            position: 'Bottom'
          };
          item.chart.tooltip = {
            enable: true
          };
          item.chart.marker = {
            dataLabel: {
              visible: true,
              position: 'Inside',
              name: 'category',
            }
          };
        }
      })
    }

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

    if (this.tabActive == 1) {
      RepQuanLyBieuQuyet_danhsachchobieuquyet({
        loadingController: this.loadingController,
        params: {
          scheduleId: this.id,
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
      });
    }
    else {
      RepQuanLyBieuQuyet_danhsachdabieuquyet({
        loadingController: this.loadingController,
        params: {
          scheduleId: this.id,
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
      });
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

  async changeTab(ev: any) {
    this.tabActive = ev.detail.value;

    //
    this.filterChange();
  }

  //

  async confirmStart(modal?: any) {
    RepBieuQuyet_kichhoat({
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
  }

  async confirmStop(modal?: any) {
    RepBieuQuyet_ketthuc({
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
  }

  //

  async presentModalVoteChoice(id: any) {
    if (!id) {
      return;
    }

    const modal = await this.modalController.create({
      component: ModalVoteChoiceComponent,
      componentProps: {
        id: id
      }
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.refreshData();
      }
    });

    modal.present();
  }

  async presentModalVoteDetail(id: any) {
    if (!id) {
      return;
    }

    const modal = await this.modalController.create({
      component: ModalVoteDetailComponent,
      componentProps: {
        id: id
      }
    });

    modal.present();
  }

}
