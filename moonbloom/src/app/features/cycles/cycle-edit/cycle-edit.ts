import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CycleService } from '../../../core/services/cycle';

@Component({
  selector: 'app-cycle-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cycle-edit.html',
  styleUrls: ['../cycle-create/cycle-create.scss']
})
export class CycleEditComponent implements OnInit {
  error: string | null = null;
  loading: boolean = true;
  cycleId: string = '';
  cycle: any = {
    startDate: '',
    endDate: '',
    durationDays: null,
    notes: ''
  };

  constructor(
    private cycleService: CycleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cycleId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.cycleId) {
      this.router.navigate(['/calendario']);
      return;
    }

    this.cycleService.getCycleById(this.cycleId).subscribe({
      next: (data: any) => {
        this.cycle = {
          startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 10) : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 10) : '',
          durationDays: data.durationDays || null,
          notes: data.notes || ''
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching cycle:', err);
        this.router.navigate(['/calendario']);
      }
    });
  }

  onSubmit(): void {
    const payload = { ...this.cycle };

    if (!payload.startDate) {
      this.error = 'La fecha de inicio es obligatoria.';
      return;
    }

    if (!payload.endDate) {
      payload.endDate = null;
    }

    if (payload.durationDays) {
      payload.durationDays = Number(payload.durationDays);
    } else {
      payload.durationDays = null;
    }

    this.cycleService.updateCycle(this.cycleId, payload).subscribe({
      next: () => {
        this.router.navigate(['/calendario']);
      },
      error: (err) => {
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.error = err.error.errors.join(', ');
        } else {
          this.error = err.error?.message || 'Error al actualizar el ciclo';
        }
        console.error('Error updating cycle:', err);
      }
    });
  }
}
