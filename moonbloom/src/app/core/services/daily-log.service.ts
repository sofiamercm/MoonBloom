import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DailyLogService {

  private API_URL = `${environment.apiUrl}/dailylogs`;

  constructor(private http: HttpClient) {}

  createLog(log: any): Observable<any> {
    return this.http.post(this.API_URL, log, { withCredentials: true });
  }
}
