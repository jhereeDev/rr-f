import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

// Import from app/components instead of app/shared/components
import { PdfViewerComponent, PdfFullscreenComponent } from '../components/pdf-viewer/pdf-viewer.component';
import { AttachmentViewerComponent } from '../components/attachment-viewer/attachment-viewer.component';
import { AttachmentsContainerComponent } from '../components/attachments-container/attachments-container.component';

@NgModule({
  declarations: [
    PdfViewerComponent,
    PdfFullscreenComponent,
    AttachmentViewerComponent,
    AttachmentsContainerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  exports: [
    PdfViewerComponent,
    AttachmentViewerComponent,
    AttachmentsContainerComponent
  ]
})
export class SharedModule { }