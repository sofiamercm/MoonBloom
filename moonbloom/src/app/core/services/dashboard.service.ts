import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/users/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.API_URL}?t=${new Date().getTime()}`, { withCredentials: true });
  }
}
