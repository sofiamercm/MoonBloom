import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges(); // ← fuerza el re-render
      },
      error: (err) => {
        console.error('Error fetching cycle:', err);
        this.loading = false;
        this.error = 'Could not load the cycle. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    const payload = { ...this.cycle };

    if (!payload.startDate) {
      this.error = 'Start date is required.';
      return;
    }

    if (!payload.endDate) payload.endDate = null;
    payload.durationDays = payload.durationDays ? Number(payload.durationDays) : null;

    this.cycleService.updateCycle(this.cycleId, payload).subscribe({
      next: () => {
        this.router.navigate(['/calendario']);
      },
      error: (err) => {
        this.error = Array.isArray(err.error?.errors)
          ? err.error.errors.join(', ')
          : err.error?.message || 'Error updating the cycle.';
        console.error('Error updating cycle:', err);
      }
    });
  }
}