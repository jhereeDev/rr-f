import { Component, OnInit } from '@angular/core';
import { Inject, ViewChild } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { ApprovalService } from 'src/app/common/services/approval.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { RewardpointsService } from 'src/app/common/services/rewardpoints.service';
import { User, UserData } from 'src/app/models/user.model';
import { LeaderboardsService } from 'src/app/common/services/leaderboards.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  managerLeaderboard: any[] = [];
  memberLeaderboard: any[] = [];

  // Pagination variables for managers
  managerPagedData: any[] = [];
  managerPageIndex = 0;
  managerPageSize = 10;
  managerTotalItems = 0;

  // Pagination variables for members
  memberPagedData: any[] = [];
  memberPageIndex = 0;
  memberPageSize = 10;
  memberTotalItems = 0;

  user: UserData | undefined;
  userRole: any;
  isLoading: boolean = true;
  currentUserAliasName: string | null = null;

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private rewardService: RewardpointsService,
    private snackBar: MatSnackBar,
    private leaderboardService: LeaderboardsService
  ) {}

  // Define your column headers here
  columns: string[] = [
    'Alias name',
    'Fiscal year',
    'Race Season Total Points',
    'Race Season Approved Points',
    'Race Season for Approval Points',
    'Race Season Rejected Points',
  ];

  ngOnInit(): void {
    this.auth.validateToken().subscribe((res) => {
      if (!(res && res.success)) {
        return;
      }
      const user = res.user as UserData;
      this.user = user;
      this.userRole = this.user.role_id;

      this.getLeaderboards();
    });
  }

  getLeaderboards(): void {
    this.isLoading = true;
    Promise.all([
      this.leaderboardService.getLeaderboardByRole(5).toPromise(),
      this.leaderboardService.getLeaderboardByRole(6).toPromise(),
    ])
      .then(([managerResponse, memberResponse]) => {
        if (
          managerResponse &&
          managerResponse.success &&
          Array.isArray(managerResponse.data)
        ) {
          this.managerLeaderboard = managerResponse.data;
          this.managerTotalItems = this.managerLeaderboard.length;
          this.updateManagerPagination();
        }
        if (
          memberResponse &&
          memberResponse.success &&
          Array.isArray(memberResponse.data)
        ) {
          this.memberLeaderboard = memberResponse.data;
          this.memberTotalItems = this.memberLeaderboard.length;
          this.updateMemberPagination();
        }
      })
      .catch((error) => {
        console.error('Error fetching leaderboards', error);
      })
      .finally(() => {
        this.isLoading = false; // Set loading to false after data is fetched
      });
  }

  getColumnValue(reward: any, index: number): string {
    switch (index) {
      case 0:
        return reward.alias_name;
      case 1:
        return reward.fiscal_year;
      case 2:
        return reward.total_points.toString();
      case 3:
        return reward.approved_points.toString();
      case 4:
        return reward.for_approval_points.toString();
      case 5:
        return reward.rejected_points.toString();
      default:
        return '';
    }
  }

  /**
   * Handle pagination events for manager leaderboard
   * @param event Page event from paginator
   */
  onManagerPageChange(event: PageEvent): void {
    this.managerPageIndex = event.pageIndex;
    this.managerPageSize = event.pageSize;
    this.updateManagerPagination();
  }

  /**
   * Handle pagination events for member leaderboard
   * @param event Page event from paginator
   */
  onMemberPageChange(event: PageEvent): void {
    this.memberPageIndex = event.pageIndex;
    this.memberPageSize = event.pageSize;
    this.updateMemberPagination();
  }

  /**
   * Update paginated data for manager leaderboard
   */
  private updateManagerPagination(): void {
    const startIndex = this.managerPageIndex * this.managerPageSize;
    this.managerPagedData = this.managerLeaderboard.slice(
      startIndex,
      startIndex + this.managerPageSize
    );
  }

  /**
   * Update paginated data for member leaderboard
   */
  private updateMemberPagination(): void {
    const startIndex = this.memberPageIndex * this.memberPageSize;
    this.memberPagedData = this.memberLeaderboard.slice(
      startIndex,
      startIndex + this.memberPageSize
    );
  }
}
