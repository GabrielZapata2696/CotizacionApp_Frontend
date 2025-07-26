import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly DEBUG = true; // Set to false for production
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.DEBUG) {
      console.log('AuthGuard: Checking authentication for route:', state.url);
    }
    
    // First check if user is authenticated
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (this.DEBUG) {
      console.log('AuthGuard: User authenticated:', isAuthenticated);
    }
    
    if (isAuthenticated) {
      return true; // User is authenticated, allow access to protected routes
    }
    
    // User is not authenticated, redirect to auth page
    if (this.DEBUG) {
      console.log('AuthGuard: Redirecting to /auth');
    }
    
    this.router.navigate(['/auth'], { 
      queryParams: { returnUrl: state.url },
      replaceUrl: true 
    });
    return false;
  }
}
