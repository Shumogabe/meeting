import { Component, Input, OnInit } from '@angular/core';
import { ModalConslusionAddComponent } from '@app/modals/modal-conslusion-add/modal-conslusion-add.component';
import { ModalConslusionUpdateComponent } from '@app/modals/modal-conslusion-update/modal-conslusion-update.component';
import { ModalDocumentDetailComponent } from '@app/modals/modal-document-detail/modal-document-detail.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepKetLuanCuocHop_chitietketluan, RepKetLuanCuocHop_huyxacnhan, RepKetLuanCuocHop_ketluancuochop, RepKetLuanCuocHop_taiteptinlen, RepKetLuanCuocHop_them, RepKetLuanCuocHop_xacnhan, RepKetLuanCuocHop_xoa } from 'src/api_repository/repKetLuanCuocHop';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FILE_SelectFile } from 'src/app_func/appFile';
import { Role, StatusConslusion, StatusSchedule } from 'src/app_func/appLookup';
import { ColorStatusConslusion } from 'src/app_func/appUIStatus';
import { IRole } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-schedule-conslusion',
  templateUrl: './schedule-conslusion.component.html',
  styleUrls: ['./schedule-conslusion.component.scss'],
})
export class ScheduleConslusionComponent implements OnInit {

  @Input({ required: true }) itemData: any;
  @Input({ required: true }) listData: Array<any> = [];

  public StatusConslusion = StatusConslusion;
  public ColorStatusConslusion = ColorStatusConslusion;

  public selectedId: any;

  public Role = Role;
  public userRoles?: Array<IRole>;

  public isAddEdit?: boolean;
  public isEnd?: boolean;

  constructor(private modalController: ModalController, private toastController: ToastController, private loadingController: LoadingController) { }

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
    RepKetLuanCuocHop_ketluancuochop({
      loadingController: this.loadingController,
      params: {
        id: this.itemData.id,
        pageNumber: 1,
        pageSize: 10,
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.listData = res?.data || [];

          this.listData.forEach(item => {
            item.content = item.content?.replace(/\n/g, '<br/>');
          })
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  async presentModalConslusionAdd() {
    const modal = await this.modalController.create({
      component: ModalConslusionAddComponent,
      componentProps: {
        scheduleId: this.itemData.id
      }
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.refreshData();
      }
    });

    modal.present();
  }

  async presentModalConslusionUpdate(id: any) {
    const modal = await this.modalController.create({
      component: ModalConslusionUpdateComponent,
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

  //

  addDocument() {
    APP_FILE_SelectFile({ accept: '.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf' }, (files: Array<File>) => {

      let file = files[0];

      //tai len
      RepKetLuanCuocHop_taiteptinlen({
        loadingController: this.loadingController,
        params: {
          scheduleId: this.itemData.id,
          file: file
        },
        callback: (res?: IOptionResponse) => {
          if (res?.status) {

            var fileData = res.data;
            if (fileData) {
              RepKetLuanCuocHop_them({
                params: {
                  scheduleId: this.itemData.id,
                  title: `Tài liệu kết luận cuộc họp (#${Math.floor(Math.random() * 999999)})`,

                  fileUrl: fileData.fileUrl,
                  fileOriginalName: fileData.fileName,
                  fileType: fileData.contentType,
                  fileSize: fileData.fileSize,
                },
                callback: (res2?: IOptionResponse) => {

                  APP_COMPONENT_IonToast(this.toastController, {}, res2).then(toast => toast.present());

                  if (res2?.status) {
                    this.refreshData();
                  }
                }
              });
            }
          }
          else {
            APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
          }
        }
      });

    });
  }

  async confirmConslusionOk(id: any) {
    RepKetLuanCuocHop_xacnhan({
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

  async confirmConslusionCancel(id: any) {
    RepKetLuanCuocHop_huyxacnhan({
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
    RepKetLuanCuocHop_xoa({
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
        mod: 'conslusion'
      }
    });
    modal.present();
  }

}
