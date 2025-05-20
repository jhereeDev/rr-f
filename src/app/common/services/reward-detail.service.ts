import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RewardDetailService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  /**
   * Get details of a specific reward entry
   * @param memberId The member ID
   * @param rewardId The reward ID
   */
  getRewardDetail(memberId: number, rewardId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/members/details/${memberId}/rewards/${rewardId}`, {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      tap(response => console.log('Reward detail response:', response)),
      catchError(error => {
        console.error(`Error fetching reward detail:`, error);
        this.toastService.error('Could not fetch reward details. Please try again.');
        throw error;
      })
    );
  }

  /**
   * Update a reward entry
   * @param memberId The member ID
   * @param rewardId The reward ID
   * @param data The updated reward data
   */
  updateRewardDetail(memberId: number, rewardId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/members/details/${memberId}/rewards/${rewardId}`, data, {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      tap(response => console.log('Update reward response:', response)),
      catchError(error => {
        console.error(`Error updating reward:`, error);
        this.toastService.error('Could not update reward. Please try again.');
        throw error;
      })
    );
  }

  /**
   * Download an attachment for a reward
   * @param attachmentPath The path to the attachment (can be a string or an object with a path property)
   */
  downloadAttachment(attachmentPath: string | any): Observable<Blob> {
    // Handle case where an object was passed instead of a string
    let path: string;

    if (typeof attachmentPath === 'string') {
      path = attachmentPath;
    } else if (attachmentPath && typeof attachmentPath === 'object' && attachmentPath.path) {
      // Extract the path from the object
      path = attachmentPath.path;
    } else {
      console.error('Invalid attachment path:', attachmentPath);
      throw new Error('Invalid attachment path');
    }

    return this.http.get(`${this.apiUrl}/rewards/download?path=${encodeURIComponent(path)}`, {
      withCredentials: true,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error(`Error downloading attachment:`, error);
        this.toastService.error('Could not download attachment. Please try again.');
        throw error;
      })
    );
  }

  /**
   * Upload an attachment for a reward
   * @param memberId The member ID
   * @param rewardId The reward ID
   * @param file The file to upload
   */
  uploadAttachment(memberId: number, rewardId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/members/details/${memberId}/rewards/${rewardId}/attachments`, formData, {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      tap(response => console.log('Upload attachment response:', response)),
      catchError(error => {
        console.error(`Error uploading attachment:`, error);
        this.toastService.error('Could not upload attachment. Please try again.');
        throw error;
      })
    );
  }
}