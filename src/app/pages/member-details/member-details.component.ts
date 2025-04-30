import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../common/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface RewardEntry {
  id: number;
  category: string;
  accomplishment: string;
  points: number;
  shortDescription: string;
  status: string;
  date: string;
  notes: string;
  attachments?: string[];
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
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
  memberData: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
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
      // TODO: Fetch member data using the ID
      this.loadMemberData(memberId);
    });

    // Load mock reward entries
    this.loadRewardEntries();
  }

  loadMemberData(memberId: string): void {
    // In a real application, we would fetch this data from a service
    // For now, we're using mock data similar to member-control
    const mockMembers = [
      {
        id: '1',
        firstName: 'Angelica',
        lastName: 'Ware',
        jobTitle: 'Associate Consultant',
        department: 'PH022: Philippines Operations',
        manager: 'john.nunez@cgi.com',
        director: 'ronwald.king@cgi.com',
        status: 'Inactive',
      },
      {
        id: '2',
        firstName: 'Jheremiah',
        lastName: 'Figueroa',
        jobTitle: 'Associate Consultant',
        department: 'PH022: Philippines Operations',
        manager: 'john.nunez@cgi.com',
        director: 'ronwald.king@cgi.com',
        status: 'New Joiner',
      },
      {
        id: '3',
        firstName: 'Adrian',
        lastName: 'Magpili',
        jobTitle: 'Associate Consultant',
        department: 'PH022: Philippines Operations',
        manager: 'john.nunez@cgi.com',
        director: 'ronwald.king@cgi.com',
        status: 'Active',
      },
      {
        id: '4',
        firstName: 'Victor',
        lastName: 'Arias',
        jobTitle: 'Associate Consultant',
        department: 'PH022: Philippines Operations',
        manager: 'john.nunez@cgi.com',
        director: 'ronwald.king@cgi.com',
        status: 'Active',
      },
    ];

    // Find the member with the matching ID
    const member = mockMembers.find((m) => m.id === memberId);

    if (member) {
      this.memberData = member;
    } else {
      // If no member is found, use default data
      this.memberData = {
        id: memberId,
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Senior Developer',
        department: 'IT Department',
        manager: 'manager@example.com',
        director: 'director@example.com',
        status: 'Active',
      };
    }
  }

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
        attachments: ['doc1.pdf'],
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
        attachments: ['doc2.pdf'],
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
        attachments: ['doc3.pdf'],
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
        attachments: ['doc4.pdf'],
      },
    ];
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

  goBack(): void {
    this.router.navigate(['/admin/members']);
  }
}
