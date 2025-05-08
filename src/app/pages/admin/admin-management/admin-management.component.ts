// pages/admin-management/admin-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../common/services/toast.service';
import { AdminService } from '../../../common/services/admin.service';

interface Admin {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  status: string;
  last_login?: Date;
}

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
})
export class AdminManagementComponent implements OnInit {
  adminForm: FormGroup;
  admins: Admin[] = [];
  isLoading = false;
  displayedColumns: string[] = [
    'username',
    'name',
    'email',
    'status',
    'last_login',
    'actions',
  ];

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private adminService: AdminService
  ) {
    this.adminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading = true;
    this.adminService.getAllAdmins().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.admins = response.data;
        } else {
          this.toastService.error('Failed to load admin users');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading admins:', error);
        this.toastService.error('Error loading admin users');
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.isLoading = true;
      const adminData = this.adminForm.value;

      this.adminService.createAdmin(adminData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastService.success('Admin created successfully');
            this.adminForm.reset();
            this.loadAdmins();
          } else {
            this.toastService.error('Failed to create admin user');
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error creating admin:', error);
          this.toastService.error(error.error?.message || 'Failed to create admin user');
          this.isLoading = false;
        },
      });
    } else {
      this.adminForm.markAllAsTouched();
      this.toastService.warning('Please fill all required fields correctly');
    }
  }

  toggleStatus(admin: Admin): void {
    const newStatus = admin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.adminService.updateAdminStatus(admin.id, newStatus).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastService.success(`Admin ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`);
          this.loadAdmins();
        } else {
          this.toastService.error('Failed to update admin status');
        }
      },
      error: (error: any) => {
        console.error('Error updating admin status:', error);
        this.toastService.error('Error updating admin status');
      },
    });
  }

  // Format date for display
  formatDate(date: Date | string | null): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  }
}
