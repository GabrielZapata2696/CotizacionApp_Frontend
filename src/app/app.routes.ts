import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./shared/pages/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./shared/pages/reset-password/reset-password.routes').then(m => m.RESET_PASSWORD_ROUTES),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then(m => m.HOME_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path:'**',
    redirectTo: 'auth',
  }
];
