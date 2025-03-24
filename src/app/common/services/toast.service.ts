import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar'],
  };

  private toastConfigs = {
    success: {
      panelClass: ['custom-snackbar', 'snackbar-success'],
      icon: '✓',
    },
    error: {
      panelClass: ['custom-snackbar', 'snackbar-error'],
      icon: '✕',
    },
    warning: {
      panelClass: ['custom-snackbar', 'snackbar-warning'],
      icon: '⚠',
    },
    info: {
      panelClass: ['custom-snackbar', 'snackbar-info'],
      icon: 'ℹ',
    },
  };

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: ToastType = 'info'): void {
    const config = {
      ...this.defaultConfig,
      panelClass: this.toastConfigs[type].panelClass,
    };

    const messageWithIcon = `${this.toastConfigs[type].icon} ${message}`;
    this.snackBar.open(messageWithIcon, 'Close', config);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }
}
