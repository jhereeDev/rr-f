import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { ToastService } from '../../common/services/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isSubmitting = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
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
      this.errorMessage = ''; // Clear any previous error messages
      const payload = {
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        confirmPassword: this.changePasswordForm.value.confirmPassword
      };

      const userId = this.authService.getCurrentUserId();

      this.authService.changePassword(userId, payload).subscribe(
        (response: any) => {
          this.isSubmitting = false;
          this.toastService.success('Password changed successfully');
          this.router.navigate(['/home']);
        },
        (error: any) => {
          this.isSubmitting = false;
          console.log(error);
          this.errorMessage = error.error.error || 'Failed to change password';
          this.toastService.error(this.errorMessage);
        }
      );
    } else {
      this.changePasswordForm.markAllAsTouched();
      this.toastService.warning('Please fill out all required fields correctly');
    }
  }
}
