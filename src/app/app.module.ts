import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { A11yModule } from '@angular/cdk/a11y';

// import components here
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SubmitRewardsComponent } from './pages/submit-rewards/submit-rewards.component';
import { ManagerApprovalComponent } from './pages/manager-approval/manager-approval.component';
import { DirectorApprovalComponent } from './pages/director-approval/director-approval.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { UserModalComponent } from './components/user-points-modal/user-points-modal.component';
import { MyRewardPointsComponent } from './pages/my-reward-points/my-reward-points.component';
import { RewardPointsModalComponent } from './components/reward-points-modal/reward-points-modal.component';
import { DeclinedEntriesComponent } from './pages/declined-entries/declined-entries.component';
import { EditRewardsComponent } from './pages/edit-rewards/edit-rewards.component';
import { GuidelinesComponent } from './pages/guidelines/guidelines.component';
import { TermsDialogComponent } from './components/terms-dialog/terms-dialog.component';
import { WordLimitPipe } from './common/pipes/word-limit.pipe';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { CriteriaManagementComponent } from './pages/criteria-management/criteria-management.component';
import { CriteriaAddDialogComponent } from './components/criteria-add-dialog/criteria-add-dialog.component';
import { CriteriaEditDialogComponent } from './components/criteria-edit-dialog/criteria-edit-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MemberControlComponent } from './pages/member-control/member-control.component';
import { MemberAddDialogComponent } from './components/member-add-dialog/member-add-dialog.component';
import { MemberEditDialogComponent } from './components/member-edit-dialog/member-edit-dialog.component';
import { MemberDetailsComponent as ComponentsMemberDetailsComponent } from './components/member-details/member-details.component';
import { MemberMappingDialogComponent } from './components/member-mapping-dialog/member-mapping-dialog.component';
import { MemberConfirmDialogComponent } from './components/member-confirm-dialog/member-confirm-dialog.component';
import { CBPSLeaderboardComponent } from './pages/cbps-leaderboard/cbps-leaderboard.component';
import { MemberDetailsModule } from './pages/member-details.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SharedModule } from './shared/shared.module';
import { AdminEditRewardComponent } from './pages/admin-edit-reward/admin-edit-reward.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    SubmitRewardsComponent,
    ManagerApprovalComponent,
    DirectorApprovalComponent,
    LeaderboardComponent,
    UserModalComponent,
    MyRewardPointsComponent,
    RewardPointsModalComponent,
    DeclinedEntriesComponent,
    EditRewardsComponent,
    GuidelinesComponent,
    TermsDialogComponent,
    WordLimitPipe,
    AdminHomeComponent,
    CriteriaManagementComponent,
    CriteriaAddDialogComponent,
    CriteriaEditDialogComponent,
    ConfirmDialogComponent,
    MemberControlComponent,
    MemberAddDialogComponent,
    MemberEditDialogComponent,
    ComponentsMemberDetailsComponent,
    MemberMappingDialogComponent,
    MemberConfirmDialogComponent,
    CBPSLeaderboardComponent,
    ChangePasswordComponent,
    AdminEditRewardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    A11yModule,
    MemberDetailsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
