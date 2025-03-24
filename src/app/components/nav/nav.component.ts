import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  user: any = null;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is logged in
    this.auth.validateToken().subscribe((res) => {
      if (res && res.success) {
        this.user = res.user;
      }
    });
  }

  // Logout user
  logout() {
    this.auth.logout().subscribe((res) => {
      this.user = null;
      this.router.navigate(['/login']);
    });
    localStorage.setItem('firstLogin', 'true');
    localStorage.removeItem('hidePopup');
  }
}
