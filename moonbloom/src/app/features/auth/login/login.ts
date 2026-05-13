import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  loginForm: FormGroup;
  loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        console.log('Login successful:', response);

        // Guardar token
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }

        // Guardar usuario
        if (response?.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Redirigir al usuario a la página de inicio
        this.router.navigate(['/dashboard']);
      },

      error: (err: any) => {
        this.isLoading = false;

        this.errorMessage =
          err?.error?.message || 'Invalid credentials. Please try again.';

        console.error('Login error:', err);
      }
    });
  }
}