// common/services/admin.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all admin users
  getAllAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, {
      withCredentials: true,
    });
  }

  // Create a new admin user
  createAdmin(adminData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, adminData, {
      withCredentials: true,
    });
  }

  // Update admin status (activate/deactivate)
  updateAdminStatus(adminId: number, status: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/admin/users/${adminId}/status`,
      { status },
      {
        withCredentials: true,
      }
    );
  }

  // Reset admin password
  resetAdminPassword(adminId: number, newPassword: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/admin/users/${adminId}/password`,
      { password: newPassword },
      {
        withCredentials: true,
      }
    );
  }
}