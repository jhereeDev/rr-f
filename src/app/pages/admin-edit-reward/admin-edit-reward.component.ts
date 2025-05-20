import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CriteriaService } from 'src/app/common/services/criteria.service';
import { ApprovalService } from 'src/app/common/services/approval.service';
import { MemberService } from 'src/app/common/services/member.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { ToastService } from 'src/app/common/services/toast.service';
import { finalize } from 'rxjs/operators';

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
  selector: 'app-admin-edit-reward',
  templateUrl: './admin-edit-reward.component.html',
  styleUrls: ['./admin-edit-reward.component.scss'],
})
export class AdminEditRewardComponent implements OnInit {
  adminEditForm: FormGroup;
  memberId: string | null = null;
  rewardId: string | null = null;
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
  rewardEntry: any = null;
  maxDate: Date = new Date(); // Set max date to today
  memberRoleId: number | null = null;
  memberJobTitle: string | null = null;
  requiresDirectorApproval: boolean = false;
  showManagerStatus: boolean = false;
  showDirectorStatus: boolean = false;

  constructor(
    private fb: FormBuilder,
    private criteriaService: CriteriaService,
    private snackBar: MatSnackBar,
    private approvalService: ApprovalService,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.adminEditForm = this.fb.group({
      shortDescription: ['', Validators.required],
      member: [{ value: '', disabled: true }],
      employeeNumber: [{ value: '', disabled: true }],
      category: ['', Validators.required],
      accomplishment: ['', Validators.required],
      rewardPoints: [{ value: '', disabled: true }],
      cbpsGroup: ['', Validators.required],
      managerApprovalStatus: [''],
      directorApprovalStatus: [''],
      raceSeason: [{ value: '', disabled: true }],
      managerName: [{ value: '', disabled: true }],
      directorName: [{ value: '', disabled: true }],
      date: ['', Validators.required],
      projectName: ['', Validators.required],
      notes: [''],
      attachments: [''],
    });
  }

  ngOnInit() {
    this.authService.validateToken().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.currentUser = res.user;

          // Verify the user is an admin
          if (this.currentUser.role_id !== 1) {
            this.toastService.error(
              'Access denied. Admin permissions required.'
            );
            this.router.navigate(['/home']);
            return;
          }

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
    // If we don't have the member's role ID yet, we can't load the criteria
    if (!this.memberRoleId) {
      console.error('Member role ID not available');
      this.toastService.error('Error loading criteria. Please try again.');
      return;
    }

    if (this.memberRoleId === 6) {
      // Load partner criteria for members (role_id = 6)
      this.criteriaService.getAllPartnerCriteria().subscribe({
        next: (res) => {
          this.criterias = res.data || [];
          this.categories = Array.from(
            new Set(this.criterias.map((item) => item.category))
          );
          this.updateFormWithCriteriaData();
        },
        error: (error) => {
          console.error('Error fetching partner criteria:', error);
          this.toastService.error('Error loading criteria. Please try again.');
        },
      });
    } else if (this.memberRoleId === 5) {
      // Load manager criteria for managers (role_id = 5)
      this.criteriaService
        .getAllManagerCriteria(false, this.memberJobTitle || undefined)
        .subscribe({
          next: (res) => {
            this.criterias = res.data || [];
            this.categories = Array.from(
              new Set(this.criterias.map((item) => item.category))
            );
            this.updateFormWithCriteriaData();
          },
          error: (error) => {
            console.error('Error fetching manager criteria:', error);
            this.toastService.error(
              'Error loading criteria. Please try again.'
            );
          },
        });
    } else {
      // Load default criteria for other roles
      this.criteriaService.getCriterias().subscribe({
        next: (res) => {
          this.criterias = res.data;
          this.categories = Array.from(
            new Set(this.criterias.map((item) => item.category))
          );
          this.updateFormWithCriteriaData();
        },
        error: (error) => {
          console.error('Error fetching criteria:', error);
          this.toastService.error('Error loading criteria. Please try again.');
        },
      });
    }
  }

  updateFormWithCriteriaData(): void {
    if (this.rewardEntry) {
      console.log(
        'Updating form with criteria data, points:',
        this.rewardEntry.rewards_criteria.points
      );
      // When criteria are loaded, update the form with the reward entry's data
      // specifically for the category and accomplishment
      this.adminEditForm.patchValue({
        category: this.rewardEntry.rewards_criteria.category,
        rewardPoints: this.rewardEntry.rewards_criteria.points,
      });
      console.log(
        'Form values after criteria update:',
        this.adminEditForm.value
      );
      this.onCategoryChange();
      this.adminEditForm.patchValue({
        accomplishment: this.rewardEntry.rewards_criteria.id,
      });
    }
  }

  onCategoryChange(): void {
    const selectedCategory = this.adminEditForm.get('category')?.value;
    this.accomplishments = this.criterias.filter(
      (item) => item.category === selectedCategory
    );
    this.adminEditForm.get('accomplishment')?.setValue('');
    this.adminEditForm.get('rewardPoints')?.setValue('');
  }

  onAccomplishmentChange(): void {
    const selectedAccomplishment =
      this.adminEditForm.get('accomplishment')?.value;
    const selectedCriteria = this.criterias.find(
      (item) => item.id === selectedAccomplishment
    );

    if (selectedCriteria) {
      this.adminEditForm.get('rewardPoints')?.setValue(selectedCriteria.points);
    }
  }

  loadRewardEntry(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.memberId = params.get('memberId');
      this.rewardId = params.get('rewardId');

      if (this.memberId && this.rewardId) {
        this.loading = true;
        this.approvalService
          .getApproval(this.rewardId)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe({
            next: (res) => {
              console.log('Reward Entry Response:', res);
              this.rewardEntry = res;
              this.requiresDirectorApproval =
                res.rewards_criteria.director_approval === 1 ? true : false;

              // Extract member employee ID to get their details including role ID
              const memberEmployeeId = this.rewardEntry.member_id;

              // Get the member's details to determine their role ID
              this.memberService.getMember(memberEmployeeId).subscribe({
                next: (memberData) => {
                  console.log('Member Data:', memberData);
                  if (memberData) {
                    this.memberRoleId = memberData.role_id;
                    this.memberJobTitle = memberData.jobTitle;

                    // Set visibility of status fields based on role and director approval
                    if (this.memberRoleId === 6) {
                      // For role ID 6 (member)
                      this.showManagerStatus = true; // Always show manager status
                      this.showDirectorStatus = this.requiresDirectorApproval; // Show director status only if director approval is required
                    } else if (this.memberRoleId === 5) {
                      // For role ID 5 (manager)
                      this.showManagerStatus = false; // Always hide manager status
                      this.showDirectorStatus = this.requiresDirectorApproval; // Always hide director status
                    }

                    // Now that we have the member's role ID, we can load the appropriate criteria
                    this.loadCriterias();
                  } else {
                    console.error('Failed to load member data');
                    this.toastService.error(
                      'Error loading member data. Using default criteria.'
                    );
                    this.memberRoleId = 6; // Default to member role
                    this.loadCriterias();
                  }
                },
                error: (error) => {
                  console.error('Error loading member data:', error);
                  this.toastService.error(
                    'Error loading member data. Using default criteria.'
                  );
                  this.memberRoleId = 6; // Default to member role
                  this.loadCriterias();
                },
              });

              // Populate form with reward entry data
              console.log(
                'Setting form values with reward points:',
                this.rewardEntry.rewards_criteria.points
              );

              // First set the reward points directly
              this.adminEditForm
                .get('rewardPoints')
                ?.setValue(this.rewardEntry.rewards_criteria.points);

              // Then set the rest of the form values
              this.adminEditForm.patchValue({
                shortDescription:
                  this.rewardEntry.rewards_entry.short_description,
                member: `${this.rewardEntry.member_firstname} ${this.rewardEntry.member_lastname}`,
                employeeNumber:
                  this.rewardEntry.rewards_entry.member_employee_id,
                cbpsGroup: this.rewardEntry.rewards_entry.cbps_group,
                managerApprovalStatus: this.rewardEntry.manager_approval_status,
                directorApprovalStatus:
                  this.rewardEntry.director_approval_status,
                raceSeason: this.rewardEntry.rewards_entry.race_season,
                managerName: this.rewardEntry.manager_name,
                directorName: this.rewardEntry.director_name,
                date: this.rewardEntry.rewards_entry.date_accomplished,
                projectName: this.rewardEntry.rewards_entry.project_name,
                notes: this.rewardEntry.rewards_entry.notes,
              });
              console.log('Form values after patch:', this.adminEditForm.value);

              // Set existing attachments
              if (this.rewardEntry.rewards_entry.attachments) {
                this.existingFiles = this.rewardEntry.rewards_entry.attachments;
                this.chips = this.existingFiles.map((file) => ({
                  label: file.filename,
                  existingFile: true,
                }));
                this.adminEditForm.patchValue({
                  attachments: this.existingFiles,
                });
                this.adminEditForm.get('attachments')?.markAsTouched();
              }
            },
            error: (error) => {
              console.error('Error loading reward entry:', error);
              this.toastService.error(
                'Error loading reward entry. Please try again.'
              );
              this.router.navigate(['/admin/members', this.memberId]);
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
        this.adminEditForm.patchValue({ attachments: this.selectedFiles });
        this.adminEditForm.get('attachments')?.markAsTouched();
      } else {
        this.toastService.error(`Invalid file type: ${file.name}`);
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
          this.adminEditForm.patchValue({ attachments: '' });
        } else {
          this.adminEditForm.patchValue({ attachments: this.selectedFiles });
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
          this.adminEditForm.patchValue({ attachments: '' });
        }
      }
    }
  }

  isValidFileType(fileType: string): boolean {
    return ALLOWED_FILE_TYPES.includes(fileType);
  }

  cancel(): void {
    this.router.navigate(['/admin/members', this.memberId]);
  }

  onSubmit(): void {
    if (this.adminEditForm.invalid) {
      this.adminEditForm.markAllAsTouched();
      return;
    }

    this.submitted = true;
    this.isUpdating = true;

    const formData = new FormData();

    // Log each value before appending to formData
    const shortDescription = this.adminEditForm.get('shortDescription')?.value;
    const category = this.adminEditForm.get('category')?.value;
    const criteriaId = this.adminEditForm.get('accomplishment')?.value;
    const cbpsGroup = this.adminEditForm.get('cbpsGroup')?.value;
    const managerApprovalStatus = this.adminEditForm.get(
      'managerApprovalStatus'
    )?.value;
    const directorApprovalStatus = this.adminEditForm.get(
      'directorApprovalStatus'
    )?.value;
    const raceSeason = this.adminEditForm.get('raceSeason')?.value;
    const dateAccomplished = this.adminEditForm.get('date')?.value;
    const projectName = this.adminEditForm.get('projectName')?.value;
    const notes = this.adminEditForm.get('notes')?.value;

    formData.append('shortDescription', shortDescription);
    formData.append('category', category);
    formData.append('criteriaId', criteriaId);
    formData.append('cbpsGroup', cbpsGroup);
    formData.append('managerApprovalStatus', managerApprovalStatus);
    formData.append('directorApprovalStatus', directorApprovalStatus);
    formData.append('raceSeason', raceSeason);
    formData.append('dateAccomplished', dateAccomplished);
    formData.append('projectName', projectName);
    formData.append('notes', notes);
    formData.append('deletedFiles', JSON.stringify(this.deletedFiles));

    // Append each file to the form data
    this.selectedFiles.forEach((file, index) => {
      formData.append(`files`, file);
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

    this.memberService
      .adminUpdateMemberRewardEntry(Number(this.rewardId), formData)
      .subscribe({
        next: (response) => {
          this.isUpdating = false;
          if (response && response.success) {
            this.toastService.success('Reward entry updated successfully');
            this.router.navigate(['/admin/members', this.memberId]);
          } else {
            this.toastService.error(
              response.error || 'Failed to update reward entry'
            );
          }
        },
        error: (error) => {
          this.isUpdating = false;
          console.error('Error updating reward entry:', error);
          this.toastService.error(
            error.error?.message || 'Error updating reward entry'
          );
        },
      });
  }

  get hasAttachments(): boolean {
    return (
      this.chips.length > 0 ||
      this.adminEditForm.get('attachments')?.value?.length > 0
    );
  }

  get isFormValid(): boolean {
    return (
      this.adminEditForm.valid && !this.isUpdating && !this.hasNoAttachments
    );
  }

  get hasNoAttachments(): boolean {
    return (
      this.chips.length === 0 &&
      (!this.adminEditForm.get('attachments')?.value ||
        this.adminEditForm.get('attachments')?.value.length === 0)
    );
  }
}
