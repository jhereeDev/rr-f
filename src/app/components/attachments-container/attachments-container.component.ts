import { Component, Input, OnInit } from '@angular/core';

interface Attachment {
  filename: string;
  path: string;
  type?: string;
}

@Component({
  selector: 'app-attachments-container',
  templateUrl: './attachments-container.component.html',
  styleUrls: ['./attachments-container.component.scss'],
})
export class AttachmentsContainerComponent implements OnInit {
  @Input() attachments: Attachment[] = [];
  @Input() title: string = 'Attachments';

  selectedAttachmentIndex: number = -1;
  selectedAttachment: Attachment | null = null;

  constructor() {}

  ngOnInit(): void {
    this.selectFirstAttachment();
  }

  private selectFirstAttachment(): void {
    if (this.attachments && this.attachments.length > 0) {
      this.selectAttachment(0);
    }
  }

  selectAttachment(index: number): void {
    this.selectedAttachmentIndex = index;
    this.selectedAttachment = this.attachments[index];
  }

  getFileIcon(filename: string): string {
    const extension = this.getFileExtension(filename);

    if (extension === 'pdf') {
      return 'picture_as_pdf';
    } else if (
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)
    ) {
      return 'image';
    } else {
      return 'insert_drive_file';
    }
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }
}
