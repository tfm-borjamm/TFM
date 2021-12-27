import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserResolver } from './resolvers/user.resolver';
import { ItsMeGuard } from './guards/its-me.guard';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    resolve: { user: UserResolver },
  },
  {
    path: 'profile-form/:id',
    component: UserFormComponent,
    canActivate: [AuthGuard, ItsMeGuard],
    resolve: { user: UserResolver },
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
