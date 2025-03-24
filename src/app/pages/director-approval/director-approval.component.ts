import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/services/auth.service';
import { ApprovalService } from 'src/app/common/services/approval.service'; // Import the service
import { UserModalComponent } from 'src/app/components/user-points-modal/user-points-modal.component';
import { User, UserData } from 'src/app/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-director-approval',
  templateUrl: './director-approval.component.html',
  styleUrls: ['./director-approval.component.scss'],
})
export class DirectorApprovalComponent implements OnInit {
  user: any = null;
  users: any[] = [];
  membername: string = '';
  isLoading: boolean = true;

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private approvalService: ApprovalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.auth.validateToken().subscribe((res) => {
      if (!(res && res.success)) {
        return;
      }
      const user = res.user as UserData;
      this.user = user;

      this.getPendingApprovals();
    });
  }

  openUserModal(user: any): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: { user, access: 'edit' },
      width: '70%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPendingApprovals();
    });
  }

  getPendingApprovals(): void {
    this.isLoading = true;
    this.approvalService
      .getDirectorApprovals('pending')
      .subscribe(
        (data: any) => {
          this.users = data;
        },
        (error: any) => {
          console.error('Error fetching pending approvals', error);
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
}
