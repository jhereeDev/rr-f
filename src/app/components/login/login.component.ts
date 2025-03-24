import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsDialogComponent } from '../terms-dialog/terms-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConsentService } from '../../common/services/consent.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog,
    private consentService: ConsentService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  onTermsChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.openTermsDialog();
    }
  }

  openTermsDialog(): void {
    const dialogRef = this.dialog.open(TermsDialogComponent, {
      width: '600px',
      maxHeight: '80vh',
      autoFocus: true,
      restoreFocus: true,
      role: 'dialog',
      ariaLabel: 'Terms and Conditions',
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        const termsControl = this.loginForm.get('termsAccepted');
        if (termsControl) {
          termsControl.setValue(result === true);
        }

        // Ensure the checkbox keeps focus after dialog closes
        const checkbox = document.querySelector(
          'mat-checkbox input'
        ) as HTMLElement;
        if (checkbox) {
          checkbox.focus();
        }
      });
  }

  login(loginData: User) {
    this.auth.login(loginData).subscribe({
      next: (res) => {
        if (res && res.success) {
          const consents = this.consentService.getStoredConsents();
          if (consents) {
            // Log consents after successful login
            this.consentService.logConsent(consents).subscribe({
              next: () => {
                this.router.navigateByUrl('/home');
                const hide = res.user.hidePopup === 0 ? 'false' : 'true';
                localStorage.setItem('hidePopup', hide);
                // Clear consents after successful logging
                this.consentService.clearConsents();
              },
              error: (error) => {
                console.error('Error logging consents:', error);
                this.loginError = 'Error saving consent data';
              },
            });
          } else {
            // Logout if somehow logged in without consents
            this.auth.logout().subscribe();
          }
        } else {
          this.loginError = 'Invalid credentials. Please try again.';
        }
      },
      error: ({ error }) => {
        this.loginError = error.error;
      },
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      const user = new User(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      this.login(user);
    } else {
      this.loginError = 'Please fill in all required fields.';
    }
  }
}
