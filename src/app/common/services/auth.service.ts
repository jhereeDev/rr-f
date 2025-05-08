import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any = null;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

    // Regular user login
    login(loginData: User): Observable<any> {
      return this.http.post<User>(
        `${this.apiUrl}/auth`,
        {
          email: loginData.email,
          password: loginData.password,
        },
        {
          withCredentials: true,
          responseType: 'json',
        }
      );
    }

    // Admin login
    loginAdmin(loginData: User): Observable<any> {
      return this.http.post<User>(
        `${this.apiUrl}/auth`,
        {
          email: loginData.email,
          password: loginData.password,
          isAdmin: true, // Add admin flag
        },
        {
          withCredentials: true,
          responseType: 'json',
        }
      );
    }

    // Validate token saved in cookies
    validateToken(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/auth/user`, {
        withCredentials: true,
        responseType: 'json',
      });
    }

    // Logout
    logout() {
      return this.http.delete<any>(`${this.apiUrl}/auth`, {
        withCredentials: true,
        responseType: 'json',
      });
    }

  // Change Password
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/auth/change-password`, data, {
      withCredentials: true,
      responseType: 'json',
    });
  }
}
