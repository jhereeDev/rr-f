// member-control.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MemberAddDialogComponent } from '../../components/member-add-dialog/member-add-dialog.component';
import { MemberEditDialogComponent } from '../../components/member-edit-dialog/member-edit-dialog.component';
import { MemberMappingDialogComponent } from '../../components/member-mapping-dialog/member-mapping-dialog.component';
import { MemberConfirmDialogComponent } from '../../components/member-confirm-dialog/member-confirm-dialog.component';
import { ToastService } from '../../common/services/toast.service';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  manager: string;
  director: string;
  status: string;
  email?: string;
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    // Simulated API call - would be replaced with an actual service call
    setTimeout(() => {
      this.members = [
        {
          id: 1,
          firstName: 'Angelica',
          lastName: 'Ware',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Inactive',
        },
        {
          id: 2,
          firstName: 'Angelica',
          lastName: 'Ware',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'New Joiner',
        },
        {
          id: 3,
          firstName: 'Angelica',
          lastName: 'Ware',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
        {
          id: 4,
          firstName: 'Angelica',
          lastName: 'Ware',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
        {
          id: 5,
          firstName: 'Angelica',
          lastName: 'Ware',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Inactive',
        },
        {
          id: 6,
          firstName: 'Angelica',
          lastName: 'Ware',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
        {
          id: 7,
          firstName: 'Angelica',
          lastName: 'Ware',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
        // Additional members for pagination
        {
          id: 8,
          firstName: 'Jheremiah',
          lastName: 'Figueroa',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'New Joiner',
        },
        {
          id: 9,
          firstName: 'Adrian',
          lastName: 'Magpili',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
        {
          id: 10,
          firstName: 'Victor',
          lastName: 'Arias',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
        {
          id: 11,
          firstName: 'Samuel',
          lastName: 'Gelacio',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Inactive',
        },
        {
          id: 12,
          firstName: 'Danica',
          lastName: 'Quino',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
        {
          id: 13,
          firstName: 'Candy',
          lastName: 'Ramirez',
          jobTitle: 'Associate Consultant',
          department: 'PH022: Philippines Operations',
          manager: 'john.nunez@cgi.com',
          director: 'ronwald.king@cgi.com',
          status: 'Active',
        },
      ];

      this.totalItems = this.members.length;
      this.updateDisplayedMembers();
      this.isLoading = false;
    }, 500);
  }

  updateDisplayedMembers(): void {
    // Filter members based on search text
    const filtered = this.searchText
      ? this.members.filter(
          (member) =>
            `${member.firstName} ${member.lastName}`
              .toLowerCase()
              .includes(this.searchText.toLowerCase()) ||
            member.jobTitle
              .toLowerCase()
              .includes(this.searchText.toLowerCase()) ||
            member.department
              .toLowerCase()
              .includes(this.searchText.toLowerCase()) ||
            member.manager
              .toLowerCase()
              .includes(this.searchText.toLowerCase()) ||
            member.director
              .toLowerCase()
              .includes(this.searchText.toLowerCase())
        )
      : [...this.members];

    this.totalItems = filtered.length;

    // Apply pagination
    const startIndex = this.pageIndex * this.pageSize;
    this.filteredMembers = filtered.slice(
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
    this.updateDisplayedMembers();
  }

  clearSearch(): void {
    this.searchText = '';
    this.pageIndex = 0;
    this.updateDisplayedMembers();
  }

  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(MemberAddDialogComponent, {
      width: '800px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastService.success('Member added successfully');
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
        this.toastService.success('Member mapping synchronized successfully');
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
