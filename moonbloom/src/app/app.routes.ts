import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AuthCallbackComponent } from './features/auth/auth-callback/auth-callback';
import { NotFoundComponent } from './pages/not-found/not-found';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home';
import { CycleList } from './features/cycles/cycle-list/cycle-list';
import { CycleCreateComponent } from './features/cycles/cycle-create/cycle-create';
import { CycleEditComponent } from './features/cycles/cycle-edit/cycle-edit';
import { LogCreateComponent } from './features/logs/log-create/log-create';
import { LogListComponent } from './features/logs/log-list/log-list';
import { CalendarHomeComponent } from './features/calendar/calendar-home/calendar-home';
import { ProfileComponent } from './features/profile/profile/profile';

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
    path: 'auth/callback',
    component: AuthCallbackComponent
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
    path: 'ciclos/nuevo',
    component: CycleCreateComponent
  },
  {
    path: 'ciclos/:id/editar',
    component: CycleEditComponent
  },
  {
    path: 'registros/nuevo',
    component: LogCreateComponent
  },
  {
    path: 'daily-logs',
    component: LogListComponent
  },
  {
    path: 'calendario',
    component: CalendarHomeComponent
  },
  {
    path: 'perfil',
    component: ProfileComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
