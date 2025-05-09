// updated member-add-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';
import { MemberService } from '../../common/services/member.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-member-add-dialog',
  templateUrl: './member-add-dialog.component.html',
  styleUrls: ['./member-add-dialog.component.scss'],
})
export class MemberAddDialogComponent implements OnInit {
  memberForm: FormGroup;
  statuses = ['ACTIVE', 'INACTIVE'];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberAddDialogComponent>,
    private toastService: ToastService,
    private memberService: MemberService
  ) {
    this.memberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, status } = this.memberForm.value;

      this.memberService.addMemberByEmail(email, status)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response && response.success) {
              this.toastService.success(response.message || 'Member added successfully');
              this.dialogRef.close(response);
            } else {
              this.errorMessage = response.error || 'Failed to add member';
              this.toastService.error(this.errorMessage);
            }
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'An unexpected error occurred';
            this.toastService.error(this.errorMessage);
          }
        });
    } else {
      this.memberForm.markAllAsTouched();
      this.toastService.warning('Please fill out all required fields correctly');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}