import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SidebarMenuItem } from '../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuUrl = 'assets/menu.json';

  constructor(private http: HttpClient) {}

  /**
   * Get all menu items from the JSON file
   * @returns Observable<SidebarMenuItem[]>
   */
  getMenuItems(): Observable<SidebarMenuItem[]> {
    return this.http.get<SidebarMenuItem[]>(this.menuUrl).pipe(
      catchError(error => {
        console.error('Error loading menu items from JSON:', error);
        // Return fallback menu items
        return of(this.getFallbackMenuItems());
      })
    );
  }

  /**
   * Get filtered menu items based on user role and authentication status
   * @param userRole - The role of the current user (e.g., 'admin', 'user')
   * @param isAuthenticated - Whether the user is authenticated
   * @returns Observable<SidebarMenuItem[]>
   */
  getFilteredItems(userRole: string, isAuthenticated: boolean): Observable<SidebarMenuItem[]> {
    return this.getMenuItems().pipe(
      map(items => items.filter(item => {
        // If item has authentication requirement, check if it matches user's auth status
        if (item.authenticated !== undefined) {
          if (item.authenticated !== isAuthenticated) {
            return false;
          }
        }

        // If item has role requirement, check if user has the required role
        if (item.rol && item.rol !== userRole) {
          return false;
        }

        return true;
      }))
    );
  }

  /**
   * Fallback menu items if JSON loading fails
   * @returns SidebarMenuItem[]
   */
  private getFallbackMenuItems(): SidebarMenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'grid-outline',
        routerLink: '/dashboard',
        authenticated: true
      },
      {
        label: 'Profile',
        icon: 'person-circle-outline',
        routerLink: '/profile',
        authenticated: true
      },
      {
        label: 'Help',
        icon: 'help-buoy-outline',
        routerLink: '/help'
      },
      {
        label: 'About',
        icon: 'information-outline',
        routerLink: '/about'
      }
    ];
  }
}
