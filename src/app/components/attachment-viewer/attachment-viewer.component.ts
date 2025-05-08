import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-attachment-viewer',
  templateUrl: './attachment-viewer.component.html',
  styleUrls: ['./attachment-viewer.component.scss'],
})
export class AttachmentViewerComponent implements OnChanges {
  @Input() filePath: string = '';
  @Input() fileType: string = '';

  safeUrl: SafeResourceUrl | null = null;
  isImage: boolean = false;
  isPdf: boolean = false;
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filePath'] || changes['fileType']) {
      this.processFile();
    }
  }

  private processFile(): void {
    if (!this.filePath) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    // Determine file type based on extension or provided fileType
    const fileExt = this.getFileExtension(this.filePath);

    if (this.fileType === 'pdf' || fileExt === 'pdf') {
      this.isPdf = true;
      this.isImage = false;
    } else if (
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExt) ||
      this.fileType === 'image'
    ) {
      this.isImage = true;
      this.isPdf = false;
    } else {
      // Unsupported file type
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    // Create safe URL for the resource
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.filePath);
    this.isLoading = false;
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  onImageLoad(): void {
    this.isLoading = false;
  }

  onImageError(): void {
    this.hasError = true;
    this.isLoading = false;
  }
}
