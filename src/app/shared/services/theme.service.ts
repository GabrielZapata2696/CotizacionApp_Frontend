import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme-preference';
  private isDarkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private getInitialTheme(): boolean {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    
    // Fall back to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default to light mode
    return false;
  }

  private initializeTheme(): void {
    const isDark = this.isDarkModeSubject.value;
    this.applyTheme(isDark);
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkModeSubject.value;
    this.setTheme(newTheme);
  }

  setTheme(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
    this.saveTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', isDark);
      
      // Also update the HTML element for better CSS targeting
      document.documentElement.classList.toggle('dark', isDark);
      
      // Update meta theme-color for better mobile experience
      this.updateThemeColor(isDark);
    }
  }

  private updateThemeColor(isDark: boolean): void {
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1a1a1a' : '#ffffff');
    }
  }

  private saveTheme(isDark: boolean): void {
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }

  getCurrentTheme(): boolean {
    return this.isDarkModeSubject.value;
  }
}
