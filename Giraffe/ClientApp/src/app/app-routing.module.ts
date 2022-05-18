import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { ProposalComponent } from './client/proposal/proposal.component';
import { WebleadComponent } from './client/weblead/weblead.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { AuthGuard } from './guard/auth.guard';
import { LeadsComponent } from './pages/leads/leads.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { ItemgroupsComponent } from './pages/itemgroups/itemgroups.component';
import { ServicegroupsComponent } from './pages/servicegroups/servicegroups.component';
import { ItemsComponent } from './pages/items/items.component';
import { ServicesComponent } from './pages/services/services.component';
import { ProposaltemplateComponent } from './pages/proposaltemplate/proposaltemplate.component';
import { LeadsettingsComponent } from './pages/leadsettings/leadsettings.component';
import { UsersComponent } from './pages/users/users.component';
import { RolesComponent } from './pages/roles/roles.component';
import { PresentationComponent } from './pages/presentation/presentation.component';
import { PresentationSettingComponent } from './pages/presentation-setting/presentation-setting.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ConfirmMailComponent } from './login/confirm-mail/confirm-mail.component';
import { Error403Component } from './login/error403/error403.component';

const routes: Routes = [
  // App routes goes here here
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
      { path: 'leads/:id', component: LeadsComponent, canActivate: [AuthGuard] },
      { path: 'presentation', component: PresentationComponent, canActivate: [AuthGuard] },
      { path: 'account-settings', component: AccountSettingsComponent, canActivate: [AuthGuard] },
      { path: 'itemgroups', component: ItemgroupsComponent, canActivate: [AuthGuard] },
      { path: 'servicegroups', component: ServicegroupsComponent, canActivate: [AuthGuard] },
      { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
      { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
      { path: 'proposaltemplate', component: ProposaltemplateComponent, canActivate: [AuthGuard] },
      { path: 'leadsettings', component: LeadsettingsComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
      { path: 'presentation-settings', component: PresentationSettingComponent, canActivate: [AuthGuard] },
      { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard] },
      { path: 'customer/:id', component: CustomersComponent, canActivate: [AuthGuard] },
    ]
  },

  //no layout routes
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'confirm-mail', component: ConfirmMailComponent },
  { path: 'error403', component: Error403Component },
  // otherwise redirect to home
  //no layout routes
  { path: 'client/proposal/:id/:cmpn/:key', component: ProposalComponent },

  { path: 'client/weblead/:cmpn', component: WebleadComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
