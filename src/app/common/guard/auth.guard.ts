import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  UrlSegment,
  Route,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.checkAuth(state.url, route.data['roles']);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    return this.checkAuth(
      segments.map((s) => s.path).join('/'),
      route.data?.['roles']
    );
  }

  private checkAuth(
    url: string,
    roles?: number[]
  ): Observable<boolean | UrlTree> {
    return this.auth.validateToken().pipe(
      tap((res: any) => {
        if (res && res.success) {
          this.auth.user = res.user;
        }
      }),
      map((res: any) => {
        if (res && res.success) {
          if (url === '/login') {
            return this.router.createUrlTree([res.user.role_id === 1 ? '/admin' : '/home']);
          }

          if (url.startsWith('/admin') && res.user.role_id !== 1) {
            return this.router.createUrlTree(['/home']);
          }

          if (!url.startsWith('/admin') && res.user.role_id === 1) {
            return this.router.createUrlTree(['/admin']);
          }

          if (roles && roles.length > 0) {
            if (roles.includes(this.auth.user.role_id)) {
              return true;
            } else {
              return this.router.createUrlTree([res.user.role_id === 1 ? '/admin' : '/home']);
            }
          }
          return true;
        } else {
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: url },
          });
        }
      }),
      catchError((error) => {
        console.error('Authentication error:', error);
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}
