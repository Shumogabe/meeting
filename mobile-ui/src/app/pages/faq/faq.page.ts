import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController, ToastController } from '@ionic/angular';
import { APP_AUTHENTICATE_IsAuthRequire } from 'src/app_func/appAuthenticate';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IFaq } from 'src/app_models/faq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {


  public APP_ROUTE = APP_ROUTE;

  public paging = { sortfield: null, sorttype: null, page: 1, limit: 10, loading: false, active: true };
  public filter: { search?: string } = {};

  public response?: {
    Succeeded?: Boolean,
    Message?: string,
    Data?: any
  };

  public faqs: Array<IFaq> = [
    {
      FaqId: 1,
      Question: "Tham gia cuộc họp nhanh như thế nào?",
      Answer: "Để tham gia cuộc họp nhanh, bạn cần có mã phòng họp và mật khẩu tham gia phòng họp (nếu có), ở màn hình chính, chọn Tham gia cuộc họp, điền mà tham gia và xác nhận, hệ thống sẽ yêu cầu nhập thêm mật khẩu phòng nếu đó là điều kiện được thiết lập."
    },
    {
      FaqId: 2,
      Question: "Ai có thể tham gia cuộc họp?",
      Answer: "Để tham gia cuộc họp nhanh bạn không cần đăng nhập tài khoản, tuy nhiên với 1 số cuộc họp yêu cầu bảo mật cao, bạn cần đăng nhập và thực hiện xác minh 1 số thông tin liên quan theo yêu cầu được thiết lập trước bởi quản trị."
    }
  ];

  constructor(private loadingController: LoadingController, private toastController: ToastController) {
  }

  ngOnInit() {
    (async () => {
      if (await APP_AUTHENTICATE_IsAuthRequire()) {
        this.refreshData();
      }
    })();
  }

  onIonRefresher(ev: any) {

    this.filter = {};

    //
    this.refreshData(() => {
      ev.target.complete();
    });
  }

  onIonInfinite(ev: any) {
    this.loadMore(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    });
  }

  pushData(data: Array<IFaq>) {
    if (this.paging.page == 1) {
      this.faqs.length = 0;
    }

    this.faqs = this.faqs.concat(data);
  }

  refreshData(callback?: Function) {
    this.filter = {};
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit(callback);
  }

  loadMore(callback?: Function) {
    this.paging.page += 1;
    this.loadData_Paging_Limit(callback);
  }

  private limitLoad = 0;
  async loadData_Paging_Limit(callback?: Function) {

    if (this.limitLoad > 0) {
      if (callback) callback();
      return;
    }
    else {
      this.limitLoad = 300;
    }

    let intervalLimitLoad = setInterval(() => {
      this.limitLoad -= 100;

      if (this.limitLoad <= 0) {
        clearInterval(intervalLimitLoad);

        //
        this.loadData_Paging(callback);
      }
    }, 100);
  }

  async loadData_Paging(callback?: Function) {

    this.paging.loading = true;

    // RepFaq_GetFaqs({
    //   loadingController: this.loadingController,
    //   params: {
    //     PageNumber: this.paging.page,
    //     PageSize: this.paging.limit
    //   },
    //   callback: (res?: IOptionResponse) => {
    //     this.response = res;

    //     if (res?.Succeeded) {
    //       this.pushData(res.Data ?? []);
    //     }
    //     else {
    //       ionToast(this.toastController, {}, res).then(toast => toast.present());
    //     }

    //     this.paging.loading = false;

    //     //
    //     this.paging.active = res?.HasNextPage ? true : false;

    //     //
    //     callback ? callback() : null;
    //   }
    // });
  }

}
