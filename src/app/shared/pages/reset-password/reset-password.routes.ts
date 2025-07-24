import { Routes } from '@angular/router';

export const RESET_PASSWORD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./reset-password.page').then(m => m.ResetPasswordPage)
  }
];
