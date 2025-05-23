// Updated member.service.ts with enhanced functionality
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { ToastService } from './toast.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  /**
   * Get all members with optional filters
   * @param filters Optional filters for the query
   */
  getMembers(filters?: any): Observable<any> {
    let params = new HttpParams();

    // Add filters to query params if provided
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.append(key, filters[key]);
        }
      });
    }

    return this.http
      .get(`${this.apiUrl}/members`, {
        withCredentials: true,
        params,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          // Handle different response formats
          if (response && 'data' in response) {
            return {
              success: true,
              data: this.transformMemberData(response.data),
            };
          } else if (response && response.results) {
            return {
              success: true,
              data: this.transformMemberData(response.results),
            };
          } else if (Array.isArray(response)) {
            return {
              success: true,
              data: this.transformMemberData(response),
            };
          }

          // Fallback
          return {
            success: false,
            data: [],
            error: 'Unexpected response format',
          };
        }),
        catchError((error) => {
          console.error('Error fetching members:', error);
          this.toastService.error('Could not fetch members. Please try again.');
          return of({
            success: false,
            error: error.message || 'Failed to load members',
            data: [],
          });
        })
      );
  }

  /**
   * Transform API member data to consistent format
   */
  private transformMemberData(data: any[]): any[] {
    if (!Array.isArray(data)) {
      console.error('transformMemberData received non-array data:', data);
      return [];
    }

    return data.map((member) => ({
      id: member.id || member.member_employee_id || '',
      member_employee_id: member.member_employee_id || '',
      firstName: member.member_firstname || member.firstName || '',
      lastName: member.member_lastname || member.lastName || '',
      jobTitle: member.member_title || member.jobTitle || '',
      department: member.department || '',
      manager: member.member_manager_id || '',
      manager_email: member.member_manager_email || '',
      director: member.member_director_id || '',
      director_email: member.member_director_email || '',
      status: member.member_status || member.status || 'Active',
      email: member.member_email || member.email || '',
      role: member.role_id || member.role || 6,
    }));
  }

  /**
   * Get member by ID
   * @param id Member ID
   */
  getMember(id: number): Observable<any> {
    // Use the new API endpoint for member details
    return this.http
      .get(`${this.apiUrl}/members/details/${id}`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => response.data || response),
        catchError((error) => {
          console.error(`Error fetching member ${id}:`, error);
          this.toastService.error(
            'Could not fetch member details. Please try again.'
          );
          throw error;
        })
      );
  }

  /**
   * Get member by email address
   * @param email Member email address
   */
  getMemberByEmail(email: string): Observable<any> {
    // Use the lookup endpoint for email queries
    if (!email || email.trim() === '') {
      return of({
        success: false,
        data: null,
        error: 'Email is required',
      });
    }

    const url = `${this.apiUrl}/members/lookup?email=${encodeURIComponent(
      email
    )}`;

    return this.http
      .get(url, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => {
          if (response && (response.data || response.success)) {
            const memberData = response.data || response;
            return {
              success: true,
              data: memberData,
            };
          }
          return { success: false, data: null };
        }),
        catchError((error) => {
          console.error(`Error looking up member by email ${email}:`, error);
          return of({
            success: false,
            error: error.message || `Could not find member with email ${email}`,
            data: null,
          });
        })
      );
  }

  /**
   * Add a new member using email address
   * @param email Member's email address
   * @param status Member's status (ACTIVE/INACTIVE)
   */
  addMemberByEmail(email: string, status: string): Observable<any> {
    const memberData = {
      email,
      status,
    };

    return this.http
      .post(`${this.apiUrl}/members/by-email`, memberData, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding member by email:', error);
          const errorMessage =
            error.error?.message || 'Could not add member. Please try again.';
          this.toastService.error(errorMessage);
          return of({
            success: false,
            error: errorMessage,
          });
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
          this.toastService.error('Could not update member. Please try again.');
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Update member status
   * @param id Member ID
   * @param status New status (ACTIVE/INACTIVE)
   */
  updateMemberStatus(id: any, status: string): Observable<any> {
    return this.http
      .put(
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
          this.toastService.error(
            'Could not update member status. Please try again.'
          );
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Sync member mapping with LDAP data
   * @param placeholder The role placeholder to search for in LDAP (DIRECTOR, MANAGER, CONSULTANT)
   * @returns Observable with the mapping results
   */
  syncMemberMapping(placeholder: string = 'CONSULTANT'): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/users/map`,
        { placeholder }, // Pass the placeholder as part of the request body
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          console.error(
            `Error syncing member mapping for ${placeholder}:`,
            error
          );

          // Return a structured error object
          return of({
            success: false,
            error:
              error.message ||
              `Unknown error during ${placeholder} synchronization`,
            stats: error.error?.stats || {
              total: 0,
              created: 0,
              updated: 0,
              skipped: 0,
              failed: 1,
            },
          });
        })
      );
  }

  /**
   * Map members hierarchy (alternative method that calls a different endpoint)
   * This method is kept for backward compatibility
   */
  mapMembersHierarchy(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/members/map-hierarchy`,
        {},
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error mapping member hierarchy:', error);
          this.toastService.error(
            'Error mapping member hierarchy. Please try again.'
          );
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Get reward entries for a specific member
   * @param memberId Member ID
   */
  getMemberRewardEntries(memberId: number): Observable<any> {
    // Use the new API endpoint for member reward entries
    return this.http
      .get(`${this.apiUrl}/members/details/${memberId}/rewards`, {
        withCredentials: true,
        responseType: 'json',
      })
      .pipe(
        map((response: any) => response.data || response),
        catchError((error) => {
          console.error(
            `Error fetching reward entries for member ${memberId}:`,
            error
          );
          this.toastService.error(
            'Could not fetch reward entries. Please try again.'
          );
          throw error;
        })
      );
  }

  /**
   * Update a specific reward entry
   * @param memberId Member ID
   * @param rewardId Reward entry ID
   * @param data Updated data for the reward entry
   */
  updateMemberRewardEntry(
    memberId: number,
    rewardId: number,
    data: any
  ): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/members/details/${memberId}/rewards/${rewardId}`,
        data,
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((error) => {
          console.error(`Error updating reward entry ${rewardId}:`, error);
          this.toastService.error(
            'Could not update reward entry. Please try again.'
          );
          throw error;
        })
      );
  }

  /**
   * Update a specific reward entry
   * @param memberId Member ID
   * @param rewardId Reward entry ID
   * @param data Updated data for the reward entry
   */
  adminUpdateMemberRewardEntry(
    rewardId: number,
    formData: any
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/rewards/admin/${rewardId}`, formData, {
      withCredentials: true,
      responseType: 'json',
    });
  }

  /**
   * Export members list to Excel
   * @returns Observable with the Excel file blob
   */
  exportMembersToExcel(): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/members/export`, {
        withCredentials: true,
        responseType: 'blob',
      })
      .pipe(
        catchError((error) => {
          console.error('Error exporting members:', error);
          this.toastService.error(
            'Could not export members. Please try again.'
          );
          throw error;
        })
      );
  }
}
