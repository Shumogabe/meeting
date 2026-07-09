import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { environment } from '@env/environment';
//import { PushNotifications_addListeners, PushNotifications_getDeliveredNotifications, PushNotifications_registerNotifications } from 'src/app_func/appCapacitor';
import { Platform, ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private isNetworkCheck: boolean = false;

  constructor(private router: Router, private zone: NgZone, private platform: Platform, private toastController: ToastController) {
    //KIEN DEP TRAI SIEU CAP VO DICH
    this.initializeApp();

    //notify
    //PushNotifications_addListeners(router);
    //PushNotifications_registerNotifications();
    //PushNotifications_getDeliveredNotifications();
  }

  initializeApp() {

    // url open app
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        console.log('appUrlOpen->', event.url);

        var regexUrl = new RegExp(environment.match_web_url, 'i')
        if (event.url.match(regexUrl)) {
          this.router.navigateByUrl(event.url.replace(regexUrl, '/'));
        }
      });
    });

    //network
    Network.addListener('networkStatusChange', status => {
      //console.log('networkStatusChange 1', status);

      if (status?.connected) {
        APP_COMPONENT_IonToast(this.toastController, { color: 'success', message: `Đã kết nối ${status.connectionType}!` }).then(toast => toast.present());
      }
      else {
        APP_COMPONENT_IonToast(this.toastController, { color: 'warning', message: 'Vui lòng kiểm tra kết nối mạng và thử lại!' }).then(toast => toast.present());
      }

      //mất mạng thì mỗi 5s kiểm tra lại kết nối 1 lần
      this.isNetworkCheck = !status?.connected;
    });

    //timeout check
    setTimeout(async () => {
      const status = await Network.getStatus();
      //console.log('networkStatusChange 2', status);

      if (status?.connected) {
        //APP_COMPONENT_IonToast(this.toastController, { color: 'success', message: `Đã kết nối ${status.connectionType}!` }).then(toast => toast.present());
      }
      else {
        APP_COMPONENT_IonToast(this.toastController, { color: 'warning', message: 'Vui lòng kiểm tra kết nối mạng và thử lại!' }).then(toast => toast.present());
      }

      //mất mạng thì mỗi 5s kiểm tra lại kết nối 1 lần
      this.isNetworkCheck = !status?.connected;
    }, 3000);

    //interval check
    setInterval(async () => {

      if (!this.isNetworkCheck) {
        return
      }

      //
      const status = await Network.getStatus();
      //console.log('networkStatusChange 3', status);

      if (status?.connected) {
        //APP_COMPONENT_IonToast(this.toastController, { color: 'success', message: `Đã kết nối ${status.connectionType}!` }).then(toast => toast.present());
      }
      else {
        APP_COMPONENT_IonToast(this.toastController, { color: 'warning', message: 'Vui lòng kiểm tra kết nối mạng và thử lại!' }).then(toast => toast.present());
      }

      //mất mạng thì mỗi 5s kiểm tra lại kết nối 1 lần
      this.isNetworkCheck = !status?.connected;
    }, 5000);

  }
}
