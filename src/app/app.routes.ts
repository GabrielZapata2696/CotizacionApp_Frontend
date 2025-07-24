import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./shared/components/login/login.component').then((m) => m.LoginComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./shared/components/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path:'**',
    redirectTo: 'login',
  }
];
