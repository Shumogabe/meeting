import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_AUTHENTICATE_IsAuth } from 'src/app_func/appAuthenticate';
import { APP_ROUTE } from 'src/app_func/appRoute';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public APP_ROUTE = APP_ROUTE;
  //public router = inject(Router);

  constructor(private router: Router) {

  }

  private IsOnInit?: boolean;

  ngOnInit() {
    //khởi tạo lần đầu
    this.IsOnInit = true;

    (async () => {
      if (await APP_AUTHENTICATE_IsAuth()) {
        this.navigateByUrl(APP_ROUTE.DASHBOARD);
      }
    })();
  }

  ionViewDidEnter() {
    //chào mừng quay trở lại
    if (this.IsOnInit) {
      this.IsOnInit = false;
      return;
    }

    //
    this.ngOnInit();
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

}
