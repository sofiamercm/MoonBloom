import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { NotFoundComponent } from './pages/not-found/not-found';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home';
import { CycleList } from './features/cycles/cycle-list/cycle-list';
import { CycleCreateComponent } from './features/cycles/cycle-create/cycle-create';
import { CycleEditComponent } from './features/cycles/cycle-edit/cycle-edit';
import { LogCreateComponent } from './features/logs/log-create/log-create';
import { CalendarHomeComponent } from './features/calendar/calendar-home/calendar-home';

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
    path: 'calendario',
    component: CalendarHomeComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];