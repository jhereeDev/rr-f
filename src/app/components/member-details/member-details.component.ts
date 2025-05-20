// member-details.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../common/services/toast.service';

interface RewardEntry {
  id: number;
  category: string;
  accomplishment: string;
  points: number;
  shortDescription: string;
  status: string;
  date: string;
  notes: string;
  attachments?: any[];
}

interface Attachment {
  filename: string;
  path: string;
  type?: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  editProjectForm: FormGroup;
  accomplishments = ['OSAP >9.5', 'Clients/PBU Commendation'];
  rewardEntries: RewardEntry[] = [];
  displayedColumns: string[] = [
    'category',
    'accomplishment',
    'points',
    'shortDescription',
    'status',
    'date',
    'notes',
    'attachments',
  ];

  // For PDF viewer
  selectedAttachmentIndex: number = -1;
  selectedAttachment: Attachment | null = null;
  activeEntryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MemberDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: any },
    private toastService: ToastService
  ) {
    // Initialize the form for editing a specific project
    this.editProjectForm = this.fb.group({
      rewardPoints: ['10', Validators.required],
      accomplishment: ['Clients/PBU Commendation', Validators.required],
    });

    // Load mock reward entries
    this.loadRewardEntries();
  }

  ngOnInit(): void {}

  loadRewardEntries(): void {
    this.rewardEntries = [
      {
        id: 1,
        category: 'Clients',
        accomplishment: 'OSAP >9.5',
        points: 10,
        shortDescription: 'This is a Sample Project short description',
        status: 'Approved',
        date: '3/10/2025, 3:59 PM',
        notes: 'No notes',
        attachments: [{ filename: 'doc1.pdf', path: 'path/to/doc1.pdf' }],
      },
      {
        id: 2,
        category: 'Clients',
        accomplishment: 'Clients/PBU Commendation',
        points: 10,
        shortDescription: 'Sample Project',
        status: 'Rejected',
        date: '3/10/2025, 3:59 PM',
        notes: 'Please Provide Attachment',
        attachments: [{ filename: 'doc2.pdf', path: 'path/to/doc2.pdf' }],
      },
      {
        id: 3,
        category: 'Clients',
        accomplishment: 'OSAP >9.5',
        points: 10,
        shortDescription: 'This is a Sample Project short description',
        status: 'Approved',
        date: '3/10/2025, 3:59 PM',
        notes: 'No notes',
        attachments: [{ filename: 'doc3.pdf', path: 'path/to/doc3.pdf' }],
      },
      {
        id: 4,
        category: 'Clients',
        accomplishment: 'OSAP >9.5',
        points: 10,
        shortDescription: 'This is a Sample Project short description',
        status: 'Approved',
        date: '3/10/2025, 3:59 PM',
        notes: 'No notes',
        attachments: [{ filename: 'doc4.pdf', path: 'path/to/doc4.pdf' }],
      },
    ];
  }

  viewAttachment(entryId: number, attachmentIndex: number): void {
    const entry = this.rewardEntries.find((e) => e.id === entryId);
    if (entry && entry.attachments && entry.attachments.length > 0) {
      this.activeEntryId = entryId;
      this.selectedAttachmentIndex = attachmentIndex;
      this.selectedAttachment = entry.attachments[attachmentIndex];
    }
  }

  onSubmit(): void {
    if (this.editProjectForm.valid) {
      // Here you would call the service to update the project
      this.toastService.success('Project updated successfully');
    } else {
      this.editProjectForm.markAllAsTouched();
      this.toastService.warning(
        'Please fill out all required fields correctly'
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
