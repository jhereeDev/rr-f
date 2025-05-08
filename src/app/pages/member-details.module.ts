import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MemberDetailsComponent } from './member-details/member-details.component';
import { AttachmentViewerComponent } from '../components/attachment-viewer/attachment-viewer.component';
import { AttachmentsContainerComponent } from '../components/attachments-container/attachments-container.component';
import { AdminManagementComponent } from './admin/admin-management/admin-management.component';

@NgModule({
  declarations: [
    MemberDetailsComponent,
    AttachmentsContainerComponent,
    AttachmentViewerComponent,
    AdminManagementComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  exports: [MemberDetailsComponent],
})
export class MemberDetailsModule {}
