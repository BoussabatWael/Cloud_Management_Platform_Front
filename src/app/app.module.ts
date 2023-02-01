import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProvidersdetailsComponent } from './pages/firewall/providers/providersdetails/providersdetails.component';
import { DataTablesModule } from 'angular-datatables';
import {
  CommonModule,
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortDirective } from './directive/sort.directive';
import { AddaplicationComponent } from './pages/inventory-managment/applications/addaplication/addaplication.component';
import { ApplicationdetailsComponent } from './pages/inventory-managment/applications/applicationdetails/applicationdetails.component';

import { ApplicationsComponent } from './pages/inventory-managment/applications/applications.component';
import { ServerapplicationComponent } from './pages/inventory-managment/servers/serverdetails/serverapplication/serverapplication.component';
import { ServerdetailsComponent } from './pages/inventory-managment/servers/serverdetails/serverdetails.component';
import { ServersComponent } from './pages/inventory-managment/servers/servers.component';
import { UsercontactComponent } from './pages/users/usercontact/usercontact.component';
import { UsersComponent } from './pages/users/users/users.component';
import { FooterComponent } from './parts/footer/footer.component';

import { SearchFilterPipe } from './search-filter.pipe';
import { IndexComponent } from './pages/index/index.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { MyprofileComponent } from './pages/users/myprofile/myprofile.component';
import { DomainNamesComponent } from './pages/domain_names/domain-names/domain-names.component';
import { WebsitesComponent } from './pages/domain_names/websites/websites.component';

import { ProvidersComponent } from './pages/firewall/providers/providers.component';
import { BackupsComponent } from './pages/images/backups/backups.component';
import { SnapshotsComponent } from './pages/images/snapshots/snapshots.component';

import { AntiVirusComponent } from './pages/scan/anti-virus/anti-virus.component';
import { AntiMalwaresComponent } from './pages/scan/anti-malwares/anti-malwares.component';
import { PerformanceComponent } from './pages/scan/performance/performance.component';
import { Sidebar2Component } from './parts/sidebar2/sidebar2.component';
import { Navbar2Component } from './parts/navbar2/navbar2.component';
import { LoginComponent } from './login/login.component';

import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { DeploymentsComponent } from './pages/deployments/deployments.component';
import { DetailsbackupsComponent } from './pages/images/backups/detailsbackups/detailsbackups.component';
import { PackagesComponent } from './pages/inventory-managment/applications/packages/packages.component';
import { DetaildomaineNamesComponent } from './pages/domain_names/detaildomaine-names/detaildomaine-names.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationComponent } from './pages/notification/notification.component';
import { CommandsComponent } from './pages/Tools/commands/commands.component';
import { PoliciesComponent } from './pages/Tools/policies/policies.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,

    UsercontactComponent,
    UsersComponent,
    ServersComponent,
    ServerdetailsComponent,
    ApplicationsComponent,
    AddaplicationComponent,
    ApplicationdetailsComponent,

    ServerapplicationComponent,
    SearchFilterPipe,
    SortDirective,
    IndexComponent,
    NotfoundComponent,
    MyprofileComponent,
    DomainNamesComponent,
    WebsitesComponent,

    ProvidersComponent,
    BackupsComponent,
    SnapshotsComponent,

    AntiVirusComponent,
    AntiMalwaresComponent,
    PerformanceComponent,
    Sidebar2Component,
    Navbar2Component,
    LoginComponent,
    DeploymentsComponent,
    ProvidersdetailsComponent,
    DetailsbackupsComponent,
    PackagesComponent,
    DetaildomaineNamesComponent,
    DeploymentsComponent,
    NotificationComponent,
    CommandsComponent,
    PoliciesComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    DataTablesModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgbModule,
    FlatpickrModule.forRoot(),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
