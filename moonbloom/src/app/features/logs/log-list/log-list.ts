import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DailyLogService } from '../../../core/services/daily-log.service';
import { DailyLog } from '../../../shared/interfaces/dailylog.interface';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './log-list.html',
  styleUrl: './log-list.scss'
})
export class LogListComponent implements OnInit {

  logs: DailyLog[] = [];
  loading = true;
  errorMessage = '';
  deletingLogId = '';

  private platformId = inject(PLATFORM_ID);

  moodMap: Record<string, string> = {
    feliz: '😊 Happy',
    tranquila: '😌 Calm',
    triste: '😔 Sad',
    enojada: '😤 Angry',
    cansada: '😴 Tired',
    ansiosa: '😰 Anxious',
    sensible: '🥺 Sensitive',
    normal: '😐 Neutral'
  };

  constructor(
    private dailyLogService: DailyLogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading = false;
      return;
    }

    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dailyLogService.getLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading daily logs:', err);
        this.errorMessage = err?.error?.message || 'Error loading daily logs.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getMoodLabel(mood?: string): string {
    if (!mood) return 'No mood';
    return this.moodMap[mood] || mood;
  }

  deleteLog(log: DailyLog): void {
    if (!log._id) return;

    const confirmed = window.confirm('Delete this daily log?');
    if (!confirmed) return;

    this.deletingLogId = log._id;
    this.errorMessage = '';

    this.dailyLogService.deleteLog(log._id).subscribe({
      next: () => {
        this.logs = this.logs.filter((item) => item._id !== log._id);
        this.deletingLogId = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting daily log:', err);
        this.errorMessage = err?.error?.message || 'Error deleting daily log.';
        this.deletingLogId = '';
        this.cdr.detectChanges();
      }
    });
  }
}
