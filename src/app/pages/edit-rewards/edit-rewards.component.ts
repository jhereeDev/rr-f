import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CriteriaService } from 'src/app/common/services/criteria.service';
import { ApprovalService } from 'src/app/common/services/approval.service';
import { RewardpointsService } from 'src/app/common/services/rewardpoints.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { ToastService } from 'src/app/common/services/toast.service';

const ALLOWED_FILE_TYPES = ['application/pdf'];
const CBPS_GROUP = [
  'None',
  'AT&T',
  'KPO & Customer Operations',
  'CI Financials',
  'IGM',
];

interface Chip {
  label: string;
  file?: File;
  existingFile?: boolean;
}

@Component({
  selector: 'app-edit-rewards',
  templateUrl: './edit-rewards.component.html',
  styleUrls: ['./edit-rewards.component.scss'],
})
export class EditRewardsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  editRewardsForm: FormGroup;
  id: string | null = null;
  criterias: any[] = [];
  categories: string[] = [];
  accomplishments: any[] = [];
  cbpsGroups = CBPS_GROUP;
  chips: Chip[] = [];
  deletedFiles: string[] = [];
  selectedFiles: File[] = [];
  existingFiles: any[] = [];
  submitted = false;
  loading = false;
  isUpdating = false;
  currentUser: any | null = null;

  constructor(
    private fb: FormBuilder,
    private criteriaService: CriteriaService,
    private snackBar: MatSnackBar,
    private approvalService: ApprovalService,
    private activatedRoute: ActivatedRoute,
    private rewardPointsService: RewardpointsService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.editRewardsForm = this.fb.group({
      shortDescription: ['', Validators.required],
      member: [{ value: '', disabled: true }],
      employeeNumber: [{ value: '', disabled: true }],
      category: [{ value: '', disabled: true }],
      accomplishment: [{ value: '', disabled: true }],
      rewardPoints: [{ value: '', disabled: true }],
      cbpsGroup: ['', Validators.required],
      status: [{ value: '', disabled: true }],
      raceSeason: [{ value: '', disabled: true }],
      managerName: [{ value: '', disabled: true }],
      directorName: [{ value: '', disabled: true }],
      date: [{ value: '', disabled: true }],
      projectName: ['', Validators.required],
      notes: [''],
      attachments: [''],
    });
  }

  ngOnInit() {
    this.loadCriterias();
    this.authService.validateToken().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.currentUser = res.user;
          this.loadRewardEntry();
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error validating token:', error);
        this.router.navigate(['/home']);
      },
    });
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
        this.showNotification(
          'Error loading criteria. Please try again.',
          'Close'
        );
      },
    });
  }

  loadRewardEntry(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const rewardId = params.get('id');
      this.id = rewardId;

      if (rewardId) {
        this.approvalService.getApproval(rewardId).subscribe({
          next: (res) => {
            const approval = res;
            // Check if the current user is the owner or the manager
            if (
              this.currentUser?.member_employee_id !==
                approval.rewards_entry.member_employee_id &&
              this.currentUser?.member_employee_id !== approval.manager_id
            ) {
              this.showNotification(
                'You do not have permission to edit this reward entry',
                'Close'
              );
              this.router.navigate(['/home']);
              return;
            } else {
              if (
                this.currentUser?.role_id === 6 &&
                approval.manager_approval_status !== 'rejected'
              ) {
                this.showNotification(
                  'You do not have permission to edit this reward entry',
                  'Close'
                );
                this.router.navigate(['/home']);
                return;
              }
              if (
                (this.currentUser?.role_id === 5 &&
                  approval.director_approval_status !== 'rejected') ||
                (this.currentUser?.role_id === 5 &&
                  approval.manager_approval_status === 'rejected')
              ) {
                this.showNotification(
                  'You do not have permission to edit this reward entry',
                  'Close'
                );
                this.router.navigate(['/home']);
                return;
              } else {
                this.editRewardsForm.patchValue({
                  shortDescription: approval.rewards_entry.short_description,
                  member: `${approval.member_firstname} ${approval.member_lastname}`,
                  employeeNumber: approval.rewards_entry.member_employee_id,
                  category: approval.rewards_criteria.category,
                  accomplishment: approval.rewards_criteria.accomplishment,
                  rewardPoints: approval.rewards_criteria.points,
                  cbpsGroup: approval.rewards_entry.cbps_group,
                  status: approval.director_approval_status,
                  raceSeason: approval.rewards_entry.race_season,
                  managerName: approval.manager_name,
                  directorName: approval.director_name,
                  date: approval.rewards_entry.date_accomplished,
                  projectName: approval.rewards_entry.project_name,
                  notes: approval.rewards_entry.notes,
                });

                if (approval.rewards_entry.attachments) {
                  this.existingFiles = approval.rewards_entry.attachments;
                  this.chips = this.existingFiles.map((file) => ({
                    label: file.filename,
                    existingFile: true,
                  }));
                  this.editRewardsForm.patchValue({
                    attachments: this.existingFiles,
                  });
                  this.editRewardsForm.get('attachments')?.markAsTouched();
                }
              }
            }
          },
          error: (error) => {
            this.showNotification(
              'Error loading reward entry. Please try again.',
              'Close'
            );
            this.router.navigate(['/home']);
          },
        });
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files) {
      this.addFiles(Array.from(element.files));
    }
  }

  addFiles(files: File[]): void {
    files.forEach((file) => {
      if (this.isValidFileType(file.type)) {
        this.selectedFiles.push(file);
        this.chips.push({ label: file.name, file: file });
        this.editRewardsForm.patchValue({ attachments: this.selectedFiles });
        this.editRewardsForm.get('attachments')?.markAsTouched();
      } else {
        this.showNotification(`Invalid file type: ${file.name}`, 'Close');
      }
    });
  }

  removeChip(chipToRemove: Chip): void {
    const index = this.chips.indexOf(chipToRemove);
    if (index >= 0) {
      this.chips.splice(index, 1);
      if (chipToRemove.file) {
        this.selectedFiles = this.selectedFiles.filter(
          (file) => file !== chipToRemove.file
        );
        if (
          this.selectedFiles.length === 0 &&
          this.existingFiles.length === 0
        ) {
          this.editRewardsForm.patchValue({ attachments: '' });
        } else {
          this.editRewardsForm.patchValue({ attachments: this.selectedFiles });
        }
      } else if (chipToRemove.existingFile) {
        this.deletedFiles.push(chipToRemove.label);
        this.existingFiles = this.existingFiles.filter(
          (file) => file.filename !== chipToRemove.label
        );
        if (
          this.selectedFiles.length === 0 &&
          this.existingFiles.length === 0
        ) {
          this.editRewardsForm.patchValue({ attachments: '' });
        }
      }
      this.editRewardsForm.get('attachments')?.markAsTouched();
    }
  }

  isValidFileType(fileType: string): boolean {
    return ALLOWED_FILE_TYPES.includes(fileType);
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    this.submitted = true;

    const hasAttachments =
      this.existingFiles.length > 0 || this.selectedFiles.length > 0;

    if (!hasAttachments) {
      this.editRewardsForm.get('attachments')?.setErrors({ required: true });
      this.toastService.warning('At least one attachment is required');
      return;
    }

    if (this.editRewardsForm.valid) {
      this.isUpdating = true;
      const formData = new FormData();

      formData.append(
        'short_description',
        this.editRewardsForm.get('shortDescription')?.value || ''
      );
      formData.append(
        'cbps_group',
        this.editRewardsForm.get('cbpsGroup')?.value || ''
      );
      formData.append(
        'project_name',
        this.editRewardsForm.get('projectName')?.value || ''
      );
      formData.append('notes', this.editRewardsForm.get('notes')?.value || '');

      // Append new files
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Append deleted files
      if (this.deletedFiles.length > 0) {
        formData.append('deleted_files', JSON.stringify(this.deletedFiles));
      }

      // Append existing files that weren't removed
      if (this.existingFiles.length > 0) {
        formData.append(
          'existing_files',
          JSON.stringify(this.existingFiles.map((file) => file.filename))
        );
      }

      // Log FormData contents
      console.log('FormData contents:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      this.rewardPointsService.updateRewardEntry(this.id, formData).subscribe({
        next: (res) => {
          this.isUpdating = false;
          this.toastService.success('Reward entry updated successfully');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error updating reward entry:', error);
          this.toastService.error('Error updating reward entry');
          this.isUpdating = false;
        },
      });
    } else {
      this.toastService.warning('Please fill out all required fields');
    }
  }

  get hasAttachments(): boolean {
    const hasFiles =
      this.existingFiles.length > 0 || this.selectedFiles.length > 0;
    if (hasFiles) {
      this.editRewardsForm.get('attachments')?.setErrors(null);
    }
    return hasFiles;
  }

  get isFormValid(): boolean {
    // Log invalid controls
    Object.keys(this.editRewardsForm.controls).forEach((key) => {
      const control = this.editRewardsForm.get(key);
      if (control?.invalid) {
        // console.log(`Invalid field: ${key}`, {
        //   errors: control.errors,
        //   value: control.value,
        //   touched: control.touched,
        //   dirty: control.dirty,
        // });
      }
    });

    return this.editRewardsForm.valid && this.hasAttachments;
  }
}
