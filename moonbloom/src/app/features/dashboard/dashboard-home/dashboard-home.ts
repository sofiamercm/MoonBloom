import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHomeComponent implements OnInit {

  user = { name: '' };
  totalCycles = 0;
  totalLogs = 0;
  lastLog: any = null;
  lastCycle: any = null;

  moodMap: Record<string, string> = {
    'feliz':     '😊 Happy',
    'tranquila': '😌 Calm',
    'triste':    '😔 Sad',
    'enojada':   '😤 Angry',
    'cansada':   '😴 Tired',
    'ansiosa':   '😰 Anxious',
    'sensible':  '🥺 Sensitive',
    'normal':    '😐 Neutral'
  };

  private platformId = inject(PLATFORM_ID);

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }

    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        if (data.user) {
          this.user = data.user;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
        this.totalCycles = data.totalCycles || 0;
        this.totalLogs = data.totalLogs || 0;
        this.lastLog = data.lastLog || null;
        this.lastCycle = data.lastCycle || null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
      }
    });
  }
}