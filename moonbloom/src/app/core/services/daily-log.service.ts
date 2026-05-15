import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyLog } from '../../shared/interfaces/dailylog.interface';

@Injectable({
  providedIn: 'root'
})
export class DailyLogService {

  private API_URL = 'http://localhost:3000/api/dailylogs';

  constructor(private http: HttpClient) {}

  getLogs(): Observable<DailyLog[]> {
    return this.http.get<DailyLog[]>(
      `${this.API_URL}?t=${new Date().getTime()}`,
      { withCredentials: true }
    );
  }

  createLog(log: any): Observable<any> {
    return this.http.post(this.API_URL, log, { withCredentials: true });
  }

  deleteLog(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.API_URL}/${id}`,
      { withCredentials: true }
    );
  }
}
