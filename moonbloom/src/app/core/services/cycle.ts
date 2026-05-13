import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CycleService {

  private API_URL = `${environment.apiUrl}/cycles`;

  constructor(private http: HttpClient) {}

  getCycles() {
    // Agregar timestamp para evitar caché del navegador
    return this.http.get(`${this.API_URL}?t=${new Date().getTime()}`, { withCredentials: true });
  }

  createCycle(cycle: any) {
    return this.http.post(this.API_URL, cycle, { withCredentials: true });
  }

  getCycleById(id: string) {
    return this.http.get(`${this.API_URL}/${id}`, { withCredentials: true });
  }

  updateCycle(id: string, cycle: any) {
    return this.http.put(`${this.API_URL}/${id}`, cycle, { withCredentials: true });
  }
}