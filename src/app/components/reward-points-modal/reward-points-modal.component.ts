import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApprovalService } from 'src/app/common/services/approval.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { User, UserData } from 'src/app/models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RewardpointsService } from 'src/app/common/services/rewardpoints.service';

@Component({
  selector: 'app-reward-points-modal',
  templateUrl: './reward-points-modal.component.html',
  styleUrls: ['./reward-points-modal.component.scss'],
})
export class RewardPointsModalComponent implements OnInit {
  user: any = null;
  isLoading = false;

  // PDF viewer properties
  selectedAttachmentIndex: number = 0;
  selectedAttachment: any = null;

  constructor(
    public dialogRef: MatDialogRef<RewardPointsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private approvalService: ApprovalService,
    private rewardpointsService: RewardpointsService,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.auth.validateToken().subscribe((res) => {
      if (!(res && res.success)) {
        return;
      }
      const user = res.user as UserData;
      this.user = user;

      // Set initial selected attachment if available
      if (
        this.data.rewards_entry.attachments &&
        this.data.rewards_entry.attachments.length > 0
      ) {
        this.selectedAttachment = this.data.rewards_entry.attachments[0];
      }
    });
  }

  // Method to select an attachment for viewing
  selectAttachment(index: number): void {
    this.selectedAttachmentIndex = index;
    this.selectedAttachment = this.data.rewards_entry.attachments[index];
  }

  downloadAttachment(attachment: any): void {
    this.rewardpointsService.downloadAttachment(attachment.path).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.filename;
        link.click();
        window.URL.revokeObjectURL(url);
      },

      error: (error: HttpErrorResponse) => {
        console.error('Error downloading attachment:', error);
      },
    });
  }
}
