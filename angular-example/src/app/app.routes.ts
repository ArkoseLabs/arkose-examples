import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./login-inline/login-inline.component').then(m => m.LoginInlineComponent) },
  { path: 'login-modal', loadComponent: () => import('./login-modal/login-modal.component').then(m => m.LoginModalComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
];
