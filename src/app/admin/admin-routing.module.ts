import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminConsultDetailsComponent } from './components/admin-consult-details/admin-consult-details.component';
import { AdminConsultsComponent } from './components/admin-consults/admin-consults.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminPublicationsComponent } from './components/admin-publications/admin-publications.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { ConsultResolver } from './resolvers/consult.resolver';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'consults',
    component: AdminConsultsComponent,
  },
  {
    path: 'consult/details/:id',
    component: AdminConsultDetailsComponent,
    resolve: { consult: ConsultResolver },
  },
  {
    path: 'publications',
    component: AdminPublicationsComponent,
  },
  {
    path: 'users',
    component: AdminUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
