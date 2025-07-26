import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  private readonly DEBUG = true; // Set to false for production
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.DEBUG) {
      console.log('NoAuthGuard: Checking authentication for route:', state.url);
    }
    
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (this.DEBUG) {
      console.log('NoAuthGuard: User authenticated:', isAuthenticated);
    }
    
    if (isAuthenticated) {
      // User is already authenticated, redirect to home
      if (this.DEBUG) {
        console.log('NoAuthGuard: User already authenticated, redirecting to /home');
      }
      this.router.navigate(['/home'], { replaceUrl: true });
      return false;
    }
    
    // User is not authenticated, allow access to login/forgot-password
    if (this.DEBUG) {
      console.log('NoAuthGuard: Allowing access to auth pages');
    }
    return true;
  }
}
