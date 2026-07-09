import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalOptionAddComponent } from '@app/modals/modal-option-add/modal-option-add.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepCauHinhCuocHop_chinhsua, RepCauHinhCuocHop_chitiet, RepCauHinhCuocHop_xoa } from 'src/api_repository/repCauHinhCuocHop';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IOptionResponse } from 'src/app_models/Repository';

@Component({
  selector: 'app-option-detail',
  templateUrl: './option-detail.page.html',
  styleUrls: ['./option-detail.page.scss'],
})
export class OptionDetailPage implements OnInit {

  public id?: any;
  public itemData?: any;

  constructor(activatedRoute: ActivatedRoute, private router: Router, private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) {
    let id = activatedRoute.snapshot.params['id'];
    if (id) {
      this.id = id;
    }
  }

  ngOnInit() {
    this.refreshData();
  }

  async refreshData() {
    RepCauHinhCuocHop_chitiet({
      loadingController: this.loadingController,
      params: {
        id: this.id
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.itemData = res?.data || {};
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  //

  async confirmDelete(modal?: any) {
    RepCauHinhCuocHop_xoa({
      loadingController: this.loadingController,
      params: {
        id: this.id
      },
      callback: (res?: IOptionResponse) => {

        APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());

        if (res?.status) {
          //
          modal?.dismiss();

          //
          this.router.navigateByUrl(APP_ROUTE.OPTION, { replaceUrl: true });
        }
      }
    });
  }

  //

  async presentModalOptionUpdate() {
    const modal = await this.modalController.create({
      component: ModalOptionAddComponent,
      componentProps: {
        itemData: Object.assign({}, this.itemData)
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
