import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepKetLuanCuocHop_laytep } from 'src/api_repository/repKetLuanCuocHop';
import { RepTaiLieuCuocHop_laytep } from 'src/api_repository/repTaiLieuCuocHop';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FILE_Download } from 'src/app_func/appFile';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-document-detail',
  templateUrl: './modal-document-detail.component.html',
  styleUrls: ['./modal-document-detail.component.scss'],
})
export class ModalDocumentDetailComponent implements OnInit {

  @Input({ required: true }) fileName?: any;
  @Input({ required: true }) fileType?: any;
  @Input({ required: true }) scheduleId?: any;
  @Input({ required: true }) mod?: 'document' | 'conslusion';

  public itemData?: any;
  public iframeUrl?: string;

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    let fileUrl;

    switch (this.mod) {
      case 'document': {
        fileUrl = environment.api_url + 'TaiLieuCuocHop/laytep' + '?' + new URLSearchParams({
          "scheduleId": this.scheduleId,
          "fileName": this.fileName,
          "fileType": this.fileType,
        });
        break;
      }
      case 'conslusion': {
        fileUrl = environment.api_url + 'KetLuanCuocHop/laytep' + '?' + new URLSearchParams({
          "scheduleId": this.scheduleId,
          "fileName": this.fileName,
          "fileType": this.fileType,
        });
        break;
      }
    }

    if (fileUrl) {
      let extension = this.fileName?.split('.')?.pop();
      switch (extension) {
        case 'doc':
        case 'docx':
        case 'xls':
        case 'xlsx':
        case 'ppt':
        case 'pptx': {
          //this.iframeUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(fileUrl);
          this.iframeUrl = 'assets/lib/ONLYOFFICE/player.html?url=' + encodeURIComponent(fileUrl) + '&ext=' + extension;
          break;
        }
        case 'pdf': {
          this.iframeUrl = 'assets/lib/PDFReader/web/viewer.html?file=' + encodeURIComponent(fileUrl);
          //this.iframeUrl = 'assets/lib/ONLYOFFICE/player.html?url=' + encodeURIComponent(fileUrl) + '&ext=' + extension;
          break;
        }
        case 'txt': {
          this.iframeUrl = fileUrl;
          break;
        }
      }
    }
  }

  async downloadDocument() {
    switch (this.mod) {
      case 'document': {
        RepTaiLieuCuocHop_laytep({
          loadingController: this.loadingController,
          params: {
            scheduleId: this.scheduleId,
            fileName: this.fileName,
            fileType: this.fileType,
          },
          callback: (res?: IOptionResponse) => {

            if (res?.status) {
              APP_FILE_Download(res.data, { toastController: this.toastController });
            }
            else {
              APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
            }

            this.modalClose();

          }
        });
        break;
      }
      case 'conslusion': {
        RepKetLuanCuocHop_laytep({
          loadingController: this.loadingController,
          params: {
            scheduleId: this.scheduleId,
            fileName: this.fileName,
            fileType: this.fileType,
          },
          callback: (res?: IOptionResponse) => {

            if (res?.status) {
              APP_FILE_Download(res.data, { toastController: this.toastController });
            }
            else {
              APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
            }

            this.modalClose();

          }
        });
        break;
      }
    }
  }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit() {

  }
}
