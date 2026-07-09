import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RepDanhMucBieuQuyet_xemchitiet } from 'src/api_repository/repDanhMucBieuQuyet';
import { IOptionResponse } from 'src/app_models/Repository';
import { APP_COMPONENT_IonToast } from 'src/app_func/appComponent';

@Component({
  selector: 'app-modal-vote-detail',
  templateUrl: './modal-vote-detail.component.html',
  styleUrls: ['./modal-vote-detail.component.scss']
})
export class ModalVoteDetailComponent implements OnInit, OnDestroy {

  @Input() id?: any;

  public itemData?: any;

  constructor(private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController) { }

  ngOnInit() {
    this.refreshData();
  }

  ngOnDestroy() {
    console.log('Component destroyed');
  }

  async refreshData() {
    RepDanhMucBieuQuyet_xemchitiet({
      loadingController: this.loadingController,
      params: {
        id: this.id
      },
      callback: (res?: IOptionResponse) => {
        if (res?.status) {
          this.itemData = res?.data || {};

          //
          this.initChart();
        }
        else {
          APP_COMPONENT_IonToast(this.toastController, {}, res).then(toast => toast.present());
        }
      }
    });
  }

  modalClose() {
    this.modalController.dismiss();
  }

  public chart: any = {};

  initChart() {

    this.chart.title = 'Biểu đồ thống kê chọn biểu quyết';
    this.chart.xName = "category";
    this.chart.yName = "value";
    this.chart.name = "Biểu quyết";

    this.chart.dataSource = this.itemData?.meetingvoted?.map((item: any) => {
      return {
        category: item.title,
        value: item.count || 0
      }
    }) ?? [];

    this.chart.total = this.chart.dataSource.reduce((accumulator: number, currentValue: any) => accumulator + currentValue.value, 0);

    if (this.itemData.type) {
      this.chart.primaryXAxis = {
        valueType: 'Category', // Đảm bảo valueType là 'Category'
        labelIntersectAction: 'Rotate45',
        title: 'Lựa chọn'
      };

      this.chart.primaryYAxis = {
        labelFormat: '{value}',
        title: 'Số lượng'
      };
    }
    else {
      this.chart.legendSettings = {
        visible: true,
        position: 'Bottom'
      };
      this.chart.tooltip = {
        enable: true
      };
      this.chart.marker = {
        dataLabel: {
          visible: true,
          position: 'Inside',
          name: 'category',
        }
      };
    }

  }

}
