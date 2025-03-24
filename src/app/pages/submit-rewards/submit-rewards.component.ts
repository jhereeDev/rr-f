import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/common/services/toast.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { CriteriaService } from 'src/app/common/services/criteria.service';
import { RewardpointsService } from 'src/app/common/services/rewardpoints.service';
import { UserData } from 'src/app/models/user.model';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'message/rfc822', // .eml files (standard email format)
  'application/vnd.ms-outlook', // .msg files (Outlook email format)
  'application/x-email', // Alternative MIME type for email files
];

const CBPS_GROUP = [
  'None',
  'AT&T',
  'KPO & Customer Operations',
  'CI Financials',
  'IGM',
];

interface Chip {
  id: string; // Add unique ID for better tracking
  label: string;
  file: File | undefined;
}

@Component({
  selector: 'app-submit-rewards',
  templateUrl: './submit-rewards.component.html',
  styleUrls: ['./submit-rewards.component.scss'],
})
export class SubmitRewardsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  rewardForm: FormGroup;
  user: UserData | null = null;
  criterias: any[] = [];
  categories: string[] = [];
  accomplishments: any[] = [];
  cbpsGroups = CBPS_GROUP;
  chips: Chip[] = [];
  selectedFiles: File[] = [];
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private criteriaService: CriteriaService,
    private rewardService: RewardpointsService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.rewardForm = this.fb.group({
      shortDescription: ['', Validators.required],
      projectName: ['', Validators.required],
      notes: [''],
      member: [{ value: '', disabled: true }],
      employeeNumber: [{ value: '', disabled: true }],
      managerName: [{ value: '', disabled: true }],
      directorName: [{ value: '', disabled: true }],
      raceSeason: [{ value: '', disabled: true }],
      status: [{ value: 'New', disabled: true }],
      category: ['', Validators.required],
      accomplishment: ['', Validators.required],
      rewardPoints: [{ value: '', disabled: true }],
      cbpsGroup: ['', Validators.required],
      dateAccomplished: ['', Validators.required],
      attachments: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadCriterias();
    this.setupAccomplishmentListener();
  }

  loadUserData(): void {
    this.auth.validateToken().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.user = res.user as UserData;
          this.updateFormWithUserData();
        }
      },
      error: (error) => {
        console.error('Error validating token:', error);
        this.toastService.error('Error loading user data. Please try again.');
      },
    });
  }

  updateFormWithUserData(): void {
    if (this.user) {
      this.rewardForm.patchValue({
        member: `${this.user.member_firstname} ${this.user.member_lastname}`,
        employeeNumber: this.user.member_employee_id,
        managerName: this.user.manager_name,
        directorName: this.user.director_name,
        raceSeason: this.user.fiscal_quarter,
      });
    }
  }

  loadCriterias(): void {
    this.criteriaService.getCriterias().subscribe({
      next: (res) => {
        this.criterias = res.data;
        this.categories = Array.from(
          new Set(this.criterias.map((item) => item.category))
        );
      },
      error: (error) => {
        console.error('Error fetching criteria:', error);
        this.toastService.error('Error loading criteria. Please try again.');
      },
    });
  }

  setupAccomplishmentListener(): void {
    this.rewardForm
      .get('accomplishment')
      ?.valueChanges.subscribe((accomplishmentId) => {
        if (accomplishmentId) {
          const selectedAccomplishment = this.accomplishments.find(
            (a) => a.id === accomplishmentId
          );
          if (selectedAccomplishment) {
            this.rewardForm.patchValue({
              rewardPoints: selectedAccomplishment.points,
            });
          }
        } else {
          this.rewardForm.patchValue({
            rewardPoints: '',
          });
        }
      });
  }

  onCategoryChange(category: string): void {
    this.accomplishments = this.criterias.filter(
      (criteria) => criteria.category === category
    );
    this.rewardForm.patchValue({
      accomplishment: '',
      rewardPoints: '',
    });
  }

  triggerFileInput(): void {
    // Reset the file input value to ensure we can select the same file again
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const files = Array.from(element.files);
      this.addFiles(files);
      // Reset the file input value after adding files
      element.value = '';
    }
  }

  addFiles(files: File[]): void {
    files.forEach((file) => {
      // Log the file type for debugging
      console.log(`Attempting to add file: ${file.name}, type: ${file.type}`);

      if (this.isValidFileType(file.type)) {
        const uniqueId = `file-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        this.selectedFiles.push(file);
        this.chips.push({ id: uniqueId, label: file.name, file: file });
        this.rewardForm.patchValue({ attachments: this.selectedFiles });
        this.rewardForm.get('attachments')?.markAsTouched();
      } else {
        // Log invalid file types for debugging
        console.warn(`Invalid file type rejected: ${file.name}, ${file.type}`);
        this.toastService.warning(
          `Invalid file type: ${file.name} (${file.type})`
        );
      }
    });
  }

  // This method is now more useful for debugging purposes
  updateChips(): void {
    console.log('Updating chips from selected files');
    this.chips = [];
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      Array.from(this.selectedFiles).forEach((file) => {
        if (this.isValidFileType(file.type)) {
          const uniqueId = `file-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          this.chips.push({
            id: uniqueId,
            label: file.name,
            file: file, // Keep the file reference
          });
        } else {
          this.toastService.warning(`Invalid file type: ${file.name}`);
        }
      });
    }
  }

  isValidFileType(fileType: string): boolean {
    // Enhanced validation with fallback for docx
    if (fileType === '') {
      console.warn('Empty file type detected');
      return false;
    }

    // Special handling for docx files - sometimes browsers report different MIME types
    if (
      fileType.includes('word') ||
      fileType.includes('document') ||
      fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return true;
    }

    const isValid = ALLOWED_FILE_TYPES.includes(fileType);
    console.log(`File type ${fileType} validity: ${isValid}`);
    return isValid;
  }

  addChip(): void {
    this.triggerFileInput();
  }

  removeChip(chipToRemove: Chip): void {
    console.log('Removing chip:', chipToRemove);

    // Use the chip ID for more reliable removal
    const index = this.chips.findIndex((chip) => chip.id === chipToRemove.id);

    if (index >= 0) {
      const removedChip = this.chips.splice(index, 1)[0];
      console.log('Removed chip at index:', index, removedChip);

      // Remove the file from selectedFiles by comparing file name (more reliable than object reference)
      if (removedChip.file) {
        this.selectedFiles = this.selectedFiles.filter(
          (file) => file.name !== removedChip.file?.name
        );
        console.log(
          'Remaining files:',
          this.selectedFiles.map((f) => f.name)
        );
      }

      if (this.selectedFiles.length === 0) {
        this.rewardForm.patchValue({ attachments: '' });
      } else {
        this.rewardForm.patchValue({ attachments: this.selectedFiles });
      }
      this.rewardForm.get('attachments')?.markAsTouched();
    } else {
      console.warn('Chip not found for removal:', chipToRemove);
    }
  }

  cancel(): void {
    this.rewardForm.reset({
      status: 'New',
      member: this.user
        ? `${this.user.member_firstname} ${this.user.member_lastname}`
        : '',
      employeeNumber: this.user?.member_employee_id || '',
      managerName: this.user?.manager_name || '',
      directorName: this.user?.director_name || '',
      raceSeason: this.user?.fiscal_quarter || '',
    });

    // Clear accomplishments array when canceling
    this.accomplishments = [];
    this.chips = [];
    this.selectedFiles = [];
    this.submitted = false;
    this.loading = false;

    // Reset file input element
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submitRewardPoints(): void {
    this.submitted = true;

    if (!this.hasAttachments) {
      this.rewardForm.get('attachments')?.setErrors({ required: true });
      this.toastService.warning('At least one attachment is required');
      return;
    }

    if (this.rewardForm.valid) {
      this.loading = true;
      const formData = new FormData();

      // Add the specified fields to the FormData
      formData.append(
        'short_description',
        this.rewardForm.get('shortDescription')?.value || ''
      );
      formData.append(
        'criteria_id',
        this.rewardForm.get('accomplishment')?.value || ''
      );

      // Format the date to 'YYYY-MM-DD' format
      const dateAccomplished = this.rewardForm.get('dateAccomplished')?.value;
      if (dateAccomplished) {
        const formattedDate = new Date(dateAccomplished)
          .toISOString()
          .split('T')[0];
        formData.append('date_accomplished', formattedDate);
      }

      formData.append(
        'cbps_group',
        this.rewardForm.get('cbpsGroup')?.value || ''
      );
      formData.append(
        'project_name',
        this.rewardForm.get('projectName')?.value || ''
      );
      formData.append('notes', this.rewardForm.get('notes')?.value || '');

      // Append files if any
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        Array.from(this.selectedFiles).forEach((file) => {
          formData.append('files', file);
        });
      }

      this.rewardService.submitRewardEntry(formData).subscribe({
        next: (res) => {
          this.toastService.success('Reward submission successful');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error submitting reward:', error);
          this.toastService.error('Error submitting reward. Please try again.');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      this.toastService.warning('Please fill out all required fields');
    }
  }

  get hasAttachments(): boolean {
    const hasFiles = this.selectedFiles.length > 0;
    if (hasFiles) {
      this.rewardForm.get('attachments')?.setErrors(null);
    }
    return hasFiles;
  }

  get isFormValid(): boolean {
    // Log invalid controls
    Object.keys(this.rewardForm.controls).forEach((key) => {
      const control = this.rewardForm.get(key);
      if (control?.invalid) {
        console.log(`Invalid field: ${key}`, {
          errors: control.errors,
          value: control.value,
          touched: control.touched,
          dirty: control.dirty,
        });
      }
    });

    return this.rewardForm.valid && this.hasAttachments;
  }
}
