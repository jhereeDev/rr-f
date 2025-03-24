import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CriteriaService } from 'src/app/common/services/criteria.service';

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

  constructor(
    private sanitizer: DomSanitizer,
    private criteriaService: CriteriaService
  ) {}

  sanitizeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnInit(): void {
    this.loadCriterias();
  }

  loadCriterias(): void {
    this.criteriaService.getCriterias().subscribe({
      next: (res) => {
        this.criterias = res.data.sort((a: any, b: any) => a.id - b.id);
        this.groupCriterias();
      },
      error: (error) => {
        console.error('Error loading criteria:', error);
      },
    });
  }

  groupCriterias(): void {
    const categories = [
      ...new Set(this.criterias.map((item) => item.category)),
    ].sort();
    this.groupedCriterias = categories.map((category) => ({
      category,
      items: this.criterias
        .filter((item) => item.category === category)
        .sort((a, b) => a.id - b.id),
    }));
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  onDirectorApprovalChange(value: string): void {
    // Set the filter value directly without toggling
    this.directorApprovalFilter = value;
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
    if (this.selectedCategory === 'all') {
      const result = this.filterCriterias(this.criterias);
      return result;
    }

    // For grouped criterias, apply filter to each group's items

    const filteredGroups = this.groupedCriterias
      .filter((group) => group.category === this.selectedCategory)
      .map((group) => {
        const filteredItems = this.filterCriterias(group.items);

        return {
          ...group,
          items: filteredItems,
        };
      });

    return filteredGroups;
  }

  isAllCategories(): boolean {
    return this.selectedCategory === 'all';
  }
}
