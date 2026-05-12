import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html'
})
export class LoginComponent {

  isLoading = false;
  errorMessage = '';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Login successful', response);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid credentials. Please try again.';
          console.error('Login error', err);
        }
      });
  }
}