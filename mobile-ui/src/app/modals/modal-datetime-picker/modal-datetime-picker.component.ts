import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonDatetime, ModalController } from '@ionic/angular';
import moment from 'moment';

@Component({
  selector: 'app-modal-datetime-picker',
  templateUrl: './modal-datetime-picker.component.html',
  styleUrls: ['./modal-datetime-picker.component.scss'],
})
export class ModalDatetimePickerComponent implements OnInit {

  @ViewChild('datetime') datetime?: IonDatetime;

  @Input() options: {
    presentation?: string,
    min?: string,
    value?: any,
  } = {};

  public isInit?: boolean;

  constructor(private modalController: ModalController) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.options.presentation = this.options.presentation ?? 'date-time';
    this.options.min = this.options.min ? moment(this.options.min).format('YYYY-MM-DD') : undefined;
    this.options.value = moment(this.options.value).toISOString(true);

    //
    this.isInit = true;
  }

  changeDateTime(ev: any) {
    this.options.value = moment(ev.detail.value).format('YYYY-MM-DD HH:mm:ss');
  }

  modalClose() {
    this.modalController.dismiss();
  }

  modalConfirm() {
    this.modalController.dismiss(this.options.value, 'success');
  }

}
