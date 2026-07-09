import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepBieuQuyet_chonbieuquyet } from 'src/api_repository/repBieuQuyet';
import { RepDanhMucBieuQuyet_xemchitiet } from 'src/api_repository/repDanhMucBieuQuyet';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-vote-choice',
  templateUrl: './modal-vote-choice.component.html',
  styleUrls: ['./modal-vote-choice.component.scss'],
})
export class ModalVoteChoiceComponent implements OnInit {

  @Input() id?: any;

  public itemData?: { id?: any, title?: string, type?: boolean, meetingvoted?: Array<{ id?: any, title?: string, selected?: boolean }> } = {};

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.refreshData();
  }

  async refreshData() {
    RepDanhMucBieuQuyet_xemchitiet({
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

    let meetingvoteds = this.itemData?.meetingvoted?.filter(f => f.selected);
    if (!meetingvoteds?.length) {
      APP_COMPONENT_IonToast(this.toastController, { color: 'warning', message: 'Vui lòng lựa chọn trước khi xác nhận.' }).then(toast => toast.present());
      return;
    }

    let arrPromise = [] as Array<any>;

    meetingvoteds.forEach(item => {
      arrPromise.push(new Promise((resolve, reject) => {
        RepBieuQuyet_chonbieuquyet({
          params: {
            title: item.title,
            voteId: this.itemData?.id,
            isCreatedByAd: 0
          },
          callback: (res?: IOptionResponse) => {
            if (!res?.status) {
              APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
            }
            resolve(res);
          }
        });
      }))
    });

    Promise.all(arrPromise).then(e => {
      APP_COMPONENT_IonToast(this.toastController, { color: 'success', message: 'Biểu quyết thành công' }).then(toast => toast.present());
      this.modalController.dismiss(null, 'success');
    });
  }

  //

  async selectMutiVoted(ev: any, item: any) {
    item.selected = ev.detail.checked;
  }

  async selectOneVoted(ev: any) {
    //remove all select
    this.itemData?.meetingvoted?.forEach(f => {
      f.selected = false;
    });
    //select one
    this.itemData?.meetingvoted?.filter(f => f.id == ev.detail.value).forEach(f => {
      f.selected = true;
    });
  }
}
