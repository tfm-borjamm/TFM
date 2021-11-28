import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { IsAdminGuard } from '../shared/guards/is-admin.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterSocialComponent } from './components/register-social/register-social.component';
import { RegisterComponent } from './components/register/register.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { NotAuthGuard } from './guards/not-auth.guard';
import { UserResolver } from './resolvers/user.resolver';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver },
  },
  {
    path: 'profile-form/:id', // debe haber un guard para saber si es admin o es el propio user
    component: UserFormComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver },
  },
  {
    path: 'admin',
    component: UserAdminComponent,
    // canActivate: [AuthGuard],
  },

  {
    path: 'register/admin',
    component: RegisterComponent,
    canActivate: [AuthGuard, IsAdminGuard],
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
