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

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'submit-rewards',
    component: SubmitRewardsComponent,
    canActivate: [AuthGuard],
    data: { roles: [1, 5, 6] }, // Assuming roles 1 (admin), 5 (manager), and 6 (member) can submit rewards
  },
  {
    path: 'manager-approval',
    component: ManagerApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: [1, 5] }, // Assuming roles 1 (admin) and 5 (manager) can access manager approval
  },
  {
    path: 'director-approval',
    component: DirectorApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: [1, 4] }, // Assuming roles 1 (admin) and 4 (director) can access director approval
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
    data: { roles: [1, 5, 6] }, // Assuming roles 1 (admin), 5 (manager), and 6 (member) can view their reward points
  },
  {
    path: 'declined-entries',
    component: DeclinedEntriesComponent,
    canActivate: [AuthGuard],
    data: { roles: [1, 5] }, // Assuming roles 1 (admin) and 5 (manager) can view declined entries
  },
  {
    path: 'edit-rewards/:id',
    component: EditRewardsComponent,
    canActivate: [AuthGuard],
    data: { roles: [1, 5, 6] }, // Assuming roles 1 (admin), 5 (manager), and 6 (member) can edit rewards
  },
  {
    path: 'guidelines',
    component: GuidelinesComponent,
    canActivate: [AuthGuard],
    data: { roles: [1, 5, 6] }, // Assuming roles 1 (admin) and 5 (manager), and 6 (member) can view reward point guidelines
  },
  {
    path: 'admin-home',
    component: AdminHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [1, 5, 6] }, // Assuming roles 1 (admin), 5 (manager), and 6 (member) can view rewards history
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
