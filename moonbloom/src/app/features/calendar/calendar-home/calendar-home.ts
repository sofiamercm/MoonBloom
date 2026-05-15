import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CycleService } from '../../../core/services/cycle';

@Component({
  selector: 'app-calendar-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calendar-home.html',
  styleUrls: ['./calendar-home.scss']
})
export class CalendarHomeComponent implements OnInit {
  cycles: any[] = [];
  loading = true;
  errorMessage = '';
  deletingCycleId = '';

  constructor(
    private cycleService: CycleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCycles();
  }

  loadCycles(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cycleService.getCycles().subscribe({
      next: (data: any) => {
        this.cycles = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      error: (err) => {
        console.error('Error fetching cycles:', err);
        this.errorMessage = err?.error?.message || 'Error loading cycles.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCycle(cycle: any): void {
    if (!cycle?._id) return;

    const confirmed = window.confirm('Delete this cycle?');
    if (!confirmed) return;

    this.deletingCycleId = cycle._id;
    this.errorMessage = '';

    this.cycleService.deleteCycle(cycle._id).subscribe({
      next: () => {
        this.cycles = this.cycles.filter((item) => item._id !== cycle._id);
        this.deletingCycleId = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting cycle:', err);
        this.errorMessage = err?.error?.message || 'Error deleting cycle.';
        this.deletingCycleId = '';
        this.cdr.detectChanges();
      }
    });
  }
}
