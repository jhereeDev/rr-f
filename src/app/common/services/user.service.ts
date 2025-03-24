import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Hide popup
  hidePopup(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/users/hide_popup`,
      {},
      {
        withCredentials: true,
        responseType: 'json',
      }
    );
  }
}
