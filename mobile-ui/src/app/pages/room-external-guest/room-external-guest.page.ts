import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepQuanLyLapLich_chitietphonghop } from 'src/api_repository/repQuanLyLapLich';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_Camera_CheckPermissions, APP_Microphone_CheckPermissions } from 'src/app_func/appDevicePermission';
import { IUser } from 'src/app_models/Auth';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-room-external-guest',
  templateUrl: './room-external-guest.page.html',
  styleUrls: ['./room-external-guest.page.scss'],
})
export class RoomExternalGuestPage implements OnInit {

  @ViewChild('inputRoomPwd') inputRoomPwd?: IonInput;

  public user?: IUser;
  public userData?: any;

  private roomName?: string;
  public roomData?: { title?: string, password?: string, confirm_password?: string };

  public isAccepted?: boolean;    //du dieu kien tham gia
  public isPassedPwd?: boolean;   //kiem tra mat khau phong hop
  public isPassedAuth?: boolean;  //kiem tra thong tin tai khoan tham gia

  constructor(activatedRoute: ActivatedRoute, private router: Router, private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) {
    let id = activatedRoute.snapshot.params['id'];
    if (id) {
      this.roomName = id;

      //chuyển hướng qua native nếu là ứng dụng IOS
      // if (Capacitor.getPlatform() == 'ios') {
      //   this.router.navigateByUrl(APP_ROUTE.ROOM_ID.replace(':id', id), { replaceUrl: true });
      // }
    }
  }

  ngOnInit() {
    (async () => {

      //lấy thông tin tài khoản nếu có
      this.user = (await APP_AUTHENTICATE_GetAuth()).data;
      this.userData = {
        name: this.user?.name,
        email: this.user?.email,
      };

      //kiểm tra quyền truy cập thiết bị
      await APP_Camera_CheckPermissions();
      await APP_Microphone_CheckPermissions();

      //lấy thông tin dữ liệu
      this.refreshData();

    })()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputRoomPwd?.setFocus();
    }, 300);
  }

  async refreshData() {
    RepQuanLyLapLich_chitietphonghop({
      loadingController: this.loadingController,
      params: {
        roomName: this.roomName
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.roomData = res?.data;

          //check du lieu de thay doi trang thai cho phep truy cap phong hop
          this.checkAccepted();
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  //

  checkAccepted() {
    //check thong tin nguoi dung truy cap
    if (this.userData.name && this.userData.email) {
      this.isPassedAuth = true;
    }
    else {
      this.isPassedAuth = false;
    }

    //check thong tin truy cap phong hop
    if (!this.roomData?.password || this.roomData?.password == this.roomData?.confirm_password) {
      this.isPassedPwd = true;
    }
    else {
      this.isPassedPwd = false;

      if (this.roomData?.confirm_password) {
        APP_COMPONENT_IonToast(this.toastController, { color: 'warning', message: 'Mật khẩu truy cập không đúng' }).then(toast => toast.present());
      }
    }

    //du dieu kien tham gia phong hop
    this.isAccepted = this.isPassedAuth && this.isPassedPwd;
  }

  //

  async changeRoomPwd(ev: any) {
    if (this.roomData) {
      this.roomData.confirm_password = ev.detail.value;
    }
  }

  async changeUserName(ev: any) {
    this.userData.name = ev.detail.value?.trim();
  }

  async changeUserEmail(ev: any) {
    this.userData.email = ev.detail.value?.trim();
  }

}
