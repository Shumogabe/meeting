import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepCauHinhCuocHop_chinhsua, RepCauHinhCuocHop_them } from 'src/api_repository/repCauHinhCuocHop';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-option-add',
  templateUrl: './modal-option-add.component.html',
  styleUrls: ['./modal-option-add.component.scss'],
})
export class ModalOptionAddComponent implements OnInit {

  @Input() itemData: { id?: string, label_vn?: string, label_en?: string, value?: string, status?: boolean } = {};

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() { }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit() {
    if (this.itemData.id) {
      RepCauHinhCuocHop_chinhsua({
        params: this.itemData,
        callback: (res?: IOptionResponse) => {

          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

          if (res?.status) {
            this.modalController.dismiss(res?.data, 'success');
          }
        }
      });
    }
    else {
      RepCauHinhCuocHop_them({
        params: this.itemData,
        callback: (res?: IOptionResponse) => {

          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

          if (res?.status) {
            this.modalController.dismiss(res?.data, 'success');
          }
        }
      });
    }
  }

  //

  changeLabelVN(ev: any) {
    this.itemData.label_vn = ev.detail.value?.trim();
  }

  changeLabelEN(ev: any) {
    this.itemData.label_en = ev.detail.value?.trim();
  }

  changeValue(ev: any) {
    this.itemData.value = ev.detail.value?.trim();
  }

  changeStatus(ev: any) {
    this.itemData.status = ev.detail.checked;
  }

}
