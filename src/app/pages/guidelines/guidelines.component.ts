import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/common/services/auth.service';
import { CriteriaService } from 'src/app/common/services/criteria.service';
import { UserData } from 'src/app/models/user.model';
import { forkJoin } from 'rxjs';

interface CriteriaGroup {
  category: string;
  items: any[];
}

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.scss'],
})
export class GuidelinesComponent implements OnInit {
  criterias: any[] = [];
  groupedCriterias: CriteriaGroup[] = [];
  selectedCategory: string = 'all';
  directorApprovalFilter: string = 'all';
  user: UserData | null = null;
  userRole: any | null = null;
  title: any | null = null;
  activeTab: string = 'delivery';
  categoryOrder: { [key: string]: number } = {
    'Clients': 1,
    'Partners': 2,
    'Shareholders': 3
  };

  constructor(
    private sanitizer: DomSanitizer,
    private criteriaService: CriteriaService,
    private auth: AuthService
  ) {}

  sanitizeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnInit(): void {
    this.auth.validateToken().subscribe((res) => {
      if (!(res && res.success)) {
        return;
      }
      const user = res.user as UserData;
      this.user = user;
      this.userRole = this.user?.role_id;
      this.title = this.user?.member_title.toLowerCase();
      this.loadCriterias();
    });
  }

  loadCriterias(): void {
    // Fetch criteria based on user role
    if (this.userRole === 6) {
      // For role 6, fetch only partner criteria
      this.criteriaService.getAllPartnerCriteria().subscribe({
        next: (result) => {
          this.criterias = result.data || [];
          this.groupCriterias();
        },
        error: (error) => {
          console.error('Error loading partner criteria:', error);
        }
      });
    } else if (this.userRole === 5) {
      // For role 5, fetch only manager criteria
      this.criteriaService.getAllManagerCriteria().subscribe({
        next: (result) => {
          this.criterias = result.data || [];
          this.groupCriterias();
        },
        error: (error) => {
          console.error('Error loading manager criteria:', error);
        }
      });
    } else {
      // For other roles, fetch both criteria types (maintain original behavior)
      forkJoin({
        partner: this.criteriaService.getAllPartnerCriteria(),
        manager: this.criteriaService.getAllManagerCriteria()
      }).subscribe({
        next: (results) => {
          // Combine the results from both API calls
          const partnerCriteria = results.partner.data || [];
          const managerCriteria = results.manager.data || [];

          // Merge both arrays and sort by custom category order
          this.criterias = [...partnerCriteria, ...managerCriteria].sort((a: any, b: any) => {
            const orderA = this.categoryOrder[a.category] || 999;
            const orderB = this.categoryOrder[b.category] || 999;
            return orderA - orderB;
          });

          // Group the criteria as before
          this.groupCriterias();
        },
        error: (error) => {
          console.error('Error loading criteria:', error);
        }
      });
    }
  }

  groupCriterias(): void {
    // Get unique categories
    const uniqueCategories = [...new Set(this.criterias.map((item) => item.category))];

    // Sort categories according to custom order
    const sortedCategories = uniqueCategories.sort((a, b) => {
      const orderA = this.categoryOrder[a] || 999;
      const orderB = this.categoryOrder[b] || 999;
      return orderA - orderB;
    });

    this.groupedCriterias = sortedCategories.map((category) => ({
      category,
      items: this.criterias
        .filter((item) => item.category === category)
        .sort((a, b) => a.id - b.id), // Sort items within category by ID
    }));
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  onDirectorApprovalChange(value: string): void {
    // Set the filter value directly without toggling
    this.directorApprovalFilter = value;
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  shouldShowTabs(): boolean {
    return this.userRole === 5;
  }

  isManagerDelivery(): boolean {
    return this.title === 'manager consulting delivery';
  }

  isManagerExpert(): boolean {
    return this.title === 'manager consulting expert';
  }

  filterCriterias(items: any[]): any[] {
    let filteredItems = items;

    // Log initial items count

    // Check and log the data format of director_approval in the first few items
    if (items.length > 0) {
      const sampleItems = items.slice(0, Math.min(3, items.length));
    }

    // Apply director approval filter if not 'all'
    if (this.directorApprovalFilter !== 'all') {
      const requiresApproval = this.directorApprovalFilter === 'yes';

      // Count items by director approval status before filtering
      const approvalCount = items.filter(
        (item) => !!item.director_approval
      ).length;
      const noApprovalCount = items.filter(
        (item) => !item.director_approval
      ).length;

      filteredItems = filteredItems.filter((item) => {
        // Handle potential non-boolean values
        const directorApproval = !!item.director_approval;
        const matches = directorApproval === requiresApproval;

        return matches;
      });
    }

    return filteredItems;
  }

  getDisplayedCriterias(): any[] | CriteriaGroup[] {
    // First filter by tab if user is a manager
    let criteriaToFilter = this.criterias;

    if (this.userRole === 5) {
      if (this.activeTab === 'delivery') {
        criteriaToFilter = this.criterias.filter(
          (item) => item.type === 'DELIVERY' || item.type === 'BOTH'
        );
      } else if (this.activeTab === 'expert') {
        criteriaToFilter = this.criterias.filter(
          (item) => item.type === 'EXPERTS' || item.type === 'BOTH'
        );
      }
    }

    // Then continue with existing filtering logic
    if (this.selectedCategory === 'all') {
      // Apply filter and sort by custom category order
      const result = this.filterCriterias(criteriaToFilter).sort((a, b) => {
        const orderA = this.categoryOrder[a.category] || 999;
        const orderB = this.categoryOrder[b.category] || 999;
        return orderA - orderB;
      });
      return result;
    }

    // For grouped criterias, create groups from the filtered data
    const categories = [
      ...new Set(
        criteriaToFilter
          .filter((item) => item.category === this.selectedCategory)
          .map((item) => item.category)
      ),
    ];

    const filteredGroups = categories.map((category) => ({
      category,
      items: this.filterCriterias(
        criteriaToFilter.filter((item) => item.category === category)
      ),
    }));

    return filteredGroups;
  }

  isAllCategories(): boolean {
    return this.selectedCategory === 'all';
  }
}
