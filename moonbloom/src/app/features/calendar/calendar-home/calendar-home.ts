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

  constructor(
    private cycleService: CycleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cycleService.getCycles().subscribe({
      next: (data: any) => {
        this.cycles = data;
        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      error: (err) => {
        console.error('Error fetching cycles:', err);
      }
    });
  }
}
