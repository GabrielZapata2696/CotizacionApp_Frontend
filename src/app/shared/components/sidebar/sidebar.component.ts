import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  AlertController,
  LoadingController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import { SidebarMenuItem } from '../../interfaces/shared.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  /**
   * logica del dark mode
   * @type {boolean}
   */
  isDarkMode = false;

  /**
   * item de menu del sidebar
   */
  sidebarMenuItems: SidebarMenuItem[] = [];

  /**
   * Current user authentication status
   */
  isAuthenticated = false;

  /**
   * Current user role
   */
  userRole = 'user';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private menuService: MenuService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize component subscriptions and load menu items
   */
  private initializeComponent(): void {
    // Track authentication state
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        this.loadMenuItems();
      });

    // Track user role changes
    this.authService.userRole$
      .pipe(takeUntil(this.destroy$))
      .subscribe(role => {
        this.userRole = role;
        this.loadMenuItems();
      });

    // Track theme changes
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });

    // Initialize authentication state and user role
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getUserRole();
    // Set initial theme state
    this.isDarkMode = this.themeService.getCurrentTheme();
    // Load initial menu items
    this.loadMenuItems();
  }

  /**
   * Load menu items based on current user role and authentication status
   */
  private loadMenuItems(): void {
    this.menuService.getFilteredItems(this.userRole, this.isAuthenticated)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.sidebarMenuItems = items;
        },
        error: (error) => {
          console.error('Error loading menu items:', error);
          // Set empty array as fallback
          this.sidebarMenuItems = [];
        }
      });
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

  /**
   * Maneja el cierre de sesión del usuario mediante el servicio de autenticación
   * y redirige a la página de autenticación.
   *
   */
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
