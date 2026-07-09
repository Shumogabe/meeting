import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import moment from 'moment';
import { RepBieuQuyet_chonbieuquyet, RepBieuQuyet_danhsachluachonbieuquyet } from 'src/api_repository/repBieuQuyet';
import { RepDanhMucBieuQuyet_them } from 'src/api_repository/repDanhMucBieuQuyet';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-vote-add',
  templateUrl: './modal-vote-add.component.html',
  styleUrls: ['./modal-vote-add.component.scss'],
})
export class ModalVoteAddComponent implements OnInit {

  @Input() itemData?: any;

  public dataForm: { id?: any, title?: string, type?: boolean, scheduleId?: any, meetingvoted?: Array<any> } = {
    meetingvoted: [
      { id: Math.floor(Math.random() * 999999) },
      { id: Math.floor(Math.random() * 999999) },
    ],
    type: true
  };

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() { }

  modalClose() {
    this.modalController.dismiss();
  }

  modalSubmit() {
    //thêm danh mục
    RepDanhMucBieuQuyet_them({
      params: {
        scheduleId: this.itemData?.id,
        title: this.dataForm.title,
        type: this.dataForm.type,
        status: false,
        end: false,
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          var arrPromise = [] as any;

          this.dataForm.meetingvoted?.forEach(voted => {
            arrPromise.push(new Promise((resolve, reject) => {
              RepBieuQuyet_chonbieuquyet({
                params: {
                  title: voted.title,
                  voteId: res.data,
                  isCreatedByAd: 1
                },
                callback: (res2?: IOptionResponse) => {
                  if (!res2?.status) {
                    APP_COMPONENT_IonToast(this.toastController, {}, res2).then(toast => toast.present());
                  }
                  resolve(res2);
                }
              });
            }));
          });

          Promise.all(arrPromise).then(e => {
            this.modalController.dismiss(res?.data, 'success');
          });
        }
      }
    });
  }

  //

  changeTitle(ev: any) {
    this.dataForm.title = ev.detail.value?.trim();
  }

  changeType(ev: any) {
    console.log(ev.detail)
    this.dataForm.type = ev.detail.value;
  }

  changeContent(ev: any, id: any) {
    this.dataForm.meetingvoted?.filter(f => f.id == id).forEach(item => {
      item.title = ev.detail.value?.trim();
    });
  }

  //

  addContent() {
    if (!this.dataForm.meetingvoted) {
      this.dataForm.meetingvoted = [];
    }

    this.dataForm.meetingvoted.push({ id: Math.floor(Math.random() * 999999999), isnew: true });
  }

  removeContent(id: any) {
    this.dataForm.meetingvoted = this.dataForm.meetingvoted?.filter(f => f.id != id);
  }

}
