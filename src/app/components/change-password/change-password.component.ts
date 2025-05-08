import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if new password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      const confirmPasswordControl = form.get('confirmPassword');
      if (confirmPasswordControl?.hasError('passwordMismatch')) {
        // Clear the error
        const errors = { ...confirmPasswordControl.errors };
        delete errors['passwordMismatch'];
        confirmPasswordControl.setErrors(
          Object.keys(errors).length ? errors : null
        );
      }
    }
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isSubmitting = true;
      const payload = {
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
      };

      this.authService.changePassword(payload).subscribe(
        (response: any) => {
          this.isSubmitting = false;
          this.snackBar.open('Password changed successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/home']);
        },
        (error: any) => {
          this.isSubmitting = false;
          this.snackBar.open(
            error.error.message || 'Failed to change password',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        }
      );
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
