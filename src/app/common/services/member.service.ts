// member.service.ts with enhanced methods
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all members with optional filtering
   */
  getMembers(filters?: any): Observable<any> {
    let url = `${this.apiUrl}/members`;

    // Add query parameters for filters if provided
    if (filters) {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.set('status', filters.status);
      if (filters.role_id) queryParams.set('role_id', filters.role_id);
      if (filters.search) queryParams.set('search', filters.search);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    return this.http
      .get(url, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => {
          // Transform the response if needed
          if (response.success && response.data) {
            return response.data.map((member: any) => ({
              id: member.id || member.member_employee_id,
              firstName: member.member_firstname,
              lastName: member.member_lastname,
              jobTitle: member.member_title,
              department: member.department || 'PH022: Philippines Operations',
              manager: member.member_manager_id,
              director: member.member_director_id,
              status: member.member_status,
              email: member.member_email,
              role: member.role_id,
            }));
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error fetching members:', error);
          return throwError(
            () => new Error('Failed to fetch members. Please try again.')
          );
        })
      );
  }

  /**
   * Get member by ID
   */
  getMember(id: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/members/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            const member = response.data;
            return {
              id: member.id || member.member_employee_id,
              firstName: member.member_firstname,
              lastName: member.member_lastname,
              jobTitle: member.member_title,
              department: member.department || 'PH022: Philippines Operations',
              manager: member.member_manager_id,
              director: member.member_director_id,
              status: member.member_status,
              email: member.member_email,
              role: member.role_id,
            };
          }
          return null;
        }),
        catchError((error) => {
          console.error(`Error fetching member ${id}:`, error);
          return throwError(
            () => new Error('Failed to fetch member details. Please try again.')
          );
        })
      );
  }

  /**
   * Add a new member
   */
  addMember(memberData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/members`, memberData, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error adding member:', error);
          return throwError(
            () => new Error('Failed to add member. Please try again.')
          );
        })
      );
  }

  /**
   * Update a member
   */
  updateMember(id: string, memberData: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/members/${id}`, memberData, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(`Error updating member ${id}:`, error);
          return throwError(
            () => new Error('Failed to update member. Please try again.')
          );
        })
      );
  }

  /**
   * Map members (sync with LDAP)
   */
  mapMembersHierarchy(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/members/map-hierarchy`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error mapping members:', error);
          return throwError(
            () => new Error('Failed to sync member mapping. Please try again.')
          );
        })
      );
  }

  /**
   * Get member's reward entries
   */
  getMemberRewardEntries(memberId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/rewards/member/${memberId}`, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => {
          if (response.success && response.rewards) {
            return response.rewards.map((entry: any) => ({
              id: entry.id,
              category: entry.category || 'Clients',
              accomplishment: entry.accomplishment || entry.short_description,
              points: entry.points || 0,
              shortDescription: entry.short_description,
              status: this.getEntryStatus(entry),
              date: entry.date_accomplished || entry.created_at,
              notes: entry.notes || 'No notes',
              attachments: this.formatAttachments(entry.attachments),
            }));
          }
          return [];
        }),
        catchError((error) => {
          console.error(
            `Error fetching reward entries for member ${memberId}:`,
            error
          );
          return throwError(
            () => new Error('Failed to fetch reward entries. Please try again.')
          );
        })
      );
  }

  /**
   * Helper method to determine entry status
   */
  private getEntryStatus(entry: any): string {
    if (
      entry.manager_approval_status === 'rejected' ||
      entry.director_approval_status === 'rejected'
    ) {
      return 'Rejected';
    } else if (
      entry.manager_approval_status === 'approved' &&
      entry.director_approval_status === 'approved'
    ) {
      return 'Approved';
    } else {
      return 'Pending';
    }
  }

  /**
   * Helper method to format attachments
   */
  private formatAttachments(attachments: any): any[] {
    if (!attachments) return [];

    if (Array.isArray(attachments)) {
      return attachments.map((attachment) => ({
        filename: attachment.filename,
        path: attachment.path,
        type: this.getFileType(attachment.filename),
      }));
    }

    // If attachments is a string (semicolon-separated)
    if (typeof attachments === 'string') {
      return attachments
        .split(';')
        .filter((a) => a)
        .map((filename) => ({
          filename,
          path: filename, // The path might need to be constructed differently
          type: this.getFileType(filename),
        }));
    }

    return [];
  }

  /**
   * Helper method to determine file type
   */
  private getFileType(filename: string): string {
    if (!filename) return 'unknown';

    const extension = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension || ''))
      return 'image';
    return 'document';
  }
}
