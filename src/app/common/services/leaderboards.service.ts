import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all leaderboards
  getLeaderboards(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/leaderboards`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(catchError(this.handleError('getLeaderboards')));
  }

  // Get a leaderboard by id
  getLeaderboard(id: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/leaderboards/${id}`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(catchError(this.handleError(`getLeaderboard id=${id}`)));
  }

  // Get a leaderboard by alias name
  getLeaderboardByAliasName(aliasName: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/leaderboards/alias/${aliasName}`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        catchError(
          this.handleError(`getLeaderboardByAliasName alias=${aliasName}`)
        )
      );
  }

  // Get a leaderboard by role with optional top parameter for limiting results
  getLeaderboardByRole(role: number, top?: number): Observable<any> {
    let url = `${this.apiUrl}/leaderboards/role/${role}`;
    if (top) {
      url += `?top=${top}`;
    }

    return this.http
      .get(url, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        map((response) => {
          // Log response structure to help with debugging
          console.debug('Leaderboard API response:', response);
          return response;
        }),
        catchError(this.handleError(`getLeaderboardByRole role=${role}`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   */
  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      // Log the error to console
      console.error(`${operation} failed: ${error.message}`, error);

      // Let the app keep running by returning an empty result
      return of({
        success: false,
        error: error.message || `${operation} failed`,
      });
    };
  }
}
