import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonHeader,
  IonContent,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { AuthService } from './shared/services/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { ToolbarComponent } from "./shared/toolbar/toolbar.component";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonContent,
    SidebarComponent,
    ToolbarComponent
],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isAuthenticated = false;
  currentRoute = '';
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Clean up any temporary test data first
    this.authService.cleanupTestData();

    // Initialize authentication state immediately
    this.isAuthenticated = this.authService.isAuthenticated();

    // Track authentication state changes
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      });

    // Track current route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    // Track theme changes
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get shouldShowSidebar(): boolean {
    const excludedRoutes = ['/auth', '/reset-password'];
    const isExcludedRoute = excludedRoutes.some(route =>
      this.currentRoute === route || this.currentRoute.startsWith(route + '/')
    );

    return this.isAuthenticated && !isExcludedRoute;
  }

  get shouldShowMenuButton(): boolean {
    // Always show menu button - Ionic handles hiding on large screens
    return true;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async logout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          role: 'confirm',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private async performLogout(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      spinner: 'circular'
    });

    await loading.present();

    try {
      await this.authService.logout().toPromise();
      await loading.dismiss();

      // Navigate to auth page
      this.router.navigate(['/auth'], { replaceUrl: true });

    } catch (error) {
      await loading.dismiss();

      // Even if API call fails, clear local data and redirect
      this.authService.clearAuthData();
      this.router.navigate(['/auth'], { replaceUrl: true });
    }
  }
}
