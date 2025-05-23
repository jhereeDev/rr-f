// Enhanced criteria-edit-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';

@Component({
  selector: 'app-criteria-edit-dialog',
  templateUrl: './criteria-edit-dialog.component.html',
  styleUrls: ['./criteria-edit-dialog.component.scss'],
})
export class CriteriaEditDialogComponent implements OnInit {
  criteriaForm: FormGroup;
  existingCategories: string[] = [];
  criteriaTypes: string[] = ['EXPERTS', 'DELIVERY', 'BOTH'];
  criteriaId: number;
  isManager: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CriteriaEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      criteria: any;
      categories: string[];
      isManager: boolean;
      types?: string[];
    },
    private toastService: ToastService
  ) {
    this.existingCategories = data.categories || [];
    this.criteriaId = data.criteria.id;
    this.isManager = data.isManager || false;

    if (data.types && data.types.length > 0) {
      this.criteriaTypes = data.types;
    }

    this.criteriaForm = this.fb.group({
      category: [data.criteria.category, Validators.required],
      accomplishment: [data.criteria.accomplishment, Validators.required],
      points: [data.criteria.points, [Validators.required, Validators.min(1)]],
      guidelines: [data.criteria.guidelines, Validators.required],
      director_approval: [data.criteria.director_approval],
      type: [
        data.criteria.type || this.criteriaTypes[0],
        this.isManager ? Validators.required : null,
      ],
      remarks: [data.criteria.remarks || ''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.criteriaForm.valid && this.criteriaForm.dirty) {
      this.dialogRef.close(this.criteriaForm.value);
    }
  }

  deleteCriteria(): void {
    this.dialogRef.close({ delete: true });
  }

  close(): void {
    this.dialogRef.close();
  }
}
