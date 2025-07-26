import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [],
})
export class HomePage {
  constructor() {}

  getCurrentRoute(): string {
    return location.pathname;
  }

  getAuthStatus(): string {
    return localStorage.getItem('auth-token') ? 'Authenticated' : 'Not Authenticated';
  }

  getSidebarStatus(): string {
    // Assuming the AppComponent's logic decides visibility
    return document.body.classList.contains('menu-visible') ? 'Showing' : 'Hidden';
  }
}
