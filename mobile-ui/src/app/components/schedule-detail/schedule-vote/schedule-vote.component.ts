import { Component, Input, OnInit } from '@angular/core';
import { ModalVoteAddComponent } from '@app/modals/modal-vote-add/modal-vote-add.component';
import { ModalVoteDetailComponent } from '@app/modals/modal-vote-detail/modal-vote-detail.component';
import { ModalVoteUpdateComponent } from '@app/modals/modal-vote-update/modal-vote-update.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepDanhMucBieuQuyet_danhsach, RepDanhMucBieuQuyet_huyxacnhan, RepDanhMucBieuQuyet_xacnhan, RepDanhMucBieuQuyet_xoa } from 'src/api_repository/repDanhMucBieuQuyet';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { Role, StatusSchedule } from 'src/app_func/appLookup';
import { ColorStatusVote } from 'src/app_func/appUIStatus';
import { IRole } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-schedule-vote',
  templateUrl: './schedule-vote.component.html',
  styleUrls: ['./schedule-vote.component.scss'],
})
export class ScheduleVoteComponent implements OnInit {

  @Input({ required: true }) itemData: any;
  @Input({ required: true }) listData: Array<any> = [];

  public ColorStatusVote = ColorStatusVote;

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
    RepDanhMucBieuQuyet_danhsach({
      loadingController: this.loadingController,
      params: {
        id: this.itemData.id
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.listData = res?.data || [];

          // this.listData.forEach(item => {
          //   item.meetingvoted = [
          //     {title: 'Đồng ý'},
          //     {title: 'Tán thành'},
          //     {title: 'Không có ý kiến'},
          //   ]
          // })
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  //

  async confirmVoteOk(id: any) {
    RepDanhMucBieuQuyet_xacnhan({
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

  async confirmVoteCancel(id: any) {
    RepDanhMucBieuQuyet_huyxacnhan({
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
    RepDanhMucBieuQuyet_xoa({
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

  async presentModalVoteAdd() {
    const modal = await this.modalController.create({
      component: ModalVoteAddComponent,
      componentProps: {
        itemData: this.itemData
      }
    });

    modal.onDidDismiss().then(e => {
      if (e.role == 'success') {
        this.refreshData();
      }
    });

    modal.present();
  }

  async presentModalVoteUpdate(id: any) {
    if (!id) {
      return;
    }

    const modal = await this.modalController.create({
      component: ModalVoteUpdateComponent,
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

  async presentModalVoteDetail(id: any) {
    if (!id) {
      return;
    }

    const modal = await this.modalController.create({
      component: ModalVoteDetailComponent,
      componentProps: {
        id: id
      }
    });

    modal.present();
  }
}
