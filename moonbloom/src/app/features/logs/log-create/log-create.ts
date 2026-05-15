import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CycleService } from '../../../core/services/cycle';
import { DailyLogService } from '../../../core/services/daily-log.service';

@Component({
  selector: 'app-log-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './log-create.html',
  styleUrls: ['./log-create.scss']
})
export class LogCreateComponent implements OnInit {
  cycles: any[] = [];
  error: string | null = null;
  loading = true;
  log: any = {
    cycleId: '',
    date: new Date().toISOString().slice(0, 10),
    mood: '',
    flow: null,
    symptoms: '',
    notes: ''
  };

  constructor(
    private cycleService: CycleService,
    private dailyLogService: DailyLogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cycleService.getCycles().subscribe({
      next: (data: any) => {
        this.cycles = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching cycles:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.log.cycleId) {
      this.error = 'Please select an associated cycle.';
      return;
    }

    const payload = { ...this.log };

    payload.flow = payload.flow ? Number(payload.flow) : undefined;

    payload.symptoms = typeof payload.symptoms === 'string' && payload.symptoms.trim()
      ? payload.symptoms.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      : [];

    if (!payload.mood) delete payload.mood;

    this.dailyLogService.createLog(payload).subscribe({
      next: () => {
        this.router.navigate(['/daily-logs']);
      },
      error: (err) => {
        console.error('Error details:', JSON.stringify(err.error));
        this.error = Array.isArray(err.error?.errors)
          ? err.error.errors.join(', ')
          : err.error?.message || 'Error saving the log.';
        console.error('Error creating log:', err);
      }
    });
  }
}
