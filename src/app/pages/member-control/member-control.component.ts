// Updated member-control.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MemberService } from '../../common/services/member.service';
import { MemberAddDialogComponent } from '../../components/member-add-dialog/member-add-dialog.component';
import { MemberEditDialogComponent } from '../../components/member-edit-dialog/member-edit-dialog.component';
import { MemberMappingDialogComponent } from '../../components/member-mapping-dialog/member-mapping-dialog.component';
import { MemberConfirmDialogComponent } from '../../components/member-confirm-dialog/member-confirm-dialog.component';
import { ToastService } from '../../common/services/toast.service';
import { finalize } from 'rxjs/operators';

interface Member {
  id: string | number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  manager: string;
  director: string;
  status: string;
  email?: string;
  role?: number;
}

@Component({
  selector: 'app-member-control',
  templateUrl: './member-control.component.html',
  styleUrls: ['./member-control.component.scss'],
})
export class MemberControlComponent implements OnInit {
  members: Member[] = [];
  filteredMembers: Member[] = [];
  isLoading = true;
  searchText = '';
  error = false;
  errorMessage = '';
  refreshAfterAction = false;

  // Pagination variables
  pageSize = 7;
  pageIndex = 0;
  totalItems = 0;
  pageSizeOptions = [7, 10, 25, 50];
  // Expose Math to template
  mathRef = Math;

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.error = false;
    this.refreshAfterAction = false;

    const filters = this.searchText ? { search: this.searchText } : undefined;

    this.memberService
      .getMembers(filters)
      .pipe(
        finalize(() => {
          this.isLoading = false;

        })
      )
      .subscribe({
        next: (response) => {

          // Ensure we have an array of members with the correct structure
          let membersData = [];
          if (response && response.data && Array.isArray(response.data)) {
            membersData = response.data;
          } else if (response && Array.isArray(response)) {
            membersData = response;
          } else if (response && response.results && Array.isArray(response.results)) {
            membersData = response.results;
          }

          // Transform API data to match our interface
          this.members = membersData.map((member: any) => ({
            id: member.id || member.member_employee_id || '',
            firstName: member.member_firstname || member.firstName || '',
            lastName: member.member_lastname || member.lastName || '',
            jobTitle: member.member_title || member.jobTitle || '',
            department: member.department || '',
            manager: member.member_manager_id || member.manager || '',
            director: member.member_director_id || member.director || '',
            status: member.member_status || member.status || 'ACTIVE',
            email: member.member_email || member.email || '',
            role: member.role_id || member.role || 6
          }));

          this.totalItems = this.members.length;
          this.updateDisplayedMembers();
        },
        error: (err) => {
          console.error('Error loading members:', err);
          this.error = true;
          this.errorMessage = err.message || 'Failed to load members';
          this.toastService.error(this.errorMessage);
          this.members = [];
          this.filteredMembers = [];
          this.totalItems = 0;
        },
      });
  }

  updateDisplayedMembers(): void {

    // Apply pagination
    const startIndex = this.pageIndex * this.pageSize;
    this.filteredMembers = this.members.slice(
      startIndex,
      startIndex + this.pageSize
    );


  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedMembers();
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText = value;
    this.pageIndex = 0; // Reset to first page when searching
    this.loadMembers(); // Reload with search filter
  }

  clearSearch(): void {
    this.searchText = '';
    this.pageIndex = 0;
    this.loadMembers(); // Reload without search filter
  }

  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(MemberAddDialogComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // Mark that we need to refresh the list
        this.refreshAfterAction = true;

        // Show success toast message
        this.toastService.success(result.message || 'Member added successfully');

        // Reload the member list
        this.loadMembers();
      }
    });
  }

  openEditMemberDialog(member: Member): void {
    const dialogRef = this.dialog.open(MemberEditDialogComponent, {
      width: '800px',
      data: { member },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshAfterAction = true;
        this.toastService.success('Member updated successfully');
        this.loadMembers();
      }
    });
  }

  viewMemberDetails(member: Member): void {
    this.router.navigate(['/admin/members', member.id]);
  }

  syncMemberMapping(): void {
    const dialogRef = this.dialog.open(MemberMappingDialogComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.refreshAfterAction = true;
        this.toastService.success('Member mapping synchronized successfully');
        this.loadMembers(); // Reload member list
      }
    });
  }

  confirmStatusChange(member: Member, newStatus: string): void {
    const dialogRef = this.dialog.open(MemberConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `${newStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'} Member`,
        message: `Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} ${member.firstName} ${member.lastName}?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateMemberStatus(member, newStatus);
      }
    });
  }

  updateMemberStatus(member: Member, newStatus: string): void {
    this.memberService.updateMemberStatus(Number(member.id), newStatus)
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            this.toastService.success(`Member ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`);
            this.loadMembers();
          } else {
            this.toastService.error(response.error || 'Failed to update member status');
          }
        },
        error: (err) => {
          this.toastService.error(err.message || 'An error occurred while updating member status');
        }
      });
  }

  getStatusClass(status: string): string {
    if (!status) {
      return '';
    }

    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      default:
        return '';
    }
  }
}