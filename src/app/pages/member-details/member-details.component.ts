import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../common/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../common/services/member.service';
import { RewardpointsService } from '../../common/services/rewardpoints.service';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from '../../components/user-points-modal/user-points-modal.component';

interface RewardEntry {
  id: number;
  member_firstname: string;
  member_lastname: string;
  manager_id: string;
  director_id: string;
  manager_approval_status: string;
  director_approval_status: string;
  manager_notes: string;
  director_notes: string;
  rewards_entry: {
    id: number;
    member_employee_id: number;
    criteria_id: number;
    date_accomplished: string;
    race_season: string;
    cbps_group: string;
    project_name: string;
    short_description: string;
    notes: string;
    created_at: string;
    updated_at: string;
    attachments: Array<{
      id: number;
      filename: string;
      path: string;
    }>;
  };
  rewards_criteria: {
    id: number;
    category: string;
    accomplishment: string;
    points: number;
    guidelines: string;
  };
}

interface Attachment {
  filename: string;
  path: string;
  type?: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  editProjectForm: FormGroup;
  accomplishments = ['OSAP >9.5', 'Clients/PBU Commendation'];
  rewardEntries: any[] = [];
  displayedColumns: string[] = [];
  memberData: any = null;
  isLoading = false;
  errorMessage = '';
  memberId: string = '';

  // Current project attachments (can be updated after API integration)
  currentProjectAttachments: Attachment[] = [];

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService,
    private rewardService: RewardpointsService,
    private dialog: MatDialog
  ) {
    // Initialize the form for editing a specific project
    this.editProjectForm = this.fb.group({
      rewardPoints: ['10', Validators.required],
      accomplishment: ['Clients/PBU Commendation', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get member ID from route params
    this.route.params.subscribe((params) => {
      this.memberId = params['id'];
      this.loadMemberData(this.memberId);
      this.loadMemberRewardEntries(this.memberId);
    });
  }

  updateDisplayedColumns(): void {
    const baseColumns = [
      'category',
      'accomplishment',
      'points',
      'shortDescription',
      'date',
      'notes',
      'actions',
    ];

    if (this.memberData?.role_id === 4 || this.memberData?.role_id === 3) {
      // For role_id 4, don't add any approval status columns
    } else if (this.memberData?.role_id === 5) {
      // For role_id 5, only add director approval status
      baseColumns.splice(4, 0, 'director_approval_status');
    } else {
      // For all other roles, add both approval status columns
      baseColumns.splice(
        4,
        0,
        'manager_approval_status',
        'director_approval_status'
      );
    }

    this.displayedColumns = baseColumns;
  }

  loadMemberData(memberId: string): void {
    this.isLoading = true;

    this.memberService
      .getMember(Number(memberId))
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.memberData = response;
            this.updateDisplayedColumns();
            console.log('memberData', this.memberData);
          } else {
            this.errorMessage = 'Member not found';
            this.toastService.error(this.errorMessage);
          }
        },
        error: (err: any) => {
          this.errorMessage = err.message || 'Failed to load member details';
          this.toastService.error(this.errorMessage);
        },
      });
  }

  loadMemberRewardEntries(memberId: string): void {
    this.isLoading = true;

    this.memberService
      .getMemberRewardEntries(Number(memberId))
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            // Format the attachments for each entry
            this.rewardEntries = response;
          } else {
            this.errorMessage = 'Failed to load reward entries';
            this.toastService.error(this.errorMessage);
            this.rewardEntries = [];
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load reward entries';
          this.toastService.error(this.errorMessage);
          this.rewardEntries = [];
        },
      });
  }

  onSubmit(): void {
    if (this.editProjectForm.valid) {
      // Here you would call the service to update the project
      this.toastService.success('Project updated successfully');
    } else {
      this.editProjectForm.markAllAsTouched();
      this.toastService.warning(
        'Please fill out all required fields correctly'
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/members']);
  }

  // Open dialog to view reward entry details
  viewRewardEntry(entry: RewardEntry): void {
    // Open the UserModalComponent instead of RewardPointsModalComponent
    this.dialog.open(UserModalComponent, {
      data: { user: entry, access: 'view', resubmit: false },
      width: '80%',
      maxWidth: '1200px',
      disableClose: false,
    });
  }

  // Open dialog to edit reward entry
  editRewardEntry(entry: RewardEntry): void {
    this.dialog.open(UserModalComponent, {
      width: '80%',
      maxWidth: '1200px',
      data: {
        user: entry,
        access: 'edit',
        resubmit: false,
      },
      disableClose: false,
    });

    // Refresh data when dialog is closed
    this.dialog.afterAllClosed.subscribe(() => {
      this.loadMemberRewardEntries(this.memberId);
    });
  }

  // Navigate to admin edit reward page
  navigateToAdminEditReward(entry: RewardEntry): void {
    this.router.navigate([
      '/admin/members',
      this.memberId,
      'rewards',
      entry.id,
      'edit',
    ]);
  }
}
