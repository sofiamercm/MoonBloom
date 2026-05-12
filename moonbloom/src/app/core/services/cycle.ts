import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CycleService {

  private API_URL = 'http://localhost:3000/cycles';

  constructor(private http: HttpClient) {}

  getCycles() {
    return this.http.get(this.API_URL);
  }

  createCycle(cycle: any) {
    return this.http.post(this.API_URL, cycle);
  }
}