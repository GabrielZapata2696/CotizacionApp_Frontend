import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  tokens?: string;
  data?: any;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly DEBUG = true; // Set to false for production
  private tokenKey = 'auth-token';
  private userKey = 'auth-user';
  // User role is stored only in memory for security reasons
  private currentUserRole = 'user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string>('user');
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize authentication state on service creation
    const initialAuthState = this.hasToken();
    if (this.DEBUG) {
      console.log('AuthService initialized. Initial auth state:', initialAuthState, 'Initial role:', this.currentUserRole);
    }
    this.isAuthenticatedSubject.next(initialAuthState);
    this.userRoleSubject.next(this.currentUserRole);
    
    // If user is already authenticated, try to get role from stored user data
    if (initialAuthState) {
      const userData = this.getUser();
      if (userData) {
        const roleFromStorage = this.extractUserRole(userData);
        this.setUserRole(roleFromStorage);
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data.tokens) {
            this.setToken(response.data.tokens);
            if (response.data) {
              this.setUser(response.data);
              // Extract and save user role from response data
              const userRole = this.extractUserRole(response.data);
              this.setUserRole(userRole);
              if (this.DEBUG) {
                console.log('AuthService: User role set to:', userRole);
              }
            }
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${environment.apiUrl}/auth/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${environment.apiUrl}/auth/reset-password`, request);
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          // Clear local storage regardless of response
          this.clearAuthData();
        })
      );
  }

  clearAuthData(): void {
    if (this.DEBUG) {
      console.log('AuthService: Clearing auth data');
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    // Clear in-memory role data
    this.currentUserRole = 'user';
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next('user'); // Reset to default role
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;
    
    try {
      // Handle JSON wrapped tokens
      return JSON.parse(token);
    } catch {
      // Handle plain string tokens
      return token;
    }
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private hasToken(): boolean {
    const token = this.getToken();
    const hasToken = !!token;
    if (this.DEBUG) {
      console.log('AuthService: hasToken check:', hasToken, 'Token:', token ? 'present' : 'absent');
    }
    return hasToken;
  }

  isAuthenticated(): boolean {
    const isAuth = this.hasToken();
    if (this.DEBUG) {
      console.log('AuthService: isAuthenticated called, result:', isAuth);
    }
    return isAuth;
  }

  // Method to clean up any temporary test data
  cleanupTestData(): void {
    const token = this.getToken();
    if (token === 'fake-token') {
      this.clearAuthData();
    }
  }

  /**
   * Get the current user role from memory (secure)
   * @returns User role string or 'user' as default
   */
  getUserRole(): string {
    return this.currentUserRole;
  }

  /**
   * Extract user role from login response data
   * @param userData - User data from login response
   * @returns Extracted user role or 'user' as default
   */
  private extractUserRole(userData: any): string {
    // Try different possible role field names in the response
    if (userData.role) {
      return userData.role;
    }
    if (userData.rol) {
      return userData.rol;
    }
    if (userData.userRole) {
      return userData.userRole;
    }
    if (userData.user && userData.user.role) {
      return userData.user.role;
    }
    if (userData.user && userData.user.rol) {
      return userData.user.rol;
    }
    
    // Default fallback role
    if (this.DEBUG) {
      console.log('AuthService: No role found in user data, defaulting to "user"');
    }
    return 'user';
  }

  /**
   * Set user role in memory only (secure) and update BehaviorSubject
   * @param role - User role to set
   */
  private setUserRole(role: string): void {
    this.currentUserRole = role;
    this.userRoleSubject.next(role);
    if (this.DEBUG) {
      console.log('AuthService: User role updated in memory to:', role);
    }
  }
}
