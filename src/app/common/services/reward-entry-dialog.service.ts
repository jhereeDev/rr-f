import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RewardPointsModalComponent } from '../../components/reward-points-modal/reward-points-modal.component';
import { UserModalComponent } from '../../components/user-points-modal/user-points-modal.component';

@Injectable({
  providedIn: 'root'
})
export class RewardEntryDialogService {

  constructor(private dialog: MatDialog) { }

  /**
   * Open a dialog to view reward entry details
   * @param entry The reward entry to view
   * @param memberData Member data for the entry owner
   * @returns An observable that completes when the dialog closes
   */
  openViewDialog(entry: any, memberData: any): Observable<any> {
    const dialogRef = this.dialog.open(RewardPointsModalComponent, {
      width: '80%',
      maxWidth: '1200px',
      data: {
        rewards_entry: entry,
        member_firstname: memberData.firstName,
        member_lastname: memberData.lastName,
        rewards_criteria: {
          category: entry.category,
          accomplishment: entry.accomplishment,
          points: entry.points,
        },
      },
      disableClose: false,
    });

    return dialogRef.afterClosed();
  }

  /**
   * Open a dialog to edit reward entry
   * @param entry The reward entry to edit
   * @param memberData Member data for the entry owner
   * @returns An observable that completes when the dialog closes
   */
  openEditDialog(entry: any, memberData: any): Observable<any> {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '80%',
      maxWidth: '1200px',
      data: {
        user: {
          id: entry.id,
          member_firstname: memberData.firstName,
          member_lastname: memberData.lastName,
          rewards_entry: entry,
          rewards_criteria: {
            category: entry.category,
            accomplishment: entry.accomplishment,
            points: entry.points,
          },
          manager_approval_status: entry.status.toLowerCase(),
          director_approval_status: entry.status.toLowerCase(),
        },
        access: 'edit',
        resubmit: false,
      },
      disableClose: false,
    });

    return dialogRef.afterClosed();
  }
}