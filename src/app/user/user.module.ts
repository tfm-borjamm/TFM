import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterSocialComponent } from './components/register-social/register-social.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserAdminComponent } from './components/user-admin/user-admin.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent, RegisterSocialComponent, ProfileComponent, UserAdminComponent],
  imports: [CommonModule, UserRoutingModule, FormsModule, ReactiveFormsModule, SharedModule],
})
export class UserModule {}
