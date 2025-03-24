import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './common/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'rewards-recog';
  isLoggedIn: boolean = false;

  constructor(public router: Router, private auth: AuthService) {}

  // Check if user is logged in on app init
  ngOnInit() {
    // Subscribe to navigation events and filter for NavigationEnd
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.auth.validateToken().subscribe((res) => {
          if (res) {
            this.isLoggedIn = true;

            // Redirect if logged in and on the login page
            if (this.router.url === '/login') {
              this.router.navigateByUrl('/home'); // Redirect to home or another protected route
            }
          } else {
            this.isLoggedIn = false;

            // Redirect to login if not logged in and not on the login page
            if (this.router.url !== '/login') {
              this.router.navigateByUrl('/login');
            }
          }
        });
      });
  }

  // Show nav if logged in and not on login page
  showNav(): boolean {
    return this.isLoggedIn && this.router.url !== '/login';
  }
}
