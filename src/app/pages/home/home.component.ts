import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { UserService } from 'src/app/common/services/user.service';
import { User, UserData } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  showPopup = true;
  dontShowAgain = false;
  userRole: any;
  fromButton = false;
  buttons = [
    {
      icon: 'assets/buttons/trophy.png',
      title: 'My Rewards Points',
      description: 'My Reward Points!',
      url: '/my-reward-points',
    },
    {
      icon: 'assets/buttons/arrow.png',
      title: 'Submit Reward Points',
      description: 'Submit Reward Points!',
      url: '/submit-rewards',
    },
    {
      icon: 'assets/buttons/clock.png',
      title: 'Pending Manager Approval',
      description: 'This is for Managers Permission Only',
      url: '/manager-approval',
    },
    {
      icon: 'assets/buttons/clock.png',
      title: 'Pending Director Approval',
      description: 'This is for Directors Permission Only',
      url: '/director-approval',
    },
    {
      icon: 'assets/buttons/close.png',
      title: 'Entries Declined by Director',
      description: 'Link for Managers',
      url: '/declined-entries',
    },
    {
      icon: 'assets/buttons/graph.png',
      title: 'Leaderboard',
      description: 'Race Season Leaderboard',
      url: '/leaderboard',
    },
    {
      icon: 'assets/buttons/checklist.png',
      title: 'Rewards Points Criteria',
      description: 'Rewards Points and Guidelines',
      url: '/guidelines',
    },
  ];

  constructor(private auth: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true; // Set loading to true before fetching data
    this.auth.validateToken().subscribe({
      next: (res) => {
        if (res && res.success) {
          this.user = res.user as UserData;
          this.userRole = this.user.role_id;
          this.checkPopupPreference();
        }
      },
      error: (error) => {
        console.error('Error validating token:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  showButton(button: {
    icon: string;
    title: string;
    description: string;
    url: string;
  }): boolean {
    const userRole = this.user?.role_id;

    if (button.title === 'Pending Manager Approval' && userRole != 5) {
      return false;
    } else if (button.title === 'Pending Director Approval' && userRole != 4) {
      return false;
    } else if (
      button.title === 'Entries Declined by Director' &&
      userRole != 5
    ) {
      return false;
    } else if (button.title === 'My Rewards Points' && userRole === 4) {
      return false;
    } else if (button.title === 'Submit Reward Points' && userRole === 4) {
      return false;
    } else if (button.title === 'Rewards Points Criteria' && userRole === 4) {
      return false;
    } else return true;
  }

  closePopup() {
    if (this.dontShowAgain) {
      this.userService.hidePopup().subscribe({
        next: (res) => {
          if (res && res.success) {
            localStorage.setItem('hidePopup', 'true');
          }
        },
        error: (error) => {
          console.error('Error hiding popup:', error);
        },
      });
    }
    localStorage.setItem('firstLogin', 'false');
    this.showPopup = false;
    this.fromButton = false;
  }

  checkPopupPreference() {
    const hidePopup = localStorage.getItem('hidePopup');
    const firstLogin = localStorage.getItem('firstLogin');
    if (hidePopup === 'true' || firstLogin === 'false') {
      this.showPopup = false;
    }
  }

  showPopupAgain() {
    this.showPopup = true;
    this.fromButton = true;
  }
}
