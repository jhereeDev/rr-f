import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all approval entries of current user
  getApprovals(): Observable<any> {
    return this.http.get(`${this.apiUrl}/approval/me`, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  // Get approval entry by id
  getApproval(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/approval/entry/${id}`, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  // Get all approval entries of logged in manager user
  // status: pending, approved, rejected
  getManagerApprovals(status?: any, managerId?: any): Observable<any> {
    let url = managerId
      ? `${this.apiUrl}/approval/manager?status=${status}&managerId=${managerId}`
      : `${this.apiUrl}/approval/manager?status=${status}`;
    return this.http.get(url, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  // Get all approval entries of logged in director user
  // status: pending, approved, rejected
  getDirectorApprovals(status?: any, directorId?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/approval/director?status=${status}`, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  // Approve or reject an reward points entry by id (only manager can approve or reject)
  // status: true for approve, false for reject
  approve(
    id: any,
    status: any,
    manager_notes: string = '',
    resubmitted: boolean = false
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/approval/manager/${id}?approve=${status}`,
      { manager_notes, resubmitted },
      {
        withCredentials: true,
        responseType: 'json',
      }
    );
  }

  // Approve or reject an reward points entry by id (only director can approve or reject)
  // status: true for approve, false for reject
  approveDirector(
    id: any,
    status: any,
    director_notes: string = ''
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/approval/director/${id}?approve=${status}`,
      { director_notes },
      {
        withCredentials: true,
        responseType: 'json',
      }
    );
  }
}
