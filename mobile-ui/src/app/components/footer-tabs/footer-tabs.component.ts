import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalScheduleAddAdvanceComponent } from '@app/modals/modal-schedule-add-advance/modal-schedule-add-advance.component';
import { ModalScheduleAddComponent } from '@app/modals/modal-schedule-add/modal-schedule-add.component';
import { ModalController, ToastController } from '@ionic/angular';
import { APP_AUTHENTICATE_GetAuth } from 'src/app_func/appAuthenticate';
import { Role } from 'src/app_func/appLookup';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IRole } from 'src/app_models/Auth';

@Component({
  selector: 'app-footer-tabs',
  templateUrl: './footer-tabs.component.html',
  styleUrls: ['./footer-tabs.component.scss'],
})
export class FooterTabsComponent implements OnInit {

  public APP_ROUTE = APP_ROUTE;
  public routerUrl: string;

  public Role = Role;
  public userRoles?: Array<IRole>;

  constructor(private router: Router, private modalController: ModalController, private toastController: ToastController) {
    this.routerUrl = router.url?.replace(/^\//, '').replace(/\/$/, '');
  }

  ngOnInit() {
    APP_AUTHENTICATE_GetAuth().then(user => {
      this.userRoles = user.roles;
    });
  }

  async navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  async presentModalScheduleAdd() {
    const modal = await this.modalController.create({
      component: ModalScheduleAddComponent,
      cssClass: 'ion-modal-auto'
    });

    modal.present();
  }

  async presentModalScheduleAddAdvance() {
    const modal = await this.modalController.create({
      component: ModalScheduleAddAdvanceComponent,
    });

    modal.present();
  }

}
