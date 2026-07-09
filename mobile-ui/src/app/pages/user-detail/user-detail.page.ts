import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_AUTHENTICATE_GetAuthRequire } from 'src/app_func/appAuthenticate';
import { APP_FUNC_FormatMobileNumber } from 'src/app_func/appFunc';
import { IUser } from 'src/app_models/Auth';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {

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

}
