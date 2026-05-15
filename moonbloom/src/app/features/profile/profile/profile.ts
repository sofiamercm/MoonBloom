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
  isUploadingPhoto = false;
  errorMessage = '';
  successMessage = '';

  private platformId = inject(PLATFORM_ID);

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
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

    const profileData = {
      name: this.profileForm.value.name.trim(),
      email: this.profileForm.value.email.trim().toLowerCase()
    };

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateCurrentUserProfile(profileData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.user = response.user;
        this.profileForm.patchValue({
          name: response.user.name,
          email: response.user.email
        });
        this.saveUser(response.user);
        this.successMessage = 'Your profile was updated.';
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'We could not update your name.';
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please choose an image file.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Please choose an image smaller than 5 MB.';
      return;
    }

    this.isUploadingPhoto = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.uploadProfilePhoto(file).subscribe({
      next: (response) => {
        this.isUploadingPhoto = false;
        this.user = response.user;
        this.saveUser(response.user);
        this.successMessage = 'Your profile photo was updated.';
      },
      error: (err) => {
        this.isUploadingPhoto = false;
        this.errorMessage = err?.error?.message || 'We could not upload your profile photo.';
      }
    });
  }

  get initials(): string {
    const source = this.user?.name || this.profileForm.value.name || 'MB';
    return source
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0])
      .join('')
      .toUpperCase();
  }

  private loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.user = response.user;
        this.profileForm.patchValue({
          name: response.user.name,
          email: response.user.email
        });
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
      this.profileForm.patchValue({
        name: this.user?.name || '',
        email: this.user?.email || ''
      });
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
