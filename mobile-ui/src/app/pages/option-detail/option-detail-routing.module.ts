import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptionDetailPage } from './option-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OptionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionDetailPageRoutingModule {}
