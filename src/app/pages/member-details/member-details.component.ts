// member-details.component.ts with real data integration
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../common/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../common/services/member.service';
import { finalize } from 'rxjs/operators';

interface RewardEntry {
  id: number;
  category: string;
  accomplishment: string;
  points: number;
  shortDescription: string;
  status: string;
  date: string;
  notes: string;
  attachments?: Array<{
    filename: string;
    path: string;
    type?: string;
  }>;
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
  memberData: any = null;
  isLoading = false;
  errorMessage = '';

  // Current project attachments (can be updated after API integration)
  currentProjectAttachments: Attachment[] = [];

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService
  ) {
    // Initialize the form for editing a specific project
    this.editProjectForm = this.fb.group({
      rewardPoints: ['10', Validators.required],
      accomplishment: ['Clients/PBU Commendation', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get member ID from route params
    this.route.params.subscribe((params) => {
      const memberId = params['id'];
      this.loadMemberData(memberId);
      this.loadMemberRewardEntries(memberId);
    });
  }

  loadMemberData(memberId: string): void {
    this.isLoading = true;

    this.memberService
      .getMember(memberId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (member) => {
          if (member) {
            this.memberData = member;
          } else {
            this.errorMessage = 'Member not found';
            this.toastService.error(this.errorMessage);
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load member details';
          this.toastService.error(this.errorMessage);
        },
      });
  }

  loadMemberRewardEntries(memberId: string): void {
    this.isLoading = true;

    this.memberService
      .getMemberRewardEntries(memberId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (entries) => {
          this.rewardEntries = entries;

          // If there are entries, set the current project attachments from the first entry
          if (entries.length > 0 && entries[0].attachments) {
            this.currentProjectAttachments = entries[0].attachments;
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load reward entries';
          this.toastService.error(this.errorMessage);
          this.rewardEntries = [];
        },
      });
  }

  onSubmit(): void {
    if (this.editProjectForm.valid) {
      // Here you would call the service to update the project
      // For now, we'll just show a success toast
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

  goBack(): void {
    this.router.navigate(['/admin/members']);
  }

  viewAttachment(attachment: Attachment): void {
    // In a real application, you would use the RewardpointsService to download
    window.open(attachment.path, '_blank');
  }
}
