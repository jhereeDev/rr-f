import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent {
  adminCards = [
    {
      icon: 'assets/buttons/checklist.png',
      iconType: 'criteria',
      iconClass: 'criteria-icon-container',
      title: 'Rewards Criteria Management',
      description: 'Partner/Manager Checklist Criteria Edits',
      url: '/admin/criteria',
    },
    {
      icon: 'assets/buttons/trophy.png',
      iconType: 'member',
      iconClass: 'member-icon-container',
      title: 'Member Management',
      description: 'View and Edit Current Member Details',
      url: '/admin/members',
    },
    {
      icon: 'assets/buttons/graph.png',
      iconType: 'leaderboard',
      iconClass: 'leaderboard-icon-container',
      title: 'Leaderboards',
      description: 'Current Race Season leaderboard',
      url: '/admin/leaderboard',
    },
  ];
}
