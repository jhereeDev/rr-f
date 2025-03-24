import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all leaderboards
  getLeaderboards(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboards`, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  // Get a leaderboard by id
  getLeaderboard(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboards/${id}`, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  // Get a leaderboard by alias name
  getLeaderboardByAliasName(aliasName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboards/alias/${aliasName}`, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  // Get a leaderboard by role
  getLeaderboardByRole(role: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboards/role/${role}`, {
      withCredentials: true,
      responseType: 'json',
    });
  }
}
