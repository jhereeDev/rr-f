import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RewardpointsService } from 'src/app/common/services/rewardpoints.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit, OnChanges {
  @Input() filePath: string | null = null;
  @Input() fileName: string = 'Document';
  @Input() autoExpand: boolean = true;

  loading = false;
  pdfUrl: SafeResourceUrl | null = null;
  isExpanded = false;

  private previousFilePath: string | null = null;

  constructor(
    private rewardService: RewardpointsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Initial state
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if filePath has changed
    if (
      changes['filePath'] &&
      changes['filePath'].currentValue !== this.previousFilePath
    ) {
      // Clean up previous PDF if exists
      if (this.pdfUrl) {
        URL.revokeObjectURL(this.pdfUrl.toString());
        this.pdfUrl = null;
      }

      this.previousFilePath = this.filePath;

      // Auto-expand and load the new PDF
      if (this.filePath && this.autoExpand) {
        this.isExpanded = true;
        this.loadPdf();
      }
    }
  }

  togglePdfView(): void {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded && !this.pdfUrl && this.filePath) {
      this.loadPdf();
    }
  }

  loadPdf(): void {
    if (!this.filePath) {
      return;
    }

    this.loading = true;
    this.rewardService.downloadAttachment(this.filePath).subscribe({
      next: (pdfBlob: Blob) => {
        const pdfObjectUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(pdfObjectUrl);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading PDF:', error);
        this.loading = false;
      },
    });
  }

  openFullscreen(): void {
    if (!this.pdfUrl && this.filePath) {
      this.loadPdf();
    }

    const dialogRef = this.dialog.open(PdfFullscreenComponent, {
      width: '100%',
      height: '90vh',
      maxWidth: '100vw',
      data: {
        pdfUrl: this.pdfUrl,
        fileName: this.fileName,
        filePath: this.filePath,
      },
      panelClass: 'fullscreen-dialog',
    });

    // Handle closing dialog
    dialogRef.afterClosed().subscribe(() => {
      // Optionally do something after dialog closes
    });
  }

  ngOnDestroy(): void {
    // Clean up the object URL when component is destroyed
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl.toString());
    }
  }
}

@Component({
  selector: 'app-pdf-fullscreen',
  template: `
    <div class="fullscreen-pdf-container">
      <div class="pdf-header">
        <h2>{{ data.fileName }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div *ngIf="loading" class="pdf-loading">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Loading PDF...</p>
      </div>
      <iframe
        *ngIf="!loading && pdfUrl"
        [src]="pdfUrl"
        width="100%"
        height="calc(100% - 64px)"
        frameborder="0"
        class="pdf-iframe"
      ></iframe>
    </div>
  `,
  styles: [
    `
      .fullscreen-pdf-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .pdf-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        height: 64px;
        border-bottom: 1px solid #ddd;
      }
      .pdf-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      .pdf-iframe {
        border: none;
        flex: 1;
      }
    `,
  ],
})
export class PdfFullscreenComponent {
  loading = true;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pdfUrl: SafeResourceUrl | null;
      fileName: string;
      filePath: string | null;
    },
    private dialogRef: MatDialogRef<PdfFullscreenComponent>,
    private rewardService: RewardpointsService,
    private sanitizer: DomSanitizer
  ) {
    if (data.pdfUrl) {
      this.pdfUrl = data.pdfUrl;
      this.loading = false;
    } else if (data.filePath) {
      this.loadPdf(data.filePath);
    }
  }

  loadPdf(filePath: string): void {
    this.loading = true;
    this.rewardService.downloadAttachment(filePath).subscribe({
      next: (pdfBlob: Blob) => {
        const pdfObjectUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(pdfObjectUrl);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading PDF:', error);
        this.loading = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
