// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-member-confirm-dialog',
  templateUrl: './member-confirm-dialog.component.html',
  styleUrls: ['./member-confirm-dialog.component.scss'],
})
export class MemberConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MemberConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      confirmText: string;
      cancelText: string;
    }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
