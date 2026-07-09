import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, LoadingController, ToastController } from '@ionic/angular';
import { RepAuth_Clear } from 'src/api_repository/repAuth';
import { RepLocalStorage_ClearSetting } from 'src/api_repository/repLocalStorage';
import { RepQuanLyLapLich_chitietphonghop } from 'src/api_repository/repQuanLyLapLich';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_FUNC_FormatDate } from 'src/app_func/appFunc';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IUser } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-room-join',
  templateUrl: './room-join.page.html',
  styleUrls: ['./room-join.page.scss'],
})
export class RoomJoinPage implements OnInit {

  @ViewChild('inputRoomCode') inputRoomCode?: IonInput;

  public APP_ROUTE = APP_ROUTE;
  public APP_FUNC_FormatDate = APP_FUNC_FormatDate;

  public user?: IUser;

  public dataForm: { RoomCode?: string } = {};

  constructor(private router: Router, private loadingController: LoadingController, private toastController: ToastController) { }

  ngOnInit() {
    (async () => {

      //lấy thông tin tài khoản nếu có
      this.user = (await APP_AUTHENTICATE_GetAuth()).data;

    })()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputRoomCode?.setFocus();
    }, 300);
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url)
  }

  async signOut(modal?: any) {

    //xóa dữ liệu lưu trên ứng dụng
    await RepLocalStorage_ClearSetting();

    //xóa thông tin tài khoản đã đăng nhập
    RepAuth_Clear({
      callback: () => {

        //chuyển màn hình về trang chủ (trang chủ vẫn có thông tin mà không cần đăng nhập tài khoản)
        this.router.navigateByUrl(APP_ROUTE.HOME, { replaceUrl: true });
      }
    });

    modal?.dismiss();
  }

  async changeRoomCode(ev: any) {
    this.dataForm.RoomCode = ev.detail.value?.trim();
  }

  async submitRoomCode() {
    if (!this.dataForm.RoomCode) {
      return;
    }

    RepQuanLyLapLich_chitietphonghop({
      loadingController: this.loadingController,
      params: {
        roomName: this.dataForm.RoomCode
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          if (this.user?.id) {
            this.router.navigateByUrl(APP_ROUTE.ROOM_EXTERNAL_ID.replace(':id', res.data?.id));
          }
          else {
            this.router.navigateByUrl(APP_ROUTE.ROOM_EXTERNAL_GUEST_ID.replace(':id', this.dataForm.RoomCode ?? ''));
          }
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

}
