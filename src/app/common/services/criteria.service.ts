import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CriteriaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCriterias(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getCriteria(id: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getCriteriaByCategory(category: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/criterias/search/category`,
        { category },
        { withCredentials: true }
      )
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getCriteriaByDirector(director: boolean): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/director/${director}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
