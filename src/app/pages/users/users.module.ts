import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { UsersRoutingModule } from './users-routing.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [MyprofileComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    BrowserModule,
    NgModule,
    NgSelectModule,
  ],
})
export class UsersModule {}
