import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyLogService {

  private API_URL = 'http://localhost:3000/api/dailylogs';

  constructor(private http: HttpClient) {}

  createLog(log: any): Observable<any> {
    return this.http.post(this.API_URL, log, { withCredentials: true });
  }
}
