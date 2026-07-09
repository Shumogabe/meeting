import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalScheduleUpdateComponent } from '@app/modals/modal-schedule-update/modal-schedule-update.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_CopyToClipboard, APP_FUNC_FormatDate, APP_FUNC_FormatRoomNumber } from 'src/app_func/appFunc';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';
import { RepQuanLyLapLich_thongtin, RepQuanLyLapLich_xoa } from 'src/api_repository/repQuanLyLapLich';
import { Role } from 'src/app_func/appLookup';
import { IRole, IUser } from 'src/app_models/Auth';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.page.html',
  styleUrls: ['./schedule-detail.page.scss'],
})
export class ScheduleDetailPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;
  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;
  public APP_FUNC_FormatRoomNumber = APP_FUNC_FormatRoomNumber;

  public isShowPwd?: boolean;
  public isCopied?: boolean;

  private roomId?: any;
  public itemData?: any;

  public tabActive?: string = 'info';

  public Role = Role;
  public userData?: IUser;
  public userRoles?: Array<IRole>;

  public isAddEdit?: boolean;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalController: ModalController, private toastController: ToastController, private loadingController: LoadingController) {
    let tab = activatedRoute.snapshot.queryParams['tab'];
    if (tab) {
      this.tabActive = tab;
    }

    let id = activatedRoute.snapshot.params['id'];
    if (id) {
      this.roomId = id;
      this.refreshData();
    }
  }

  ngOnInit() {
    APP_AUTHENTICATE_GetAuth().then(user => {
      this.userData = user.data;
      this.userRoles = user.roles;
    });
  }

  refreshData(callback?: Function) {
    RepQuanLyLapLich_thongtin({
      loadingController: this.loadingController,
      params: {
        id: this.roomId
      },
      callback: (res?: IOptionResponse) => {
        this.itemData = res?.data;

        //
        this.isAddEdit = this.itemData?.userCreatedBy?.id == this.userData?.id
          || this.itemData?.userChairMan?.id == this.userData?.id
          || this.itemData?.userShareRole?.id == this.userData?.id;

        if (callback) callback();
      }
    });
  }

  //

  async changeTab(ev: any) {
    this.tabActive = ev.detail.value;

    //
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { tab: this.tabActive },
        queryParamsHandling: 'merge',
        replaceUrl: true
      }
    );
  }

  //

  async navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  async changeIsPwd(flag: boolean) {
    this.isShowPwd = flag;
  }

  async copyRoomCode(data: string) {
    this.isCopied = APP_FUNC_CopyToClipboard(data);
  }

  //

  async confirmDelete(modal?: any) {
    RepQuanLyLapLich_xoa({
      loadingController: this.loadingController,
      params: {
        id: this.roomId
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          //
          modal?.dismiss();

          //
          this.router.navigateByUrl(APP_ROUTE.SCHEDULE, { replaceUrl: true });
        }
      }
    });
  }

  //

  async presentModalScheduleUpdate() {
    const modal = await this.modalController.create({
      component: ModalScheduleUpdateComponent,
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
  };

}
