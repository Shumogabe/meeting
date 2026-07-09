import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController, ToastController } from '@ionic/angular';
import { APP_ROUTE } from 'src/app_func/appRoute';
import { IHelp } from 'src/app_models/help';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  public APP_ROUTE = APP_ROUTE;

  public paging = { sortfield: null, sorttype: null, page: 1, limit: 10, loading: false, active: true };
  public filter: { search?: string } = {};

  public response?: {
    Succeeded?: Boolean,
    Message?: string,
    Data?: any
  };

  public helps: Array<IHelp> = [
    {
      HelpId: 1,
      Title: "Bắt đầu cuộc họp nhanh",
      Content: "Tại màn hình chính, chọn Tạo phòng -> Tạo phòng họp nhanh -> Nhập tên phòng và mật khẩu phòng, sau đó chọn Xác nhận."
    },
    {
      HelpId: 2,
      Title: "Tham gia biểu quyết",
      Content: "Quá trình biểu quyết sẽ được thiết lập riêng theo yêu cầu của người điểu hành, có thể diễn ra trước hoặc xuyên suốt trong cuộc họp."
    },
    {
      HelpId: 3,
      Title: "Tải tài liệu cuộc họp",
      Content: "Vào phần danh sách lịch họp -> chọn Xem chi tiết lịch họp -> chọn Tab tài liệu cuộc họp -> chọn Tải về."
    }
  ];

  constructor(private loadingController: LoadingController, private toastController: ToastController) {

  }

  ngOnInit() {
    this.refreshData();
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

  pushData(data: Array<IHelp>) {
    if (this.paging.page == 1) {
      this.helps.length = 0;
    }

    this.helps = this.helps.concat(data);
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

  searchChange(ev: any) {
    this.filter.search = ev.target.value.replace(/\s+/g, ' ').trim();
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit();
  }

  sortChange(sortfield: any, sorttype: any) {
    this.paging.sortfield = sortfield || null;
    this.paging.sorttype = sorttype || null;
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit();
  }

  filterChange() {
    this.paging.page = 1;
    this.paging.active = true;
    this.loadData_Paging_Limit();
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

    // RepHelp_GetChilds({
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
    // })
  }

  changeAccordion(ev: any) {
    var HelpId = ev.detail.value;
    if (HelpId) {
      // RepHelp_GetByid({
      //   params: {
      //     HelpId: HelpId
      //   },
      //   callback: (res?: IOptionResponse) => {
      //     if (res?.Succeeded) {
      //       var help = res.Data as IHelp;
      //       if (help && help.Content) {
      //         this.helps.filter(f => f.HelpId == HelpId).forEach(item => item.Content = help.Content);
      //       }
      //     }
      //     else {
      //       ionToast(this.toastController, {}, res).then(toast => toast.present());
      //     }
      //   }
      // });
    }
  }

}
