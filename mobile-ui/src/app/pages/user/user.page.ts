import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSSO } from 'capacitor-hybrid-vnptid';
import { RepAuth_Clear } from 'src/api_repository/repAuth';
import { RepLocalStorage_ClearSetting } from 'src/api_repository/repLocalStorage';
import { APP_AUTHENTICATE_GetAuthRequire } from 'src/app_func/appAuthenticate';
import { APP_FUNC_FormatMobileNumber } from 'src/app_func/appFunc';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IUser } from 'src/app_models/Auth';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;
  public APP_FUNC_FormatMobileNumber = APP_FUNC_FormatMobileNumber;

  public user?: IUser;

  constructor(private router: Router) {
    APP_AUTHENTICATE_GetAuthRequire()
      .then(e => {
        this.user = e.data;
      })
  }

  ngOnInit() {
  }

  async navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
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

    //
    AuthSSO.signOut();

    //
    modal?.dismiss();
  }

}
