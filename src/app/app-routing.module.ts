import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SubmitRewardsComponent } from './pages/submit-rewards/submit-rewards.component';
import { ManagerApprovalComponent } from './pages/manager-approval/manager-approval.component';
import { DirectorApprovalComponent } from './pages/director-approval/director-approval.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { MyRewardPointsComponent } from './pages/my-reward-points/my-reward-points.component';
import { DeclinedEntriesComponent } from './pages/declined-entries/declined-entries.component';
import { EditRewardsComponent } from './pages/edit-rewards/edit-rewards.component';
import { GuidelinesComponent } from './pages/guidelines/guidelines.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { CriteriaManagementComponent } from './pages/criteria-management/criteria-management.component';
import { MemberControlComponent } from './pages/member-control/member-control.component';
import { CBPSLeaderboardComponent } from './pages/cbps-leaderboard/cbps-leaderboard.component';
import { MemberDetailsComponent } from './pages/member-details/member-details.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AdminEditRewardComponent } from './pages/admin-edit-reward/admin-edit-reward.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [4, 5, 6] }, // Only non-admin roles can access home
  },
  {
    path: 'submit-rewards',
    component: SubmitRewardsComponent,
    canActivate: [AuthGuard],
    data: { roles: [5, 6] }, // Assuming roles 1 (admin), 5 (manager), and 6 (member) can submit rewards
  },
  {
    path: 'manager-approval',
    component: ManagerApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: [5] }, // Assuming roles 1 (admin) and 5 (manager) can access manager approval
  },
  {
    path: 'director-approval',
    component: DirectorApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: [4] }, // Assuming roles 1 (admin) and 4 (director) can access director approval
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-reward-points',
    component: MyRewardPointsComponent,
    canActivate: [AuthGuard],
    data: { roles: [5, 6] }, // Assuming roles 1 (admin), 5 (manager), and 6 (member) can view their reward points
  },
  {
    path: 'declined-entries',
    component: DeclinedEntriesComponent,
    canActivate: [AuthGuard],
    data: { roles: [5] }, // Assuming roles 1 (admin) and 5 (manager) can view declined entries
  },
  {
    path: 'edit-rewards/:id',
    component: EditRewardsComponent,
    canActivate: [AuthGuard],
    data: { roles: [5, 6] }, // Assuming roles 1 (admin), 5 (manager), and 6 (member) can edit rewards
  },
  {
    path: 'guidelines',
    component: GuidelinesComponent,
    canActivate: [AuthGuard],
    data: { roles: [5, 6] }, // Assuming roles 1 (admin) and 5 (manager), and 6 (member) can view reward point guidelines
  },
  {
    path: 'admin/change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] }, // Admin role only
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] }, // Only admin role can access admin
  },
  {
    path: 'admin/change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] }, // Admin role only
  },
  {
    path: 'admin/criteria',
    component: CriteriaManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] },
  },
  {
    path: 'admin/members',
    component: MemberControlComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] }, // Admin role only
  },
  {
    path: 'admin/members/:id',
    component: MemberDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] }, // Admin role only
  },
  {
    path: 'admin/members/:memberId/rewards/:rewardId/edit',
    component: AdminEditRewardComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] }, // Admin role only
  },
  {
    path: 'admin/leaderboard',
    component: CBPSLeaderboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [1] }, // Admin role only
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // This will be handled by AuthGuard
  { path: '**', redirectTo: '/home' }, // This will be handled by AuthGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
