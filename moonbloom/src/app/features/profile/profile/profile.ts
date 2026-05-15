import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user';
import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  user: User | null = null;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  private platformId = inject(PLATFORM_ID);

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadStoredUser();
    this.loadCurrentUser();
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const name = this.profileForm.value.name.trim();
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateCurrentUserName(name).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.user = response.user;
        this.profileForm.patchValue({ name: response.user.name });
        this.saveUser(response.user);
        this.successMessage = 'Your name was updated.';
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'We could not update your name.';
      }
    });
  }

  private loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.user = response.user;
        this.profileForm.patchValue({ name: response.user.name });
        this.saveUser(response.user);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'We could not load your profile.';
      }
    });
  }

  private loadStoredUser(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = localStorage.getItem('user');
    if (!stored) return;

    try {
      this.user = JSON.parse(stored);
      this.profileForm.patchValue({ name: this.user?.name || '' });
    } catch {
      localStorage.removeItem('user');
    }
  }

  private saveUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}
