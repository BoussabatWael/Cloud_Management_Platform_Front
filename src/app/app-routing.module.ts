import { PoliciesComponent } from './pages/Tools/policies/policies.component';
import { CommandsComponent } from './pages/Tools/commands/commands.component';
import { DeploymentsComponent } from './pages/deployments/deployments.component';
import { DetaildomaineNamesComponent } from './pages/domain_names/detaildomaine-names/detaildomaine-names.component';
import { ProvidersdetailsComponent } from './pages/firewall/providers/providersdetails/providersdetails.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';

import { ProvidersComponent } from './pages/firewall/providers/providers.component';
import { BackupsComponent } from './pages/images/backups/backups.component';
import { SnapshotsComponent } from './pages/images/snapshots/snapshots.component';
import { IndexComponent } from './pages/index/index.component';
import { AddaplicationComponent } from './pages/inventory-managment/applications/addaplication/addaplication.component';
import { ApplicationdetailsComponent } from './pages/inventory-managment/applications/applicationdetails/applicationdetails.component';
import { ApplicationsComponent } from './pages/inventory-managment/applications/applications.component';
import { ServerdetailsComponent } from './pages/inventory-managment/servers/serverdetails/serverdetails.component';
import { ServersComponent } from './pages/inventory-managment/servers/servers.component';

import { AntiMalwaresComponent } from './pages/scan/anti-malwares/anti-malwares.component';
import { AntiVirusComponent } from './pages/scan/anti-virus/anti-virus.component';
import { PerformanceComponent } from './pages/scan/performance/performance.component';
import { MyprofileComponent } from './pages/users/myprofile/myprofile.component';
import { UsercontactComponent } from './pages/users/usercontact/usercontact.component';
import { UsersComponent } from './pages/users/users/users.component';
import { DetailsbackupsComponent } from './pages/images/backups/detailsbackups/detailsbackups.component';
import { PackagesComponent } from './pages/inventory-managment/applications/packages/packages.component';
import { DomainNamesComponent } from './pages/domain_names/domain-names/domain-names.component';
import { WebsitesComponent } from './pages/domain_names/websites/websites.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'index', component: IndexComponent },
  { path: 'servers', component: ServersComponent },
  { path: 'my_profile', component: MyprofileComponent },
  { path: 'users', component: UsersComponent },
  { path: 'addapplication', component: AddaplicationComponent },
  { path: 'application-details/:id', component: ApplicationdetailsComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'contacts-profile/:id', component: UsercontactComponent },
  { path: 'servers/server-details/:id', component: ServerdetailsComponent },
  { path: 'domain_names', component: DomainNamesComponent },
  { path: 'websites', component: WebsitesComponent },
  { path: 'policies', component: PoliciesComponent },
  { path: 'providers', component: ProvidersComponent },
  { path: 'backups', component: BackupsComponent },
  { path: 'snapshots', component: SnapshotsComponent },
  { path: 'commands', component: CommandsComponent },
  { path: 'anti_virus', component: AntiVirusComponent },
  { path: 'anti_malwares', component: AntiMalwaresComponent },
  { path: 'performance', component: PerformanceComponent },
  {
    path: 'providers/providers-details/:id',
    component: ProvidersdetailsComponent,
  },
  { path: 'backups/backups-details/:id', component: DetailsbackupsComponent },
  {
    path: 'domain_names/domain-details/:id',
    component: DetaildomaineNamesComponent,
  },
  { path: 'packages', component: PackagesComponent },
  { path: 'deployment', component: DeploymentsComponent },
  { path: 'notifi', component: NotificationComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
