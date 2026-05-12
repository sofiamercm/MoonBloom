import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CycleService } from '../../../core/services/cycle';

@Component({
  selector: 'app-cycle-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cycle-create.html',
  styleUrls: ['./cycle-create.scss']
})
export class CycleCreateComponent {
  error: string | null = null;
  cycle: any = {
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    durationDays: null,
    notes: ''
  };

  constructor(
    private cycleService: CycleService,
    private router: Router
  ) {}

  onSubmit(): void {
    const payload = { ...this.cycle };

    if (!payload.startDate) {
      this.error = 'La fecha de inicio es obligatoria.';
      return;
    }

    if (!payload.endDate) {
      delete payload.endDate;
    }

    if (payload.durationDays) {
      payload.durationDays = Number(payload.durationDays);
    } else {
      delete payload.durationDays;
    }

    this.cycleService.createCycle(payload).subscribe({
      next: () => {
        this.router.navigate(['/calendario']);
      },
      error: (err) => {
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.error = err.error.errors.join(', ');
        } else {
          this.error = err.error?.message || 'Error al guardar el ciclo';
        }
        console.error('Error creating cycle:', err);
      }
    });
  }
}
