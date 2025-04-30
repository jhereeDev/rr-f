// cbps-leaderboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LeaderboardsService } from 'src/app/common/services/leaderboards.service';
import { ToastService } from 'src/app/common/services/toast.service';

interface LeaderboardEntry {
  id: number;
  aliasName: string;
  realName?: string;
  fiscalYear: string;
  totalPoints: number;
  approvedPoints: number;
  forApprovalPoints: number;
  rejectedPoints: number;
  role?: number;
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
  displayedColumns: string[] = [
    'aliasName',
    'fiscalYear',
    'totalPoints',
    'approvedPoints',
    'forApprovalPoints',
    'rejectedPoints',
  ];

  // UI state
  selectedTabIndex = 0;
  isLoading = true;
  showAlias = true;
  graphImagePath = 'assets/buttons/graph.png';

  constructor(
    private leaderboardService: LeaderboardsService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Skip API call and just use static data for testing
    this.simulateLeaderboardData();
    this.isLoading = false;
  }

  loadLeaderboards(): void {
    this.isLoading = true;

    // Load both leaderboards in parallel
    Promise.all([
      this.leaderboardService.getLeaderboardByRole(5).toPromise(), // Managers (role 5)
      this.leaderboardService.getLeaderboardByRole(6).toPromise(), // Partners (role 6)
    ])
      .then(([managerResponse, partnerResponse]) => {
        if (
          managerResponse &&
          managerResponse.success &&
          Array.isArray(managerResponse.data)
        ) {
          this.managerLeaderboard = this.processLeaderboardData(
            managerResponse.data
          );
        }

        if (
          partnerResponse &&
          partnerResponse.success &&
          Array.isArray(partnerResponse.data)
        ) {
          this.partnerLeaderboard = this.processLeaderboardData(
            partnerResponse.data
          );
        }
      })
      .catch((error) => {
        console.error('Error loading leaderboards:', error);
        this.toastService.error('Failed to load leaderboard data');
      })
      .finally(() => {
        this.isLoading = false;
      });

    // Simulated data if API doesn't work
    this.simulateLeaderboardData();
  }

  processLeaderboardData(data: any[]): LeaderboardEntry[] {
    return data.map((item) => ({
      id: item.id,
      aliasName: item.alias_name,
      realName: item.real_name || item.alias_name,
      fiscalYear: item.fiscal_year,
      totalPoints: item.total_points,
      approvedPoints: item.approved_points,
      forApprovalPoints: item.for_approval_points,
      rejectedPoints: item.rejected_points,
      role: item.role_id,
    }));
  }

  simulateLeaderboardData(): void {
    // Managers - use very distinct names to clearly see the toggle effect
    this.managerLeaderboard = [
      {
        id: 1,
        aliasName: 'FY24-00001',
        realName: 'Angelica Ware',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role: 5,
      },
      {
        id: 2,
        aliasName: 'FY24-00002',
        realName: 'Jheremiah Figueroa',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role: 5,
      },
    ];

    // Partners
    this.partnerLeaderboard = [
      {
        id: 3,
        aliasName: 'FY24-00003',
        realName: 'Angelica Ware',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role: 6,
      },
      {
        id: 4,
        aliasName: 'FY24-00004',
        realName: 'Jheremiah Figueroa',
        fiscalYear: 'FY24',
        totalPoints: 90,
        approvedPoints: 40,
        forApprovalPoints: 50,
        rejectedPoints: 0,
        role: 6,
      },
    ];
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
  }

  // Set the alias display directly based on the toggle state
  setAliasDisplay(checked: boolean): void {
    this.showAlias = checked;
    this.cdr.detectChanges();
  }

  // Toggle the alias display
  toggleAliasDisplay(): void {
    this.showAlias = !this.showAlias;
    this.cdr.detectChanges();
  }

  getDisplayName(entry: LeaderboardEntry): string {
    return this.showAlias ? entry.aliasName : entry.realName || entry.aliasName;
  }
}
