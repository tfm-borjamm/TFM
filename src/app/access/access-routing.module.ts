import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterSocialComponent } from './components/register-social/register-social.component';
import { RegisterComponent } from './components/register/register.component';
import { IsAdminGuard } from './guards/is-admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'register-social',
    component: RegisterSocialComponent,
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'register/admin',
    component: RegisterComponent,
    canActivate: [AuthGuard, IsAdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRoutingModule {}
