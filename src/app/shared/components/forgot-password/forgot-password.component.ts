import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, ForgotPasswordRequest } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  @Input() embeddable = false;
  @Output() switchToLogin = new EventEmitter<void>();
  
  forgotPasswordForm: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Enviando solicitud...',
        spinner: 'circular'
      });
      await loading.present();

      const requestData: ForgotPasswordRequest = {
        email: this.forgotPasswordForm.value.email
      };

      this.authService.forgotPassword(requestData).subscribe({
        next: async (response) => {
          await loading.dismiss();
          if (response.success) {
            this.isSubmitted = true;
            await this.showAlert('Solicitud Enviada', response.message);
          } else {
            await this.showAlert('Error', response.message);
          }
        },
        error: async (error) => {
          await loading.dismiss();
          await this.showAlert('Error', 'Error de conexión. Por favor, intenta nuevamente.');
        }
      });
    } else {
      await this.showAlert('Error', 'Por favor, ingresa un correo electrónico válido.');
    }
  }

  goToLogin() {
    // Check if parent component is listening, otherwise use router navigation
    if (this.switchToLogin.observers.length > 0) {
      this.switchToLogin.emit();
    } else {
      this.router.navigate(['/login']);
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

  // Getter for form validation
  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
