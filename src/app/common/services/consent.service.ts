import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export interface ConsentState {
  internal_publication_consent: boolean;
  personal_data_consent: boolean;
  rewards_management_consent: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private apiUrl = environment.apiUrl;
  private consentState = new BehaviorSubject<ConsentState | null>(null);
  currentConsent = this.consentState.asObservable();

  constructor(private http: HttpClient) {}

  setConsents(consents: ConsentState) {
    this.consentState.next(consents);
  }

  getStoredConsents(): ConsentState | null {
    return this.consentState.value;
  }

  clearConsents() {
    this.consentState.next(null);
  }

  logConsent(consents: ConsentState): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/consent/log`, consents, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getConsentStatus(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/consent/status`, {
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
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
