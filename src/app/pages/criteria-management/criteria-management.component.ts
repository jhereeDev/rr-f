// Enhanced criteria-management.component.ts
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CriteriaService } from '../../common/services/criteria.service';
import { ToastService } from '../../common/services/toast.service';
import { CriteriaEditDialogComponent } from '../../components/criteria-edit-dialog/criteria-edit-dialog.component';
import { CriteriaAddDialogComponent } from '../../components/criteria-add-dialog/criteria-add-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Criteria {
  id: number;
  category: string;
  accomplishment: string;
  points: number;
  guidelines: string;
  director_approval: boolean;
  type?: string; // EXPERTS, DELIVERY, BOTH
  isDraft?: boolean; // Frontend only flag for draft management
  published?: boolean; // Backend flag for published status
  remarks?: string;
}

@Component({
  selector: 'app-criteria-management',
  templateUrl: './criteria-management.component.html',
  styleUrls: ['./criteria-management.component.scss'],
})
export class CriteriaManagementComponent implements OnInit {
  isInDraftMode = false;
  selectedTab = 'managers';
  selectedCategory = 'all';
  isLoading = false;
  categories: string[] = [];
  allCategories: string[] = []; // Store all categories from both published and draft
  criteriaTypes: string[] = ['EXPERTS', 'DELIVERY', 'BOTH'];
  // Add custom category order
  categoryOrder: { [key: string]: number } = {
    'Clients': 1,
    'Partners': 2,
    'Shareholders': 3
  };

  displayedColumns: string[] = [
    'category',
    'accomplishment',
    'points',
    'guidelines',
    'director_approval',
    'remarks',
    'actions',
  ];

  // Add type for clarity
  filteredCriterias: Criteria[] = [];
  allCriterias: Criteria[] = [];
  managerCriterias: Criteria[] = [];
  partnerCriterias: Criteria[] = [];

  // Draft criteria storage
  managerDraftCriterias: Criteria[] = [];
  partnerDraftCriterias: Criteria[] = [];

  // For file upload
  fileUploadForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private criteriaService: CriteriaService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.fileUploadForm = this.fb.group({
      file: [''],
    });
  }

  ngOnInit() {
    // Load both published and draft criteria on init
    this.loadAllCriteriaCategories();
  }

  /**
   * Load all criteria categories from both published and draft
   */
  loadAllCriteriaCategories(): void {
    this.isLoading = true;

    // Load all criteria types to collect all possible categories
    Promise.all([
      this.criteriaService.getAllManagerCriteria().toPromise(),
      this.criteriaService.getAllPartnerCriteria().toPromise(),
      this.criteriaService.getAllManagerCriteriaDraft().toPromise(),
      this.criteriaService.getAllPartnerCriteriaDraft().toPromise(),
    ])
      .then(
        ([
          managerResponse,
          partnerResponse,
          managerDraftResponse,
          partnerDraftResponse,
        ]) => {
          let allCategories = new Set<string>();

          // Process published manager criteria
          if (
            managerResponse &&
            managerResponse.success &&
            managerResponse.data
          ) {
            this.managerCriterias = managerResponse.data.map((item: any) => ({
              ...item,
              isDraft: false,
              published: true,
            }));

            managerResponse.data.forEach((item: any) => {
              if (item.category) allCategories.add(item.category);
            });
          }

          // Process published partner criteria
          if (
            partnerResponse &&
            partnerResponse.success &&
            partnerResponse.data
          ) {
            this.partnerCriterias = partnerResponse.data.map((item: any) => ({
              ...item,
              isDraft: false,
              published: true,
            }));

            partnerResponse.data.forEach((item: any) => {
              if (item.category) allCategories.add(item.category);
            });
          }

          // Process draft manager criteria
          if (
            managerDraftResponse &&
            managerDraftResponse.success &&
            managerDraftResponse.data
          ) {
            this.managerDraftCriterias = managerDraftResponse.data.map(
              (item: any) => ({
                ...item,
                isDraft: true,
                published: false,
              })
            );

            managerDraftResponse.data.forEach((item: any) => {
              if (item.category) allCategories.add(item.category);
            });
          }

          // Process draft partner criteria
          if (
            partnerDraftResponse &&
            partnerDraftResponse.success &&
            partnerDraftResponse.data
          ) {
            this.partnerDraftCriterias = partnerDraftResponse.data.map(
              (item: any) => ({
                ...item,
                isDraft: true,
                published: false,
              })
            );

            partnerDraftResponse.data.forEach((item: any) => {
              if (item.category) allCategories.add(item.category);
            });
          }

          // Set the combined categories for use in dialogs
          this.allCategories = Array.from(allCategories).sort((a, b) => {
            const orderA = this.categoryOrder[a] || 999;
            const orderB = this.categoryOrder[b] || 999;
            return orderA - orderB;
          });

          // Combine all criteria for the current view (published by default)
          this.allCriterias = [
            ...this.managerCriterias,
            ...this.partnerCriterias,
          ].sort((a, b) => {
            const orderA = this.categoryOrder[a.category] || 999;
            const orderB = this.categoryOrder[b.category] || 999;
            return orderA - orderB;
          });

          // Apply initial filtering for published view
          this.filterCriterias();
          this.isLoading = false;
        }
      )
      .catch((error) => {
        console.error('Error loading criteria categories:', error);
        this.toastService.error(
          'Error loading criteria data. Please try again.'
        );
        this.isLoading = false;
      });
  }


 /**
 * Load published criteria (default view)
 */
loadPublishedCriterias(): void {
  this.isLoading = true;
  this.isInDraftMode = false; // Ensure draft mode flag is reset

  Promise.all([
    this.criteriaService.getAllManagerCriteria().toPromise(),
    this.criteriaService.getAllPartnerCriteria().toPromise(),
  ])
    .then(([managerResponse, partnerResponse]) => {
      if (
        managerResponse &&
        managerResponse.success &&
        managerResponse.data
      ) {
        this.managerCriterias = managerResponse.data.map((item: any) => ({
          ...item,
          isDraft: false,
          published: true,
        }));
      }

      if (
        partnerResponse &&
        partnerResponse.success &&
        partnerResponse.data
      ) {
        this.partnerCriterias = partnerResponse.data.map((item: any) => ({
          ...item,
          isDraft: false,
          published: true,
        }));
      }

      // Combine all criteria
      this.allCriterias = [
        ...this.managerCriterias,
        ...this.partnerCriterias,
      ];

      // Extract categories for current view (we already have all categories loaded)
      this.categories = [
        ...new Set(this.allCriterias.map((item) => item.category)),
      ];

      // Apply filtering
      this.filterCriterias();
      this.isLoading = false;

      // Force change detection to update the view immediately
      this.cdr.detectChanges();
    })
    .catch((error) => {
      console.error('Error loading published criteria:', error);
      this.toastService.error(
        'Error loading published criteria. Please try again.'
      );
      this.isLoading = false;
    });
}

  /**
 * Load draft criteria
 */
loadDraftCriterias(): void {
  this.isLoading = true;
  this.isInDraftMode = true; // Ensure draft mode flag is set

  console.log('Loading draft criteria, isInDraftMode:', this.isInDraftMode);

  Promise.all([
    this.criteriaService.getAllManagerCriteriaDraft().toPromise(),
    this.criteriaService.getAllPartnerCriteriaDraft().toPromise(),
  ])
    .then(([managerDraftResponse, partnerDraftResponse]) => {
      if (
        managerDraftResponse &&
        managerDraftResponse.success &&
        managerDraftResponse.data
      ) {
        this.managerDraftCriterias = managerDraftResponse.data.map(
          (item: any) => ({
            ...item,
            isDraft: true,
            published: false,
          })
        );
      }

      if (
        partnerDraftResponse &&
        partnerDraftResponse.success &&
        partnerDraftResponse.data
      ) {
        this.partnerDraftCriterias = partnerDraftResponse.data.map(
          (item: any) => ({
            ...item,
            isDraft: true,
            published: false,
          })
        );
      }

      // Update current criteria lists based on draft mode
      this.managerCriterias = this.managerDraftCriterias;
      this.partnerCriterias = this.partnerDraftCriterias;

      // Combine all criteria
      this.allCriterias = [
        ...this.managerCriterias,
        ...this.partnerCriterias,
      ];

      // Extract categories for current view (we already have all categories loaded)
      this.categories = [
        ...new Set(this.allCriterias.map((item) => item.category)),
      ];

      // Apply filtering with draft data
      this.filterCriterias();
      this.isLoading = false;

      console.log('Draft criteria loaded, isInDraftMode:', this.isInDraftMode);

      // Force change detection to update the view
      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });
    })
    .catch((error) => {
      console.error('Error loading draft criteria:', error);
      this.toastService.error(
        'Error loading draft criteria. Please try again.'
      );
      this.isLoading = false;
    });
}

  /**
   * Toggle between draft and published mode
   */
  toggleDraftMode(): void {
    this.isInDraftMode = !this.isInDraftMode;
    console.log('Draft mode toggled to:', this.isInDraftMode);

    if (this.isInDraftMode) {
      this.loadDraftCriterias();
    } else {
      this.loadPublishedCriterias();
    }

    // Force change detection
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('Change detection forced after toggle');
    }, 0);
  }

  /**
   * Handle tab change between managers and partners
   */
  onTabChange(tab: string): void {
    this.selectedTab = tab;
    this.filterCriterias();
  }

  /**
   * Handle category selection change
   */
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterCriterias();
  }

  /**
   * Filter criteria based on current selections (tab, category, draft mode)
   */
  filterCriterias(): void {
    this.isLoading = true;
    console.log('Filtering criteria, draft mode:', this.isInDraftMode);

    let filtered: Criteria[] = [];

    // First determine the correct source array based on draft mode
    let sourceList: Criteria[] = [];

    if (this.isInDraftMode) {
      // Use draft lists
      if (this.selectedTab === 'managers') {
        sourceList = [...this.managerDraftCriterias];
      } else {
        sourceList = [...this.partnerDraftCriterias];
      }
    } else {
      // Use published lists
      if (this.selectedTab === 'managers') {
        sourceList = [...this.managerCriterias.filter(c => !c.isDraft)];
      } else {
        sourceList = [...this.partnerCriterias.filter(c => !c.isDraft)];
      }
    }

    // Now filter the correct source by category
    filtered = [...sourceList];

    // Filter by category if not "all"
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(
        (criteria) => criteria.category === this.selectedCategory
      );
    }

    // Sort by custom category order
    filtered.sort((a, b) => {
      const orderA = this.categoryOrder[a.category] || 999;
      const orderB = this.categoryOrder[b.category] || 999;
      return orderA - orderB;
    });

    setTimeout(() => {
      this.filteredCriterias = filtered;
      this.isLoading = false;
      console.log('After filtering, found', filtered.length, 'criteria, draft mode still:', this.isInDraftMode);
    }, 300); // Small delay for better UX
  }

  /**
   * Open dialog to add a new criteria
   */
  openAddDialog(): void {
    const dialogRef = this.dialog.open(CriteriaAddDialogComponent, {
      width: '800px',
      disableClose: true,
      data: {
        categories: this.allCategories, // Use all categories from both published and draft
        isManager: this.selectedTab === 'managers',
        types: this.criteriaTypes,
        isDraft: this.isInDraftMode, // Pass current mode to dialog
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Set published flag based on current mode
        const criteriaData = {
          ...result,
          published: !this.isInDraftMode, // Set published based on mode
        };

        // Determine which API method to call based on current tab and draft mode
        let observable;
        if (this.selectedTab === 'managers') {
          observable = this.isInDraftMode
            ? this.criteriaService.addManagerCriteriaDraft(criteriaData)
            : this.criteriaService.addManagerCriteria(criteriaData);
        } else {
          observable = this.isInDraftMode
            ? this.criteriaService.addPartnerCriteriaDraft(criteriaData)
            : this.criteriaService.addPartnerCriteria(criteriaData);
        }

        observable.subscribe({
          next: (response: any) => {
            if (response && response.success) {
              this.toastService.success('Criteria added successfully');
              // Reload appropriate data based on current mode
              if (this.isInDraftMode) {
                this.loadDraftCriterias();
              } else {
                this.loadPublishedCriterias();
              }
              // Reload all categories to keep them in sync
              this.loadAllCriteriaCategories();
            } else {
              this.toastService.error('Failed to add criteria');
            }
          },
          error: (error: any) => {
            console.error('Error adding criteria:', error);
            this.toastService.error('Error adding criteria: ' + error.message);
          },
        });
      }
    });
  }

  /**
   * Open dialog to edit an existing criteria
   */
  openEditDialog(criteria: Criteria): void {
    const dialogRef = this.dialog.open(CriteriaEditDialogComponent, {
      width: '800px',
      disableClose: true,
      data: {
        criteria,
        categories: this.allCategories, // Use all categories from both published and draft
        isManager: this.selectedTab === 'managers',
        types: this.criteriaTypes,
        isDraft: this.isInDraftMode, // Pass current mode to dialog
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Preserve published status from the original criteria or set based on current mode
        const criteriaData = {
          ...result,
          published:
            criteria.published !== undefined
              ? criteria.published
              : !this.isInDraftMode,
        };

        // Determine which API method to call based on current tab and draft mode
        let observable;
        if (this.selectedTab === 'managers') {
          observable = this.isInDraftMode
            ? this.criteriaService.updateManagerCriteriaDraft(
                criteria.id,
                criteriaData
              )
            : this.criteriaService.updateManagerCriteria(
                criteria.id,
                criteriaData
              );
        } else {
          observable = this.isInDraftMode
            ? this.criteriaService.updatePartnerCriteriaDraft(
                criteria.id,
                criteriaData
              )
            : this.criteriaService.updatePartnerCriteria(
                criteria.id,
                criteriaData
              );
        }

        observable.subscribe({
          next: (response: any) => {
            if (response && response.success) {
              this.toastService.success('Criteria updated successfully');
              // Reload appropriate data based on current mode
              if (this.isInDraftMode) {
                this.loadDraftCriterias();
              } else {
                this.loadPublishedCriterias();
              }
              // Reload all categories to keep them in sync
              this.loadAllCriteriaCategories();
            } else {
              this.toastService.error('Failed to update criteria');
            }
          },
          error: (error: any) => {
            console.error('Error updating criteria:', error);
            this.toastService.error(
              'Error updating criteria: ' + error.message
            );
          },
        });
      }
    });
  }

  /**
   * Delete a criteria after confirmation
   */
  deleteCriteria(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Criteria',
        message:
          'Are you sure you want to delete this criteria? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Store the current state
        const currentDraftMode = this.isInDraftMode;
        console.log('Current draft mode before delete:', currentDraftMode);

        // Determine which API method to call based on current tab and draft mode
        let observable;
        if (this.selectedTab === 'managers') {
          observable = this.isInDraftMode
            ? this.criteriaService.deleteManagerCriteriaDraft(id)
            : this.criteriaService.deleteManagerCriteria(id);
        } else {
          observable = this.isInDraftMode
            ? this.criteriaService.deletePartnerCriteriaDraft(id)
            : this.criteriaService.deletePartnerCriteria(id);
        }

        observable.subscribe({
          next: (response: any) => {
            if (response && response.success) {
              this.toastService.success('Criteria deleted successfully');

              console.log('Draft mode during delete success:', this.isInDraftMode);

              // Run inside NgZone to ensure change detection
              this.ngZone.run(() => {
                // Just reload the current view - stay in draft mode if we were in draft mode
                if (currentDraftMode) {
                  console.log('Reloading draft criteria...');
                  // Reload draft view regardless of remaining items
                  this.isInDraftMode = true; // Explicitly set it before loading
                  this.loadDraftCriterias();
                } else {
                  console.log('Reloading published criteria...');
                  this.loadPublishedCriterias();
                }

                // Force another change detection cycle
                this.cdr.detectChanges();

                // Reload all categories to keep them in sync
                this.loadAllCriteriaCategories();
              });
            } else {
              this.toastService.error('Failed to delete criteria');
            }
          },
          error: (error: any) => {
            console.error('Error deleting criteria:', error);
            this.toastService.error(
              'Error deleting criteria: ' + error.message
            );
          },
        });
      }
    });
  }

  /**
   * Upload criteria via Excel file
   * @param event File input change event
   */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  /**
   * Upload selected Excel file
   */
  uploadExcelFile(): void {
    if (!this.selectedFile) {
      this.toastService.warning('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', this.selectedFile);
    formData.append('isDraft', this.isInDraftMode.toString()); // Pass draft mode to backend

    // Determine which API method to call based on current tab and draft mode
    let observable;
    if (this.selectedTab === 'managers') {
      observable = this.isInDraftMode
        ? this.criteriaService.uploadManagerCriteriaDraft(formData)
        : this.criteriaService.uploadManagerCriteria(formData);
    } else {
      observable = this.isInDraftMode
        ? this.criteriaService.uploadPartnerCriteriaDraft(formData)
        : this.criteriaService.uploadPartnerCriteria(formData);
    }

    this.isLoading = true;
    observable.subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.toastService.success('Criteria uploaded successfully');
          // Reload appropriate data based on current mode
          if (this.isInDraftMode) {
            this.loadDraftCriterias();
          } else {
            this.loadPublishedCriterias();
          }
          // Reload all categories to keep them in sync
          this.loadAllCriteriaCategories();
          this.selectedFile = null; // Reset file selection
        } else {
          this.toastService.error('Failed to upload criteria');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error uploading criteria:', error);
        this.toastService.error('Error uploading criteria: ' + error.message);
        this.isLoading = false;
      },
    });
  }

  /**
   * Mark a criteria as published (remove draft status)
   */
  publishCriteria(id: number): void {
    const criteria = this.allCriterias.find((c) => c.id === id);
    if (criteria) {
      // Call API to publish the criteria
      let observable;
      if (this.selectedTab === 'managers') {
        observable = this.criteriaService.publishManagerCriteria(id);
      } else {
        observable = this.criteriaService.publishPartnerCriteria(id);
      }

      this.isLoading = true;
      observable.subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.toastService.success('Criteria published successfully');

            // Remove the published item from the current filtered list
            this.filteredCriterias = this.filteredCriterias.filter(
              (c) => c.id !== id
            );

            // Also remove from the appropriate draft list
            if (this.selectedTab === 'managers') {
              this.managerCriterias = this.managerCriterias.filter(
                (c) => c.id !== id
              );
              this.managerDraftCriterias = this.managerDraftCriterias.filter(
                (c) => c.id !== id
              );
            } else {
              this.partnerCriterias = this.partnerCriterias.filter(
                (c) => c.id !== id
              );
              this.partnerDraftCriterias = this.partnerDraftCriterias.filter(
                (c) => c.id !== id
              );
            }

            // Update the allCriterias list
            this.allCriterias = this.allCriterias.filter((c) => c.id !== id);

            // If all items are published, show a helpful message
            if (this.filteredCriterias.length === 0) {
              this.toastService.info(
                'All criteria published. You can return to the published view.'
              );
            }

            this.isLoading = false;
          } else {
            this.toastService.error('Failed to publish criteria');
            this.isLoading = false;
          }
        },
        error: (error: any) => {
          console.error('Error publishing criteria:', error);
          this.toastService.error(
            'Error publishing criteria: ' + error.message
          );
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * Publish all draft criteria
   */
  publishAll(): void {
    if (this.filteredCriterias.length === 0) {
      this.toastService.info('No draft criteria to publish');
      return;
    }

    // Call API to publish all draft criteria
    let observable;
    if (this.selectedTab === 'managers') {
      observable = this.criteriaService.publishAllManagerCriteria();
    } else {
      observable = this.criteriaService.publishAllPartnerCriteria();
    }

    this.isLoading = true;
    observable.subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.toastService.success('All criteria published successfully');

          // Clear the current filtered list since all items are published
          this.filteredCriterias = [];

          // Clear the appropriate draft lists
          if (this.selectedTab === 'managers') {
            this.managerCriterias = [];
            this.managerDraftCriterias = [];
          } else {
            this.partnerCriterias = [];
            this.partnerDraftCriterias = [];
          }

          // Switch back to published view
          this.isInDraftMode = false;
          this.loadPublishedCriterias();
        } else {
          this.toastService.error('Failed to publish all criteria');
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Error publishing all criteria:', error);
        this.toastService.error(
          'Error publishing all criteria: ' + error.message
        );
        this.isLoading = false;
      },
    });
  }
}
