import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHomeComponent {

  // TEMPORAL
  // después aquí conectaremos el backend

  user = {
    name: ''
  };

  totalCycles = 0;

  totalLogs = 0;

  lastLog: any = null;

  lastCycle: any = null;

}