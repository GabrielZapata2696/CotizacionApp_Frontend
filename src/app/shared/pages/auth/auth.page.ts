import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from '../../components/login/login.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, IonicModule, LoginComponent, ForgotPasswordComponent],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage {
  currentView: 'login' | 'forgot-password' | 'register' = 'login';

  constructor() {}

  switchView(view: 'login' | 'forgot-password' | 'register') {
    this.currentView = view;
  }
}
