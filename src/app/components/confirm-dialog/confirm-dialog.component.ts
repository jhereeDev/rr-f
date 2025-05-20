// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Update</h2>
    <mat-dialog-content>
      <p>Are you sure you want to update this reward entry?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">
        Confirm
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-actions {
        padding: 16px 24px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        border-top: 1px solid #e0e0e0;

        button[color='primary'] {
          background-color: #128354 !important;
          color: white !important;
          border-radius: 100px !important;
        }

        button:not([color='primary']) {
          color: #a21127 !important;
          border-radius: 100px !important;
          padding: 0 24px !important;
          background: transparent !important;
          border: 1px solid #a21127 !important;
        }
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
