import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import moment from 'moment';
import { RepBieuQuyet_chinhsua, RepBieuQuyet_chonbieuquyet, RepBieuQuyet_xoa } from 'src/api_repository/repBieuQuyet';
import { RepDanhMucBieuQuyet_chinhsua, RepDanhMucBieuQuyet_them, RepDanhMucBieuQuyet_xemchitiet } from 'src/api_repository/repDanhMucBieuQuyet';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-modal-vote-update',
  templateUrl: './modal-vote-update.component.html',
  styleUrls: ['./modal-vote-update.component.scss'],
})
export class ModalVoteUpdateComponent implements OnInit {

  @Input() id?: any;

  public dataForm: { id?: any, title?: string, type?: boolean, scheduleId?: any, meetingvoted?: Array<any> } = {};

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
          this.dataForm = res?.data || {};
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
    RepDanhMucBieuQuyet_chinhsua({
      params: {
        id: this.dataForm.id,
        scheduleId: this.dataForm.scheduleId,
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
            //them moi noi dung chon
            if (voted.isnew) {
              arrPromise.push(new Promise((resolve, reject) => {
                RepBieuQuyet_chonbieuquyet({
                  params: {
                    title: voted.title,
                    voteId: this.dataForm.id,
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
            }
            //xoa noi dung chon
            else if (voted.isdelete) {
              arrPromise.push(new Promise((resolve, reject) => {
                RepBieuQuyet_xoa({
                  params: {
                    id: voted.id,
                  },
                  callback: (res2?: IOptionResponse) => {
                    if (!res2?.status) {
                      APP_COMPONENT_IonToast(this.toastController, {}, res2).then(toast => toast.present());
                    }
                    resolve(res2);
                  }
                });
              }));
            }
            //cap nhat noi dung chon
            else {
              arrPromise.push(new Promise((resolve, reject) => {
                RepBieuQuyet_chinhsua({
                  params: {
                    id: voted.id,
                    title: voted.title,
                    voteId: voted.voteId,
                  },
                  callback: (res2?: IOptionResponse) => {
                    if (!res2?.status) {
                      APP_COMPONENT_IonToast(this.toastController, {}, res2).then(toast => toast.present());
                    }
                    resolve(res2);
                  }
                });
              }));
            }
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

  get dataMeetingvoted() {
    return (this.dataForm.meetingvoted ?? []).filter(f => !f.isdelete);
  }

  addContent() {
    if (!this.dataForm.meetingvoted) {
      this.dataForm.meetingvoted = [];
    }

    //đánh dấu thêm mới -> isnew = true
    this.dataForm.meetingvoted.push({ id: Math.floor(Math.random() * 999999999), isnew: true });
  }

  removeContent(id: any) {
    let item = this.dataForm.meetingvoted?.find(f => f.id == id);
    if (item) {
      //cái đang thêm mới thì xóa luôn được
      if (item.isnew) {
        this.dataForm.meetingvoted = this.dataForm.meetingvoted?.filter(f => f.id != id);
      }
      //cái cũ thì đánh dấu xóa -> isdelete = true
      else {
        item.isdelete = true;
      }
    }
  }

}
