import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: 'cycles',
    renderMode: RenderMode.Client
  },
  {
    path: 'ciclos/nuevo',
    renderMode: RenderMode.Client
  },
  {
    path: 'ciclos/:id/editar',
    renderMode: RenderMode.Client
  },
  {
    path: 'registros/nuevo',
    renderMode: RenderMode.Client
  },
  {
    path: 'calendario',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];