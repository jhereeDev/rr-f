// member.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all members
   */
  getMembers(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/members`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching members:', error);
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Get member by ID
   * @param id Member ID
   */
  getMember(id: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/members/${id}`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error(`Error fetching member ${id}:`, error);
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Add a new member
   * @param memberData Member data to add
   */
  addMember(memberData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/members`, memberData, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding member:', error);
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Update a member
   * @param id Member ID
   * @param memberData Updated member data
   */
  updateMember(id: number, memberData: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/members/${id}`, memberData, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error(`Error updating member ${id}:`, error);
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Sync member mapping - pulls latest data from LDAP
   */
  syncMemberMapping(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/members/sync`,
        {},
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error syncing member mapping:', error);
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Get reward entries for a specific member
   * @param memberId Member ID
   */
  getMemberRewardEntries(memberId: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/members/${memberId}/rewards`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error(
            `Error fetching reward entries for member ${memberId}:`,
            error
          );
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Update member status
   * @param id Member ID
   * @param status New status
   */
  updateMemberStatus(id: number, status: string): Observable<any> {
    return this.http
      .patch(
        `${this.apiUrl}/members/${id}/status`,
        { status },
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((error) => {
          console.error(`Error updating status for member ${id}:`, error);
          return of({ success: false, error: error.message });
        })
      );
  }
}
