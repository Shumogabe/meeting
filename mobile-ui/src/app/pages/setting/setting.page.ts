import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Device } from '@capacitor/device';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { ModalController, Platform } from '@ionic/angular';
import { RepLocalStorage_GetSetting, RepLocalStorage_SetSetting } from 'src/api_repository/repLocalStorage';
import { APP_ROUTE } from 'src/app_func/appRoute';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;

  public biometricAvailable?: boolean;

  public dataSetting: {
    Notify?: boolean,
    Biometric?: boolean
  } = {};

  constructor(private router: Router, private platform: Platform, private modalController: ModalController) {
    var platforms = this.platform.platforms();
    if (platforms.includes('mobile') && !platforms.includes('mobileweb')) {
      NativeBiometric.isAvailable({ useFallback: true }).then(e => {
        console.log('NativeBiometric.isAvailable', e);
        this.biometricAvailable = e.isAvailable ? true : false;
      });
    }
  }

  ngOnInit() {
    RepLocalStorage_GetSetting({
      callback: (res?: any) => {
        if (res) {
          this.dataSetting = res;
        }
      }
    });
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  async changeNotify(ev: any) {
    var value = ev.detail.checked;
    if (value) {

    }

    //
    RepLocalStorage_SetSetting({
      params: {
        Notify: value
      }
    });
  }

  async clickBiometric(ev: any) {
    var value = !this.dataSetting.Biometric;
    if (value) {
      NativeBiometric
        .verifyIdentity({
          subtitle: "Kích hoạt bảo vệ ứng dụng với sinh trắc học",
          useFallback: true,
          maxAttempts: 5
        })
        .then(async (e) => {
          console.info('NativeBiometric.verifyIdentity', e);
          // Save user's credentials
          NativeBiometric
            .setCredentials({
              server: "iev.infipower.vn",
              username: "isac",
              password: (await Device.getId())?.identifier,
            })
            .then((e) => {
              console.info('NativeBiometric.setCredentials', e);
              // SAVE
              RepLocalStorage_SetSetting({
                params: {
                  Biometric: true
                }
              });
              this.dataSetting.Biometric = true;
            })
            .catch((e) => {
              throw e;
            })
        })
        .catch((e) => {
          this.dataSetting.Biometric = false;
          console.log('NativeBiometric.verifyIdentity', e);
        });

    }
    else {
      NativeBiometric
        .verifyIdentity({
          subtitle: "Tắt bảo vệ ứng dụng với sinh trắc học",
          useFallback: true,
          maxAttempts: 5
        })
        .then(async (e) => {
          console.info('NativeBiometric.verifyIdentity', e);
          // Delete user's credentials
          NativeBiometric
            .deleteCredentials({
              server: "iev.infipower.vn",
            })
            .then((e) => {
              console.info('NativeBiometric.setCredentials', e);
              // SAVE
              RepLocalStorage_SetSetting({
                params: {
                  Biometric: false
                }
              });
              this.dataSetting.Biometric = false;
            })
            .catch((e) => {
              throw e;
            })
        })
        .catch((e) => {
          this.dataSetting.Biometric = true;
          console.log('NativeBiometric.verifyIdentity', e);
        });
    }
  }

  async sendRequestDeteleAccount(ev: any) {
    Browser.open({ url: "https://infipower.vn/account-deletion-request/" });
  }
}
