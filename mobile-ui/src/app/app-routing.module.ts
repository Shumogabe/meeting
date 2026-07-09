import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { APP_ROUTE } from 'src/app_func/appRoute';

const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTE.HOME,
    pathMatch: 'full'
  },
  {
    path: APP_ROUTE.AUTH,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: APP_ROUTE.HOME,
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: APP_ROUTE.DASHBOARD,
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: APP_ROUTE.USER,
    loadChildren: () => import('./pages/user/user.module').then(m => m.UserPageModule)
  },
  {
    path: APP_ROUTE.USER_DETAIL,
    loadChildren: () => import('./pages/user-detail/user-detail.module').then(m => m.UserDetailPageModule)
  },
  {
    path: APP_ROUTE.ROOM_JOIN,
    loadChildren: () => import('./pages/room-join/room-join.module').then(m => m.RoomJoinPageModule)
  },
  {
    path: APP_ROUTE.ROOM_EXTERNAL_ID,
    loadChildren: () => import('./pages/room-external/room-external.module').then(m => m.RoomExternalPageModule)
  },
  {
    path: APP_ROUTE.ROOM_EXTERNAL_GUEST_ID,
    loadChildren: () => import('./pages/room-external-guest/room-external-guest.module').then(m => m.RoomExternalGuestPageModule)
  },
  {
    path: APP_ROUTE.SCHEDULE,
    loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.SchedulePageModule)
  },
  {
    path: APP_ROUTE.SCHEDULE_DETAIL_ID,
    loadChildren: () => import('./pages/schedule-detail/schedule-detail.module').then(m => m.ScheduleDetailPageModule)
  },
  {
    path: APP_ROUTE.VOTE,
    loadChildren: () => import('./pages/vote/vote.module').then(m => m.VotePageModule)
  },
  {
    path: APP_ROUTE.VOTE_ROOM,
    loadChildren: () => import('./pages/vote-room/vote-room.module').then(m => m.VoteRoomPageModule)
  },
  {
    path: APP_ROUTE.FAQ,
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: APP_ROUTE.HELP,
    loadChildren: () => import('./pages/help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: APP_ROUTE.SETTING,
    loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingPageModule)
  },
  {
    path: APP_ROUTE.OPTION,
    loadChildren: () => import('./pages/option/option.module').then(m => m.OptionPageModule)
  },
  {
    path: APP_ROUTE.OPTION_DETAIL_ID,
    loadChildren: () => import('./pages/option-detail/option-detail.module').then(m => m.OptionDetailPageModule)
  },
  {
    path: APP_ROUTE.DELETED,
    loadChildren: () => import('./pages/deleted/deleted.module').then(m => m.DeletedPageModule)
  },
  {
    path: APP_ROUTE.DOCUMENT,
    loadChildren: () => import('./pages/document/document.module').then( m => m.DocumentPageModule)
  },
  {
    path:APP_ROUTE.DOCUMENT_ROOM,
    loadChildren: () => import('./pages/document-room/document-room.module').then( m => m.DocumentRoomPageModule)
  },

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
