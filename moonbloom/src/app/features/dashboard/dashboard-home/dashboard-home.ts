import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';

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

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        if (data.user) this.user = data.user;
        this.totalCycles = data.totalCycles || 0;
        this.totalLogs = data.totalLogs || 0;
        this.lastLog = data.lastLog || null;
        this.lastCycle = data.lastCycle || null;
        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      error: (err) => {
        console.error('Error cargando el dashboard:', err);
      }
    });
  }
}