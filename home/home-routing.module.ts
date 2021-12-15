import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path:'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
          }
        ]

      },
      {
        path:'list',
        children: [
          {
            path: '',
            loadChildren: () => import('../todo-list/todo-list.module').then( m => m.TodoListPageModule)
          }
        ]
      },
      {
        path:'calendar',
        children: [
          {
            path: '',
            loadChildren: () => import('../calendar/calendar.module').then( m => m.CalendarPageModule)
          }
        ]

      },
      {
        path:'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
          }
        ]

      },
      {
        path: '',
        redirectTo:'list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo:'tabs/list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
