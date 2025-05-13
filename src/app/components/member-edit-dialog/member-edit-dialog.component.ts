import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';
import { MemberService } from '../../common/services/member.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-member-edit-dialog',
  templateUrl: './member-edit-dialog.component.html',
  styleUrls: ['./member-edit-dialog.component.scss'],
})
export class MemberEditDialogComponent implements OnInit {
  memberForm: FormGroup;
  statuses = ['ACTIVE', 'INACTIVE'];
  jobTitles = [
    'Associate Consultant',
    'Consultant',
    'Senior Consultant',
    'Manager',
    'Director',
    'Vice President',
  ];
  roles = [
    { id: 6, name: 'Partner' },
    { id: 5, name: 'Manager' },
    { id: 4, name: 'Director' },
    { id: 3, name: 'VP/SVP' },
    { id: 2, name: 'Admin' },
  ];
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: any },
    private toastService: ToastService,
    private memberService: MemberService
  ) {
    // Get the role ID as a number
    const roleId =
      typeof data.member.role === 'number'
        ? data.member.role
        : parseInt(data.member.role) || 6;

    // Initialize the form with just the editable fields
    this.memberForm = this.fb.group({
      jobTitle: [data.member.jobTitle, Validators.required],
      managerEmail: [data.member.manager_email, Validators.required],
      status: [data.member.status, Validators.required],
      roleId: [roleId, Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // Create the update data object
      const updateData = {
        jobTitle: this.memberForm.value.jobTitle,
        manager_email: this.memberForm.value.managerEmail, // Use manager_email for clarity
        status: this.memberForm.value.status,
        roleId: this.memberForm.value.roleId,
      };

      this.memberService
        .updateMember(this.data.member.member_employee_id, updateData)
        .pipe(
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response && response.success) {
              this.toastService.success('Member updated successfully');
              this.dialogRef.close(true);
            } else {
              this.errorMessage = response.error || 'Failed to update member';
              this.toastService.error(this.errorMessage);
            }
          },
          error: (err) => {
            this.errorMessage =
              err.error?.message || 'An unexpected error occurred';
            this.toastService.error(this.errorMessage);
          },
        });
    } else {
      this.memberForm.markAllAsTouched();
      this.toastService.warning(
        'Please fill out all required fields correctly'
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
