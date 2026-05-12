import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CycleService } from '../../../core/services/cycle';

@Component({
  selector: 'app-cycle-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cycle-list.html',
  styleUrl: './cycle-list.scss'
})
export class CycleList {

  cycles: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private cycleService: CycleService) {}

  ngOnInit() {
    this.loadCycles();
  }

  loadCycles() {
    this.loading = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.cycleService.getCycles().subscribe({
        next: (data: any) => {
          this.cycles = data;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = 'Error loading cycles';
          this.loading = false;
        }
      });
    }, 0);
  }
}