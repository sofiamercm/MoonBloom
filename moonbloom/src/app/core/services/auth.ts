import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API_URL = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/login`,
      credentials,
      { withCredentials: true }
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/register`,
      data,
      { withCredentials: true }
    );
  }
}