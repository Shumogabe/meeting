import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepKetLuanCuocHop_taiteptinlen, RepKetLuanCuocHop_them } from 'src/api_repository/repKetLuanCuocHop';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IOptionResponse } from 'src/app_models/Repository';
import { ModalDocumentDetailComponent } from '../modal-document-detail/modal-document-detail.component';
import { APP_FILE_SelectFile } from 'src/app_func/appFile';

@Component({
  selector: 'app-modal-conslusion-add',
  templateUrl: './modal-conslusion-add.component.html',
  styleUrls: ['./modal-conslusion-add.component.scss'],
})
export class ModalConslusionAddComponent implements OnInit {

  @Input() scheduleId?: any;

  public dataForm: any = {};

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() { }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit() {
    RepKetLuanCuocHop_them({
      params: Object.assign(this.dataForm, {
        scheduleId: this.scheduleId,
        status: false
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
    this.dataForm.title = ev.detail.value?.trim();
  }

  changeContent(ev: any) {
    this.dataForm.content = ev.detail.value?.trim();
  }

  removeDocument() {
    this.dataForm.fileUrl = null;
    this.dataForm.fileOriginalName = null;
    this.dataForm.fileSystemName = null;
    this.dataForm.fileType = null;
    this.dataForm.fileSize = null;
  }

  addDocument() {
    APP_FILE_SelectFile({ accept: '.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf' }, (files: Array<File>) => {

      let file = files[0];

      //tai len
      RepKetLuanCuocHop_taiteptinlen({
        loadingController: this.loadingController,
        params: {
          scheduleId: this.dataForm.id,
          file: file
        },
        callback: (res?: IOptionResponse) => {
          if (res?.status) {
            var fileData = res.data;
            if (fileData) {
              this.dataForm.fileUrl = fileData.fileUrl;
              this.dataForm.fileOriginalName = fileData.fileName;
              this.dataForm.fileSystemName = null;
              this.dataForm.fileType = fileData.contentType;
              this.dataForm.fileSize = fileData.fileSize;
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
        fileName: this.dataForm.fileOriginalName,
        fileType: this.dataForm.fileType,
        fileUrl: this.dataForm.fileUrl,
        scheduleId: this.dataForm.id,
        mod: 'conslusion'
      }
    });
    modal.present();
  }

}
