// member-control.component.ts with real data integration
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  displayedColumns: string[] = [
    'memberName',
    'jobTitle',
    'department',
    'manager',
    'director',
    'status',
    'actions',
  ];
  isLoading = true;
  searchText = '';
  error = false;
  errorMessage = '';

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
    private snackBar: MatSnackBar,
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.error = false;

    const filters = this.searchText ? { search: this.searchText } : undefined;

    this.memberService
      .getMembers(filters)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.members = data;
          this.totalItems = this.members.length;
          this.updateDisplayedMembers();
        },
        error: (err) => {
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
      width: '800px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Transform the dialog result to match the API expectations
        const memberData = {
          email: result.email,
          status: result.status,
        };

        this.memberService.addMember(memberData).subscribe({
          next: () => {
            this.toastService.success('Member added successfully');
            this.loadMembers();
          },
          error: (err) => {
            this.toastService.error(err.message || 'Failed to add member');
          },
        });
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
        // Transform the dialog result to match the API expectations

        const memberData = {
          jobTitle: result.jobTitle,
          manager: result.manager,
          director: result.director,
          status: result.status,
          role: result.role,
        };

        this.memberService
          .updateMember(member.id.toString(), memberData)
          .subscribe({
            next: () => {
              this.toastService.success('Member updated successfully');
              this.loadMembers();
            },
            error: (err) => {
              this.toastService.error(err.message || 'Failed to update member');
            },
          });
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
        // Actually perform the mapping operation
        this.memberService.mapMembersHierarchy().subscribe({
          next: () => {
            this.toastService.success(
              'Member mapping synchronized successfully'
            );
            this.loadMembers(); // Reload member list
          },
          error: (err) => {
            this.toastService.error(
              err.message || 'Failed to sync member mapping'
            );
          },
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'new joiner':
        return 'status-new';
      default:
        return '';
    }
  }
}
