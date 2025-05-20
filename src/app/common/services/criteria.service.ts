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

  // PARTNER CRITERIA METHODS

  /**
   * Get all published partner criteria
   */
  getAllPartnerCriteria(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/partner/published`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Get all draft partner criteria
   */
  getAllPartnerCriteriaDraft(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/partner/drafts`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Publish Partner Criteria
   */
  publishPartnerCriteria(id: number): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/criterias/partner/${id}/publish`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Get a specific partner criteria by ID
   */
  getPartnerCriteria(id: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/partner/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Add a new partner criteria (published)
   */
  addPartnerCriteria(criteria: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/partner`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Add a new partner criteria draft
   */
  addPartnerCriteriaDraft(criteria: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/partner`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing partner criteria (published)
   */
  updatePartnerCriteria(id: number, criteria: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/criterias/partner/${id}`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing partner criteria draft
   */
  updatePartnerCriteriaDraft(id: number, criteria: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/criterias/partner/draft/${id}`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a partner criteria (published)
   */
  deletePartnerCriteria(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/criterias/partner/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a partner criteria draft
   */
  deletePartnerCriteriaDraft(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/criterias/partner/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Upload partner criteria via Excel file (published)
   */
  uploadPartnerCriteria(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/partner/upload`, formData, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Upload partner criteria drafts via Excel file
   */
  uploadPartnerCriteriaDraft(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/partner/draft/upload`, formData, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Publish all partner criteria drafts
   */
  publishAllPartnerCriteria(): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/criterias/partner/publish-all`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  // MANAGER CRITERIA METHODS

  /**
   * Get all published manager criteria
   */
  getAllManagerCriteria(
    guidelines: boolean = true,
    member_job_title: string = 'manager consulting delivery'
  ): Observable<any> {
    return this.http
      .get(
        `${this.apiUrl}/criterias/manager/published?guidelines=${guidelines}&member_job_title=${member_job_title}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Get all draft manager criteria
   */
  getAllManagerCriteriaDraft(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/manager/drafts`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Get a specific manager criteria by ID
   */
  getManagerCriteria(id: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/manager/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Add a new manager criteria (published)
   */
  addManagerCriteria(criteria: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/manager`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Add a new manager criteria draft
   */
  addManagerCriteriaDraft(criteria: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/manager/draft`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing manager criteria (published)
   */
  updateManagerCriteria(id: number, criteria: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/criterias/manager/${id}`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing manager criteria draft
   */
  updateManagerCriteriaDraft(id: number, criteria: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/criterias/manager/draft/${id}`, criteria, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a manager criteria (published)
   */
  deleteManagerCriteria(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/criterias/manager/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a manager criteria draft
   */
  deleteManagerCriteriaDraft(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/criterias/manager/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Upload manager criteria via Excel file (published)
   */
  uploadManagerCriteria(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/manager/upload`, formData, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Upload manager criteria drafts via Excel file
   */
  uploadManagerCriteriaDraft(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/criterias/manager/draft/upload`, formData, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Publish a specific manager criteria draft
   */
  publishManagerCriteria(id: number): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/criterias/manager/${id}/publish`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Publish all manager criteria drafts
   */
  publishAllManagerCriteria(): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/criterias/manager/publish-all`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

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

  getCriteriasGuidelines(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/criterias/guidelines`, {
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
