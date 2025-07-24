import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // User is already authenticated, redirect to home
      this.router.navigate(['/home']);
      return false;
    }
    // User is not authenticated, allow access to login/forgot-password
    return true;
  }
}
