import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApprovalService } from 'src/app/common/services/approval.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { User, UserData } from 'src/app/models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RewardpointsService } from 'src/app/common/services/rewardpoints.service';
import { ToastService } from 'src/app/common/services/toast.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-points-modal.component.html',
  styleUrls: ['./user-points-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  user: any = null;
  isRejectLoading = false;
  isApproveLoading = false;
  isResubmitLoading = false;
  showCommentBox = false;
  isRejectBoxLoading = false;
  rejectionComment = '';
  approvalStatus = '';

  // New properties for PDF viewer
  selectedAttachmentIndex: number = 0;
  selectedAttachment: any = null;

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private approvalService: ApprovalService,
    private rewardpointsService: RewardpointsService,
    private auth: AuthService,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.auth.validateToken().subscribe((res) => {
      if (!(res && res.success)) {
        return;
      }
      const user = res.user as UserData;
      this.user = user;
      this.approvalStatus =
        this.user.role_id === 6
          ? this.data.user.manager_approval_status
          : this.data.user.director_approval_status;

      // Set initial selected attachment if available
      if (
        this.data.user.rewards_entry.attachments &&
        this.data.user.rewards_entry.attachments.length > 0
      ) {
        this.selectedAttachment = this.data.user.rewards_entry.attachments[0];
      }
    });
  }

  // Method to select an attachment for viewing
  selectAttachment(index: number): void {
    this.selectedAttachmentIndex = index;
    this.selectedAttachment = this.data.user.rewards_entry.attachments[index];
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  // Remove this method as we're now using the PDF viewer
  // downloadAttachment(attachment: any): void {
  //   // This is replaced by the PDF viewer
  // }

  showRejectionCommentBox(): void {
    this.showCommentBox = true;
  }

  cancelRejection(): void {
    this.showCommentBox = false;
    this.rejectionComment = '';
    this.isRejectLoading = false;
  }

  approve() {
    if (this.user.role_id === 4) {
      this.isApproveLoading = true;
      this.approvalService.approveDirector(this.data.user.id, true).subscribe({
        next: (res) => {
          this.toastService.info('Reward entry approved');
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error approving reward:', error);
          this.toastService.error('Error approving reward!');
        },
        complete: () => {
          this.isApproveLoading = false;
        },
      });
    } else {
      this.isApproveLoading = true;
      this.approvalService.approve(this.data.user.id, true).subscribe({
        next: (res) => {
          this.toastService.info('Reward entry approved');
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error approving reward:', error);
          this.toastService.error('Error approving reward!');
        },
        complete: () => {
          this.isApproveLoading = false;
        },
      });
    }
  }

  rejectWithComment() {
    if (!this.rejectionComment.trim()) {
      this.toastService.warning('Please provide a rejection reason');
      return;
    }

    if (this.rejectionComment) {
      if (this.user.role_id === 4) {
        this.isRejectBoxLoading = true;
        this.approvalService
          .approveDirector(this.data.user.id, false, this.rejectionComment)
          .subscribe({
            next: (res) => {
              this.toastService.info('Reward entry rejected');
              this.dialogRef.close();
            },
            error: (error) => {
              console.error('Error rejecting reward:', error);
              this.toastService.error('Error rejecting reward!');
            },
            complete: () => {
              this.isRejectBoxLoading = false;
            },
          });
      } else {
        this.isRejectBoxLoading = true;
        this.approvalService
          .approve(
            this.data.user.id,
            false,
            this.rejectionComment,
            this.data.resubmit
          )
          .subscribe({
            next: (res) => {
              this.toastService.info('Reward entry rejected');
              this.dialogRef.close();
            },
            error: (error) => {
              console.error('Error rejecting reward:', error);
              this.toastService.error('Error rejecting reward!');
            },
            complete: () => {
              this.isRejectBoxLoading = false;
            },
          });
      }
    }
  }

  resubmit() {
    this.isResubmitLoading = true;
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
