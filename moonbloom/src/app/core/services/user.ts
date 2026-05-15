import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';
  private authUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getCurrentUser(): Observable<{ success: boolean; user: User }> {
    return this.http.get<{ success: boolean; user: User }>(
      `${this.authUrl}/me`,
      { withCredentials: true }
    );
  }

  updateCurrentUserName(name: string): Observable<{ success: boolean; user: User }> {
    return this.http.patch<{ success: boolean; user: User }>(
      `${this.apiUrl}/profile`,
      { name },
      { withCredentials: true }
    );
  }
}
