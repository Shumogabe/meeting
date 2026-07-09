import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepKetLuanCuocHop_chinhsua, RepKetLuanCuocHop_chitietketluan, RepKetLuanCuocHop_ketluancuochop, RepKetLuanCuocHop_taiteptinlen } from 'src/api_repository/repKetLuanCuocHop';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IOptionResponse } from 'src/app_models/Repository';
import { ModalDocumentDetailComponent } from '../modal-document-detail/modal-document-detail.component';
import { APP_FILE_SelectFile } from 'src/app_func/appFile';

@Component({
  selector: 'app-modal-conslusion-update',
  templateUrl: './modal-conslusion-update.component.html',
  styleUrls: ['./modal-conslusion-update.component.scss'],
})
export class ModalConslusionUpdateComponent implements OnInit {

  @Input({ required: true }) id?: any;

  public itemData?: any;

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.refreshData();
  }

  async refreshData() {
    RepKetLuanCuocHop_chitietketluan({
      loadingController: this.loadingController,
      params: {
        id: this.id
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.itemData = res?.data || {};
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit() {
    RepKetLuanCuocHop_chinhsua({
      params: Object.assign(this.itemData, {
        status: 1
      }),
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          this.modalController.dismiss(res?.data, 'success');
        }
      }
    });
  }

  //

  changeTitle(ev: any) {
    this.itemData.title = ev.detail.value?.trim();
  }

  changeContent(ev: any) {
    this.itemData.content = ev.detail.value?.trim();
  }

  removeDocument() {
    this.itemData.fileUrl = null;
    this.itemData.fileOriginalName = null;
    this.itemData.fileSystemName = null;
    this.itemData.fileType = null;
    this.itemData.fileSize = null;
  }

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
              this.itemData.fileUrl = fileData.fileUrl;
              this.itemData.fileOriginalName = fileData.fileName;
              this.itemData.fileSystemName = null;
              this.itemData.fileType = fileData.contentType;
              this.itemData.fileSize = fileData.fileSize;
            }
          }
          else {
            APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
          }
        }
      });

    });
  }

  //

  async presentModalDocumentDetail() {
    const modal = await this.modalController.create({
      component: ModalDocumentDetailComponent,
      componentProps: {
        fileName: this.itemData.fileOriginalName,
        fileType: this.itemData.fileType,
        fileUrl: this.itemData.fileUrl,
        scheduleId: this.itemData.id,
        mod: 'conslusion'
      }
    });
    modal.present();
  }

}
