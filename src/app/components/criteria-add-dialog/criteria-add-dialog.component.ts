// Enhanced criteria-add-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';

@Component({
  selector: 'app-criteria-add-dialog',
  templateUrl: './criteria-add-dialog.component.html',
  styleUrls: ['./criteria-add-dialog.component.scss'],
})
export class CriteriaAddDialogComponent implements OnInit {
  criteriaForm: FormGroup;
  existingCategories: string[] = [];
  criteriaTypes: string[] = ['EXPERTS', 'DELIVERY', 'BOTH'];
  isManager: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CriteriaAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      categories: string[];
      isManager: boolean;
      types?: string[];
    },
    private toastService: ToastService
  ) {
    this.existingCategories = data.categories || [];
    this.isManager = data.isManager || false;

    if (data.types && data.types.length > 0) {
      this.criteriaTypes = data.types;
    }

    this.criteriaForm = this.fb.group({
      category: ['', Validators.required],
      accomplishment: ['', Validators.required],
      points: ['', [Validators.required, Validators.min(1)]],
      guidelines: ['', Validators.required],
      director_approval: [this.isManager ? true : false],
      type: [
        this.criteriaTypes[0],
        this.isManager ? Validators.required : null,
      ],
      remarks: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.criteriaForm.valid) {
      const formData = this.criteriaForm.value;

      // Create the criteria object to send to the API
      const criteriaData = {
        category: formData.category,
        accomplishment: formData.accomplishment,
        points: parseInt(formData.points),
        guidelines: formData.guidelines,
        director_approval: formData.director_approval,
        type: this.isManager ? formData.type : 'BOTH', // Type is only relevant for manager criteria
        remarks: formData.remarks,
      };

      this.dialogRef.close(criteriaData);
    } else {
      this.criteriaForm.markAllAsTouched();
      this.toastService.warning('Please fill out all required fields');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
