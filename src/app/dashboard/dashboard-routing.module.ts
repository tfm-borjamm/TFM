import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ConsultAdminComponent } from './components/consult-admin/consult-admin.component';
import { ConsultDetailsComponent } from './components/consult-details/consult-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicationAdminComponent } from './components/publication-admin/publication-admin.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { ConsultResolver } from './resolvers/consult.resolver';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'consults',
    component: ConsultAdminComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'consult/details/:id',
    component: ConsultDetailsComponent,
    resolve: { consult: ConsultResolver },
  },
  {
    path: 'publications',
    component: PublicationAdminComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UserAdminComponent,
    // canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
