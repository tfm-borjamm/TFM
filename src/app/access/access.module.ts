import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessRoutingModule } from './access-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterSocialComponent } from './components/register-social/register-social.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, RegisterSocialComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    AccessRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    FlexLayoutModule,
  ],
})
export class AccessModule {}
