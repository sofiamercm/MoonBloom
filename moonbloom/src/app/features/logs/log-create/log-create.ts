import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cycleService.getCycles().subscribe({
      next: (data: any) => {
        this.cycles = data;
      },
      error: (err) => {
        console.error('Error fetching cycles:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.log.cycleId) {
      this.error = 'Por favor, selecciona un ciclo asociado.';
      return;
    }

    const payload = { ...this.log };
    
    // Transformar flow de string a número
    if (payload.flow) {
      payload.flow = Number(payload.flow);
    } else {
      delete payload.flow;
    }

    // Transformar symptoms de "a, b" a ["a", "b"]
    if (typeof payload.symptoms === 'string' && payload.symptoms.trim() !== '') {
      payload.symptoms = payload.symptoms.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    } else {
      payload.symptoms = [];
    }

    // Limpiar mood si está vacío
    if (!payload.mood) {
      delete payload.mood;
    }

    this.dailyLogService.createLog(payload).subscribe({
      next: () => {
        this.router.navigate(['/calendario']);
      },
      error: (err) => {
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.error = err.error.errors.join(', ');
        } else {
          this.error = err.error?.message || 'Error al guardar el registro';
        }
        console.error('Error creating log:', err);
      }
    });
  }
}
