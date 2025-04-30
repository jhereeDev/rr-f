// member-add-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';

@Component({
  selector: 'app-member-add-dialog',
  templateUrl: './member-add-dialog.component.html',
  styleUrls: ['./member-add-dialog.component.scss'],
})
export class MemberAddDialogComponent implements OnInit {
  memberForm: FormGroup;
  statuses = ['Active', 'Inactive', 'New Joiner'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberAddDialogComponent>,
    private toastService: ToastService
  ) {
    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      manager: ['', Validators.required],
      director: ['', Validators.required],
      status: ['New Joiner', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.memberForm.valid) {
      // Here you would call the service to add the member
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
