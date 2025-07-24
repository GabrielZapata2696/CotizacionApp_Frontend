import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() embeddable = false;
  @Output() switchToForgotPassword = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();
  
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

async onSubmit() {
  if (!this.loginForm.valid) {
    await this.showAlert('Error', 'Por favor, completa todos los campos correctamente.');
    return;
  }

  const loading = await this.presentLoading('  Iniciando sesión...');

  try {
    const loginData: LoginRequest = this.loginForm.value;
    const response = await firstValueFrom(this.authService.login(loginData));

    await loading.dismiss();

    if (response.success) {
      this.router.navigate(['/home']);
    } else {
      await this.showAlert('Error', response.message);
    }
  } catch (error) {
    await loading.dismiss();
    await this.showAlert('Error', 'Error de conexión. Por favor, intenta nuevamente.');
  }
}

private async presentLoading(message: string) {
  const loading = await this.loadingController.create({
    message,
    spinner: 'circular'
  });
  await loading.present();
  return loading;
}


  // async onSubmit() {
  //   if (this.loginForm.valid) {
  //     const loading = await this.loadingController.create({
  //       message: 'Iniciando sesión...',
  //       spinner: 'circular'
  //     });
  //     await loading.present();
  //     const loginData: LoginRequest = {
  //       email: this.loginForm.value.email,
  //       password: this.loginForm.value.password
  //     };
  //     this.authService.login(loginData).subscribe({
  //       next: async (response) => {
  //         await loading.dismiss();

  //         if (response.success) {
  //           this.router.navigate(['/home']);
  //         } else {
  //           await this.showAlert('Error', response.message);
  //         }
  //       },
  //       error: async (error) => {
  //         await loading.dismiss();
  //         await this.showAlert('Error', 'Error de conexión. Por favor, intenta nuevamente.');
  //       }
  //     });
  //   } else {
  //     await this.showAlert('Error', 'Por favor, completa todos los campos correctamente.');
  //   }
  // }

  goToForgotPassword() {
    // Check if parent component is listening, otherwise use router navigation
    if (this.switchToForgotPassword.observers.length > 0) {
      this.switchToForgotPassword.emit();
    } else {
      this.router.navigate(['/forgot-password']);
    }
  }

  goToRegister() {
    // Check if parent component is listening, otherwise use router navigation
    if (this.switchToRegister.observers.length > 0) {
      this.switchToRegister.emit();
    } else {
      // Future: navigate to register route
      console.log('Register functionality not yet implemented');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Getter methods for form validation
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
