import { Component, Input, OnInit } from '@angular/core';
import { ModalDocumentDetailComponent } from '@app/modals/modal-document-detail/modal-document-detail.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepTaiLieuCuocHop_danhmucxacnhan, RepTaiLieuCuocHop_laytep } from 'src/api_repository/repTaiLieuCuocHop';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FILE_Download } from 'src/app_func/appFile';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-document-in-room',
  templateUrl: './modal-document-in-room.component.html',
  styleUrls: ['./modal-document-in-room.component.scss'],
})
export class ModalDocumentInRoomComponent implements OnInit {

  @Input({ required: true }) scheduleId?: any;

  public filter: { search?: string } = {};
  public paging = { sortfield: null, sorttype: null, page: 1, limit: 20, active: true };
  public listData: Array<any> = [];

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.loadData();
  }

  modalClose() {
    this.modalController.dismiss();
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
    RepTaiLieuCuocHop_danhmucxacnhan({
      loadingController: this.loadingController,
      params: {
        pageNumber: this.paging.page,
        pageSize: this.paging.limit,
        scheduleId: this.scheduleId,
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

  async downloadDocument(item: any) {
    RepTaiLieuCuocHop_laytep({
      loadingController: this.loadingController,
      params: {
        scheduleId: this.scheduleId,
        fileName: item.fileOriginalName,
        fileType: item.fileType,
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          APP_FILE_Download(res.data, { toastController: this.toastController });
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  async presentModalDocumentDetail(fileName: string, fileType: string, fileUrl: string) {
    const modal = await this.modalController.create({
      component: ModalDocumentDetailComponent,
      componentProps: {
        fileName: fileName,
        fileType: fileType,
        fileUrl: fileUrl,
        scheduleId: this.scheduleId,
        mod: 'document'
      }
    });
    modal.present();
  }

}
