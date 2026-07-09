import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { LoadingController, ToastController } from '@ionic/angular';
import { RepAuth_dang_nhap, RepAuth_Modify, RepAuth_quyen_nguoi_dung, RepAuth_Set } from 'src/api_repository/repAuth';
import { RepLocalStorage_GetSetting, RepLocalStorage_SetSetting } from 'src/api_repository/repLocalStorage';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IAuthForm, IRole } from 'src/app_models/Auth';
import { AuthSSO } from 'capacitor-hybrid-vnptid';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;

  public dataForm: { username?: string, password?: string, rememberme?: boolean } = {
    // "username": "demo1",
    // "password": "123456a@",
    "rememberme": true
  };

  private returnUrl?: string;

  constructor(activatedRoute: ActivatedRoute, private router: Router, private loadingController: LoadingController, private toastController: ToastController) {
    let returnurl = activatedRoute.snapshot.queryParamMap.get('returnurl') as string;
    if (returnurl) {
      this.returnUrl = returnurl;
    }
  }

  ngOnInit() {
    RepLocalStorage_GetSetting({
      callback: (res: any) => {
        if (res?.authForm) {
          this.dataForm = res?.authForm as IAuthForm;
        }
      }
    });
  }

  changeUserName(ev: any) {
    this.dataForm.username = ev.detail.value?.replace(/\s/g, '');
  }

  changePassword(ev: any) {
    this.dataForm.password = ev.detail.value;
  }

  changeRemember(ev: any) {
    this.dataForm.rememberme = ev.detail.checked;
  }

  redirect() {
    var regexUrl = new RegExp(environment.match_web_url, 'i')
    if (this.returnUrl?.match(regexUrl)) {
      this.router.navigateByUrl(this.returnUrl?.replace(regexUrl, '/'), { replaceUrl: true });
    }
    else {
      this.router.navigateByUrl(APP_ROUTE.DASHBOARD, { replaceUrl: true });
    }
  }

  get signIn_disabled() {
    return !this.dataForm.username || !this.dataForm.password
      ? true : false
  }

  async signIn() {

    if (this.signIn_disabled) { return }

    if (this.dataForm.rememberme) {
      RepLocalStorage_SetSetting({
        params: {
          authForm: this.dataForm
        }
      });
    }

    RepAuth_dang_nhap({
      loadingController: this.loadingController,
      params: this.dataForm,
      callback: (res?: { state: boolean, token: string, data: any, role: any }) => {
        if (res?.state) {
          RepAuth_Set({
            params: {
              AccessToken: res.token,
              //RefreshToken: RefreshToken,
              TokenExpiry: ((dt) => { return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59).getTime() })(new Date()),
              data: {
                name: res.data.ten_day_du,
                email: res.data.email,
                mobile: res.data.so_dien_thoai,

                //fix bo sung theo thong tin dang nhap
                ten_dangnhap: res.data.ten_dangnhap,
                ten_day_du: res.data.ten_day_du,
                so_dien_thoai: res.data.so_dien_thoai,
              },
              roles: res.role?.map((m: any) => {
                return {
                  ma: m.ma,
                  ten: m.ten
                } as IRole
              }),
              form: this.dataForm.rememberme ? this.dataForm : {}
            },
            callback: (res: any) => {
              if (res?.AccessToken) {
                this.redirect();
              }
            }
          });
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });

  }

  async authSSO_VNeID() {

    AuthSSO.signIn()
      .then((res?: { status: boolean, message: string, data?: string, token?: string, tokenAccess?: string, tokenRefresh?: string }) => {
        console.log('resSignIn', res);

        if (res?.status) {

          let userInfo = res.data ? JSON.parse(res.data) : {};

          RepAuth_Set({
            params: {
              AccessToken: res.token,
              RefreshToken: res.tokenRefresh,
              TokenExpiry: ((dt) => { return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59).getTime() })(new Date()),
              data: {
                name: userInfo.email?.split('@')?.shift() ?? userInfo.username,
                email: userInfo.email,
                mobile: userInfo.mobile,

                //fix bo sung theo thong tin dang nhap
                ten_dangnhap: userInfo.username,
                ten_day_du: userInfo.username,
                so_dien_thoai: userInfo.email,
              },
              roles: userInfo.role?.map((m: any) => {
                return {
                  ma: m.ma,
                  ten: m.ten
                } as IRole
              }),
              //form: this.dataForm.rememberme ? this.dataForm : {}
            },
            callback: (res: any) => {
              if (res?.AccessToken) {
                this.redirect();

                //
                RepAuth_quyen_nguoi_dung({
                  callback: (res?: IOptionResponse) => {
                    if (res?.status) {
                      RepAuth_Modify({
                        params: {
                          roles: res.data?.map((m: any) => {
                            return {
                              ma: m.ma,
                              ten: m.ten
                            } as IRole
                          })
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      })
      .catch(() => {
        APP_COMPONENT_IonToast(this.toastController, { color: 'error', message: 'Kết nối hệ thống SSO không thành công' }).then(toast => toast.present());
      })
  }

}
