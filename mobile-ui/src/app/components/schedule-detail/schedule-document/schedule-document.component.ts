import { Component, Input, OnInit } from '@angular/core';
import { ModalDocumentDetailComponent } from '@app/modals/modal-document-detail/modal-document-detail.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepTaiLieuCuocHop_huyxacnhan, RepTaiLieuCuocHop_tailieucuochop, RepTaiLieuCuocHop_taiteptinlen, RepTaiLieuCuocHop_xacnhan, RepTaiLieuCuocHop_xoa } from 'src/api_repository/repTaiLieuCuocHop';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FILE_SelectFile } from 'src/app_func/appFile';
import { Role, StatusSchedule } from 'src/app_func/appLookup';
import { ColorStatusDocument } from 'src/app_func/appUIStatus';
import { IRole } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-schedule-document',
  templateUrl: './schedule-document.component.html',
  styleUrls: ['./schedule-document.component.scss'],
})
export class ScheduleDocumentComponent implements OnInit {

  @Input({ required: true }) itemData: any;
  @Input({ required: true }) listData: Array<any> = [];

  public ColorStatusDocument = ColorStatusDocument;

  public selectedId: any;

  public Role = Role;
  public userRoles?: Array<IRole>;

  public isAddEdit?: boolean;
  public isEnd?: boolean;

  constructor(private toastController: ToastController, private loadingController: LoadingController, private modalController: ModalController) { }

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

    this.refreshData();
  }

  async refreshData() {
    RepTaiLieuCuocHop_tailieucuochop({
      loadingController: this.loadingController,
      params: {
        id: this.itemData.id
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.listData = res?.data || [];
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  addDocument() {
    APP_FILE_SelectFile({ accept: '.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.rar,.zip' }, (files: Array<File>) => {

      let file = files[0];

      //tai len
      RepTaiLieuCuocHop_taiteptinlen({
        loadingController: this.loadingController,
        params: {
          scheduleId: this.itemData.id,
          files: file
        },
        callback: (res?: IOptionResponse) => {

          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

          if (res?.status) {
            this.refreshData();
          }

        }
      });

    });
  }

  //

  async confirmDocumentOk(id: any) {
    RepTaiLieuCuocHop_xacnhan({
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

  async confirmDocumentCancel(id: any) {
    RepTaiLieuCuocHop_huyxacnhan({
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
    RepTaiLieuCuocHop_xoa({
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

  async presentModalDocumentDetail(fileName: string, fileType: string, fileUrl: string) {
    const modal = await this.modalController.create({
      component: ModalDocumentDetailComponent,
      componentProps: {
        fileName: fileName,
        fileType: fileType,
        fileUrl: fileUrl,
        scheduleId: this.itemData.id,
        mod: 'document'
      }
    });
    modal.present();
  }

}
