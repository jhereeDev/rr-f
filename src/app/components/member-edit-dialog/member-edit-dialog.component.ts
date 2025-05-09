// Updated member-edit-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';

interface Manager {
  email: string;
  directorEmail: string;
}

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
    'Director',
    'Vice President',
  ];
  roles = ['Partner', 'Admin', 'Manager', 'Director'];

  // Map of managers to their directors (mock data)
  managerToDirectorMap: { [key: string]: string } = {
    'john.nunez@cgi.com': 'ronwald.king@cgi.com',
    'jane.doe@cgi.com': 'richard.roe@cgi.com',
    'sarah.smith@cgi.com': 'michael.brown@cgi.com'
  };

  directorEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: any },
    private toastService: ToastService
  ) {
    // Initialize the form with just the editable fields
    this.memberForm = this.fb.group({
      jobTitle: [data.member.jobTitle, Validators.required],
      manager: [data.member.manager, Validators.required],
      status: [data.member.status, Validators.required],
      role: [data.member.role || 'Partner', Validators.required],
    });

    // Set initial director value based on the current manager
    this.directorEmail = this.getDirectorForManager(data.member.manager);
  }

  ngOnInit(): void {
    // Listen for changes to the manager field to update director automatically
    this.memberForm.get('manager')?.valueChanges.subscribe(managerEmail => {
      this.directorEmail = this.getDirectorForManager(managerEmail);
    });
  }

  /**
   * Get the director email for a given manager email
   * In a real app, this would make an API call to the backend
   */
  getDirectorForManager(managerEmail: string): string {
    // Return the mapped director or a default value
    return this.managerToDirectorMap[managerEmail] || 'Not found';
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      // Add the director email to the form data for submission
      const formData = {
        ...this.memberForm.value,
        director: this.directorEmail
      };

      // Here you would call the service to update the member
      this.dialogRef.close(formData);
    } else {
      this.memberForm.markAllAsTouched();
      this.toastService.warning('Please fill out all required fields correctly');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}