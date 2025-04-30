// member-mapping-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';

@Component({
  selector: 'app-member-mapping-dialog',
  templateUrl: './member-mapping-dialog.component.html',
  styleUrls: ['./member-mapping-dialog.component.scss'],
})
export class MemberMappingDialogComponent implements OnInit {
  isLoading = true;
  progress = 0;
  intervalId: any;

  constructor(
    private dialogRef: MatDialogRef<MemberMappingDialogComponent>,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.simulateProgressBar();
  }

  simulateProgressBar(): void {
    const increment = 20;
    this.intervalId = setInterval(() => {
      this.progress += increment;
      if (this.progress >= 100) {
        clearInterval(this.intervalId);
        // Simulate completion after a brief delay
        setTimeout(() => {
          this.isLoading = false;
          this.dialogRef.close('success');
          this.toastService.success('Member mapping updated successfully');
        }, 500);
      }
    }, 700);
  }

  cancel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.dialogRef.close('cancelled');
  }
}
