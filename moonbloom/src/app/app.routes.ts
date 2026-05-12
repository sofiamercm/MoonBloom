import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { NotFoundComponent } from './pages/not-found/not-found';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home';
import { CycleList } from './features/cycles/cycle-list/cycle-list';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardHomeComponent
  },
  {
    path: 'cycles',
    component: CycleList
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];