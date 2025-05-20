import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RewardpointsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Submit reward entry
  submitRewardEntry(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/rewards`, formData, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  // Get reward entries
  getRewardEntries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rewards`, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  // Get reward entry by id
  getRewardEntry(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rewards/${id}`, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  // Update reward entry
  updateRewardEntry(id: any, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/rewards/${id}`, formData, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  // Download reward entry attachment
  downloadAttachment(path: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rewards/download?path=${path}`, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  // Get reward entry by member logged in
  getRewardEntryByMember(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rewards/member`, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  // Director approve reward entry
  approveRewardEntry(id: number, status: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/rewards/${id}/appoval?status=${status}`,
      {},
      {
        responseType: 'json',
        withCredentials: true,
      }
    );
  }
}
