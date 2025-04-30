// member-edit-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';

@Component({
  selector: 'app-member-edit-dialog',
  templateUrl: './member-edit-dialog.component.html',
  styleUrls: ['./member-edit-dialog.component.scss'],
})
export class MemberEditDialogComponent implements OnInit {
  memberForm: FormGroup;
  statuses = ['Active', 'Inactive', 'New Joiner'];
  jobTitles = [
    'Associate Consultant',
    'Consultant',
    'Senior Consultant',
    'Manager',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: any },
    private toastService: ToastService
  ) {
    this.memberForm = this.fb.group({
      jobTitle: [data.member.jobTitle, Validators.required],
      manager: [data.member.manager, Validators.required],
      director: [data.member.director, Validators.required],
      status: [data.member.status, Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.memberForm.valid) {
      // Here you would call the service to update the member
      this.dialogRef.close(this.memberForm.value);
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
