import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/services/auth.service';
import { RewardpointsService } from 'src/app/common/services/rewardpoints.service';
import { UserData } from 'src/app/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { PageEvent } from '@angular/material/paginator';
import { ApprovalService } from 'src/app/common/services/approval.service';
import { UserModalComponent } from 'src/app/components/user-points-modal/user-points-modal.component';

@Component({
  selector: 'app-my-reward-points',
  templateUrl: './my-reward-points.component.html',
  styleUrls: ['./my-reward-points.component.scss'],
})
export class MyRewardPointsComponent implements OnInit {
  user: any = null;
  approvedRewards: any[] = [];
  pendingManagerRewards: any[] = [];
  pendingDirectorRewards: any[] = [];
  rejectedRewards: any[] = [];

  // Pagination variables for approved rewards
  approvedPagedData: any[] = [];
  approvedPageIndex = 0;
  approvedPageSize = 6;
  approvedTotalItems = 0;

  // Pagination variables for pending manager rewards
  pendingManagerPagedData: any[] = [];
  pendingManagerPageIndex = 0;
  pendingManagerPageSize = 6;
  pendingManagerTotalItems = 0;

  // Pagination variables for pending director rewards
  pendingDirectorPagedData: any[] = [];
  pendingDirectorPageIndex = 0;
  pendingDirectorPageSize = 6;
  pendingDirectorTotalItems = 0;

  // Pagination variables for rejected rewards
  rejectedPagedData: any[] = [];
  rejectedPageIndex = 0;
  rejectedPageSize = 6;
  rejectedTotalItems = 0;

  userRole: any;
  isLoading: boolean = true;
  myLeaderboard: any = {};

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private rewardPointsService: RewardpointsService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    this.auth.validateToken().subscribe((res) => {
      if (!(res && res.success)) {
        return;
      }
      const user = res.user as UserData;
      this.user = user;
      this.myLeaderboard = this.user.leaderboardData
        ? this.user.leaderboardData
        : {};
      this.userRole = this.user?.role_id;
      this.getRewardPoints();
    });
  }

  openUserModal(user: any): void {
    let isResubmit;
    if (this.userRole === 5) {
      isResubmit = user.director_approval_status === 'rejected';
    } else {
      isResubmit =
        user.manager_approval_status === 'rejected' ||
        (user.manager_approval_status === 'rejected' &&
          user.director_approval_status === 'rejected');
    }

    const dialogRef = this.dialog.open(UserModalComponent, {
      data: { user, access: 'view', resubmit: isResubmit },
      width: '70%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getRewardPoints();
    });
  }

  getRewardPoints(): void {
    this.isLoading = true;
    this.approvalService
      .getApprovals()
      .subscribe(
        (data: any) => {
          if (Array.isArray(data)) {
            this.approvedRewards = data.filter(
              (reward) =>
                reward.director_approval_status === 'approved' &&
                reward.manager_approval_status === 'approved'
            );
            this.approvedTotalItems = this.approvedRewards.length;
            this.updateApprovedPagination();

            this.pendingManagerRewards = data.filter(
              (reward) =>
                reward.manager_approval_status === 'pending' &&
                (reward.director_approval_status === 'approved' ||
                  reward.director_approval_status === 'pending')
            );
            this.pendingManagerTotalItems = this.pendingManagerRewards.length;
            this.updatePendingManagerPagination();

            this.pendingDirectorRewards = data.filter(
              (reward) =>
                reward.manager_approval_status === 'approved' &&
                reward.director_approval_status === 'pending'
            );
            this.pendingDirectorTotalItems = this.pendingDirectorRewards.length;
            this.updatePendingDirectorPagination();

            this.rejectedRewards = data.filter((reward) =>
              this.userRole === 5
                ? reward.director_approval_status === 'rejected'
                : reward.manager_approval_status === 'rejected' ||
                  reward.director_approval_status === 'rejected'
            );
            this.rejectedTotalItems = this.rejectedRewards.length;
            this.updateRejectedPagination();
          } else {
            console.error('Unexpected data structure:', data);
          }
        },
        (error: any) => {
          console.error('Error fetching reward entries', error);
        }
      )
      .add(() => {
        this.isLoading = false;
      });
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  /**
   * Handle pagination events for approved rewards
   * @param event Page event from paginator
   */
  onApprovedPageChange(event: PageEvent): void {
    this.approvedPageIndex = event.pageIndex;
    this.approvedPageSize = event.pageSize;
    this.updateApprovedPagination();
  }

  /**
   * Handle pagination events for pending manager rewards
   * @param event Page event from paginator
   */
  onPendingManagerPageChange(event: PageEvent): void {
    this.pendingManagerPageIndex = event.pageIndex;
    this.pendingManagerPageSize = event.pageSize;
    this.updatePendingManagerPagination();
  }

  /**
   * Handle pagination events for pending director rewards
   * @param event Page event from paginator
   */
  onPendingDirectorPageChange(event: PageEvent): void {
    this.pendingDirectorPageIndex = event.pageIndex;
    this.pendingDirectorPageSize = event.pageSize;
    this.updatePendingDirectorPagination();
  }

  /**
   * Handle pagination events for rejected rewards
   * @param event Page event from paginator
   */
  onRejectedPageChange(event: PageEvent): void {
    this.rejectedPageIndex = event.pageIndex;
    this.rejectedPageSize = event.pageSize;
    this.updateRejectedPagination();
  }

  /**
   * Update paginated data for approved rewards
   */
  private updateApprovedPagination(): void {
    const startIndex = this.approvedPageIndex * this.approvedPageSize;
    this.approvedPagedData = this.approvedRewards.slice(
      startIndex,
      startIndex + this.approvedPageSize
    );
  }

  /**
   * Update paginated data for pending manager rewards
   */
  private updatePendingManagerPagination(): void {
    const startIndex =
      this.pendingManagerPageIndex * this.pendingManagerPageSize;
    this.pendingManagerPagedData = this.pendingManagerRewards.slice(
      startIndex,
      startIndex + this.pendingManagerPageSize
    );
  }

  /**
   * Update paginated data for pending director rewards
   */
  private updatePendingDirectorPagination(): void {
    const startIndex =
      this.pendingDirectorPageIndex * this.pendingDirectorPageSize;
    this.pendingDirectorPagedData = this.pendingDirectorRewards.slice(
      startIndex,
      startIndex + this.pendingDirectorPageSize
    );
  }

  /**
   * Update paginated data for rejected rewards
   */
  private updateRejectedPagination(): void {
    const startIndex = this.rejectedPageIndex * this.rejectedPageSize;
    this.rejectedPagedData = this.rejectedRewards.slice(
      startIndex,
      startIndex + this.rejectedPageSize
    );
  }
}
