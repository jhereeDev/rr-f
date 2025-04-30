// cbps-leaderboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LeaderboardsService } from 'src/app/common/services/leaderboards.service';
import { ToastService } from 'src/app/common/services/toast.service';
import { finalize } from 'rxjs/operators';

interface LeaderboardEntry {
  id: number;
  aliasName: string;
  fiscalYear: string;
  totalPoints: number;
  approvedPoints: number;
  forApprovalPoints: number;
  rejectedPoints: number;
  member_firstname?: string;
  member_lastname?: string;
  member_email?: string;
  role_id?: number;
}

@Component({
  selector: 'app-cbps-leaderboard',
  templateUrl: './cbps-leaderboard.component.html',
  styleUrls: ['./cbps-leaderboard.component.scss'],
})
export class CBPSLeaderboardComponent implements OnInit {
  // Data
  managerLeaderboard: LeaderboardEntry[] = [];
  partnerLeaderboard: LeaderboardEntry[] = [];

  // UI state
  selectedTabIndex = 0;
  isLoading = true;
  showAlias = true;
  graphImagePath = 'assets/buttons/graph.png';
  error: string | null = null;

  constructor(
    private leaderboardService: LeaderboardsService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLeaderboards();
  }

  loadLeaderboards(): void {
    this.isLoading = true;
    this.error = null;

    // Load both leaderboards in parallel
    Promise.all([
      this.leaderboardService.getLeaderboardByRole(5).toPromise(), // Managers (role 5)
      this.leaderboardService.getLeaderboardByRole(6).toPromise(), // Partners (role 6)
    ])
      .then(([managerResponse, partnerResponse]) => {
        // Process manager data
        if (managerResponse && managerResponse.data) {
          this.managerLeaderboard = this.processLeaderboardData(
            managerResponse.data
          );
        } else {
          console.warn('No manager leaderboard data returned from API');
          this.managerLeaderboard = [];
        }

        // Process partner data
        if (partnerResponse && partnerResponse.data) {
          this.partnerLeaderboard = this.processLeaderboardData(
            partnerResponse.data
          );
        } else {
          console.warn('No partner leaderboard data returned from API');
          this.partnerLeaderboard = [];
        }
      })
      .catch((error) => {
        console.error('Error loading leaderboards:', error);
        this.error = 'Failed to load leaderboard data. Please try again.';
        this.toastService.error('Failed to load leaderboard data');

        // Fall back to simulated data when there's an error
        this.simulateLeaderboardData();
      })
      .finally(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  processLeaderboardData(data: any[]): LeaderboardEntry[] {
    return data.map((item) => ({
      id: item.id,
      aliasName: item.alias_name,
      fiscalYear: item.fiscal_year,
      totalPoints: item.total_points || 0,
      approvedPoints: item.approved_points || 0,
      forApprovalPoints: item.for_approval_points || 0,
      rejectedPoints: item.rejected_points || 0,
      member_firstname: item.member_firstname,
      member_lastname: item.member_lastname,
      member_email: item.member_email,
      role_id: item.role_id,
    }));
  }

  simulateLeaderboardData(): void {
    // Managers - use realistic naming to improve testing
    this.managerLeaderboard = [
      {
        id: 1,
        aliasName: 'FY24-00001',
        member_firstname: 'Angelica',
        member_lastname: 'Ware',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role_id: 5,
      },
      {
        id: 2,
        aliasName: 'FY24-00002',
        member_firstname: 'Jheremiah',
        member_lastname: 'Figueroa',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role_id: 5,
      },
    ];

    // Partners
    this.partnerLeaderboard = [
      {
        id: 3,
        aliasName: 'FY24-00003',
        member_firstname: 'Adrian',
        member_lastname: 'Magpili',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role_id: 6,
      },
      {
        id: 4,
        aliasName: 'FY24-00004',
        member_firstname: 'Victor',
        member_lastname: 'Arias',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role_id: 6,
      },
    ];
  }

  // Set the alias display directly based on the toggle state
  setAliasDisplay(checked: boolean): void {
    this.showAlias = checked;
    this.cdr.detectChanges();
  }

  // Get the display name based on the alias toggle state
  getDisplayName(entry: LeaderboardEntry): string {
    if (this.showAlias) {
      return entry.aliasName;
    } else {
      if (entry.member_firstname && entry.member_lastname) {
        return `${entry.member_firstname} ${entry.member_lastname}`;
      }
      return entry.aliasName; // Fallback to alias if no name
    }
  }
}
