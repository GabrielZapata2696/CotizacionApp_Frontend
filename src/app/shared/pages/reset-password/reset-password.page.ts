import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ResetPasswordRequest } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  token: string = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8)
        // Removed strict password validator for now
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Extract token from URL parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.showAlert('Error', 'Token de restablecimiento no válido o expirado.')
          .then(() => this.router.navigate(['/auth']));
      }
    });
  }

  // Custom password validator - requiring at least 3 of 4 criteria instead of all 4
  passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    // Count how many criteria are met
    const criteriaCount = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecial].filter(Boolean).length;
    const passwordValid = criteriaCount >= 3; // At least 3 of 4 criteria

    return !passwordValid ? { 
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecial,
        criteriaCount
      }
    } : null;
  }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit() {
    if (!this.resetPasswordForm.valid) {
      await this.showAlert('Error', 'Por favor, corrige los errores en el formulario.');
      return;
    }

    const loading = await this.presentLoading('Restableciendo contraseña...');

    try {
      const requestData: ResetPasswordRequest = {
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword
      };

      this.authService.resetPassword(requestData).subscribe({
        next: async (response) => {
          await loading.dismiss();
          if (response.success) {
            await this.showAlert('¡Éxito!', 'Tu contraseña ha sido restablecida correctamente.');
            this.router.navigate(['/auth']);
          } else {
            await this.showAlert('Error', response.message || 'Error al restablecer la contraseña.');
          }
        },
        error: async (error) => {
          await loading.dismiss();
          let errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
          
          if (error.status === 400) {
            errorMessage = 'Token inválido o expirado. Solicita un nuevo enlace de restablecimiento.';
          } else if (error.status === 422) {
            errorMessage = 'La contraseña no cumple con los requisitos de seguridad.';
          }
          
          await this.showAlert('Error', errorMessage);
        }
      });
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', 'Error inesperado. Por favor, intenta nuevamente.');
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

  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
    await alert.onDidDismiss();
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }

  // Getter methods for form validation
  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  get passwordStrengthErrors() {
    return this.newPassword?.errors?.['passwordStrength'];
  }
}
