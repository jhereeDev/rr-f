// member-mapping-dialog.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';
import { MemberService } from '../../common/services/member.service';
import { interval, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, finalize, map, mergeMap, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';

interface SyncStats {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
}

@Component({
  selector: 'app-member-mapping-dialog',
  templateUrl: './member-mapping-dialog.component.html',
  styleUrls: ['./member-mapping-dialog.component.scss'],
})
export class MemberMappingDialogComponent implements OnInit, OnDestroy {
  progress = 0;
  dialogTitle = 'Updating Member Mapping';
  statusMessage = 'Initializing...';
  progressDetails = '';
  isComplete = false;
  mappingStats: SyncStats | null = null;

  // Track which hierarchies have been synced
  directorsSynced = false;
  managersSynced = false;
  membersSynced = false;
  currentRole = '';

  private destroy$ = new Subject<void>();
  private progressInterval: Subscription | null = null;
  private syncing = false;
  private estimatedTotalTime = 45000; // 45 seconds total for all roles

  constructor(
    private dialogRef: MatDialogRef<MemberMappingDialogComponent>,
    private toastService: ToastService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.startMemberMapping();
  }

  ngOnDestroy(): void {
    this.stopProgressInterval();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Starts the complete member mapping process across all roles
   * This function coordinates syncing directors, managers, and then members
   */
  startMemberMapping(): void {
    this.syncing = true;
    this.progress = 5; // Initial progress
    this.statusMessage = 'Connecting to LDAP server...';
    this.startProgressInterval();

    // Using switchMap to handle the sequential processing of each role
    // First sync directors (leaders)
    this.syncRoleHierarchy('DIRECTOR')
      .pipe(
        tap(result => {
          this.directorsSynced = true;
          this.updateStatsFromResult(result);
          this.progress = 33; // ~1/3 done
          this.statusMessage = 'Processing managers...';
        }),
        // Then sync managers
        switchMap(() => this.syncRoleHierarchy('MANAGER')),
        tap(result => {
          this.managersSynced = true;
          this.updateStatsFromResult(result);
          this.progress = 66; // ~2/3 done
          this.statusMessage = 'Processing members...';
        }),
        // Finally sync regular members (consultants)
        switchMap(() => this.syncRoleHierarchy('CONSULTANT')),
        tap(result => {
          this.membersSynced = true;
          this.updateStatsFromResult(result);
        }),
        finalize(() => {
          this.handleSyncCompletion();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: (error) => this.handleSyncError(error)
      });
  }

  /**
   * Syncs a specific role hierarchy with the LDAP server
   * @param role The role placeholder to use in the LDAP query (DIRECTOR, MANAGER, CONSULTANT)
   * @returns An observable with the sync result
   */
  private syncRoleHierarchy(role: string): Observable<any> {
    this.currentRole = role;
    return this.memberService.syncMemberMapping(role).pipe(
      catchError(error => {
        console.error(`Error syncing ${role} hierarchy:`, error);
        // Returning an error result but continuing the chain
        return of({
          success: false,
          error: error.message || `Error syncing ${role} hierarchy`,
          stats: {
            total: 0,
            created: 0,
            updated: 0,
            skipped: 0,
            failed: 1
          }
        });
      })
    );
  }

  /**
   * Updates the overall statistics displayed to the user
   */
  private updateStatsFromResult(result: any): void {
    if (!result || !result.stats) return;

    if (!this.mappingStats) {
      this.mappingStats = {
        total: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0
      };
    }

    // Add the stats from this batch to our running totals
    this.mappingStats.total += result.stats.total || 0;
    this.mappingStats.created += result.stats.created || 0;
    this.mappingStats.updated += result.stats.updated || 0;
    this.mappingStats.skipped += result.stats.skipped || 0;
    this.mappingStats.failed += result.stats.failed || 0;
  }

  /**
   * Handles the successful completion of all sync operations
   */
  private handleSyncCompletion(): void {
    this.stopProgressInterval();
    this.progress = 100;
    this.isComplete = true;
    this.syncing = false;

    // Check if there were any failures
    if (this.mappingStats && this.mappingStats.failed > 0) {
      this.dialogTitle = 'Member Mapping Results';
      this.statusMessage = 'Member mapping completed with some errors';
      this.progressDetails = `Failed to sync ${this.mappingStats.failed} members`;
    } else {
      this.dialogTitle = 'Member Mapping Results';
      this.statusMessage = 'Member mapping has been completed successfully!';
      if (this.mappingStats) {
        this.progressDetails = `Processed ${this.mappingStats.total} members in total`;
      } else {
        this.progressDetails = 'Mapping completed successfully';
      }
    }
  }

  /**
   * Handles errors during the sync process
   */
  private handleSyncError(error: any): void {
    this.stopProgressInterval();
    this.progress = 100;
    this.isComplete = true;
    this.syncing = false;
    this.dialogTitle = 'Member Mapping Results';
    this.statusMessage = `An error occurred during ${this.currentRole} mapping`;
    this.progressDetails = error.error?.message || error.message || 'Unknown error occurred';
  }

  /**
   * Manages the progress bar animation
   */
  private startProgressInterval(): void {
    this.stopProgressInterval();

    // Create a smoother progress animation
    this.progressInterval = interval(100)
      .pipe(
        takeWhile(() => this.syncing && this.progress < 95)
      )
      .subscribe(() => {
        // Calculate which segment we're in
        if (!this.directorsSynced) {
          // Directors segment (0-33%)
          this.progress = Math.min(30, this.progress + 0.2);
        } else if (!this.managersSynced) {
          // Managers segment (33-66%)
          this.progress = Math.min(63, this.progress + 0.3);
        } else if (!this.membersSynced) {
          // Members segment (66-100%)
          this.progress = Math.min(93, this.progress + 0.4);
        }
      });
  }

  private stopProgressInterval(): void {
    if (this.progressInterval) {
      this.progressInterval.unsubscribe();
      this.progressInterval = null;
    }
  }

  /**
   * Handles the user clicking the cancel button
   */
  cancel(): void {
    if (this.syncing) {
      if (confirm('Are you sure you want to cancel the member mapping process?')) {
        this.stopProgressInterval();
        this.destroy$.next();
        this.syncing = false;
        this.dialogRef.close('cancelled');
      }
    } else {
      this.dialogRef.close(this.isComplete ? 'success' : 'cancelled');
    }
  }

  /**
   * Handles the user clicking the Done button when sync is complete
   */
  close(): void {
    if (this.mappingStats) {
      this.dialogRef.close({
        status: this.mappingStats.failed > 0 ? 'warning' : 'success',
        stats: this.mappingStats
      });
    } else {
      this.dialogRef.close({
        status: 'error',
        error: this.progressDetails
      });
    }
  }
}
