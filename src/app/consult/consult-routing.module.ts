import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { IsAdminGuard } from '../shared/guards/is-admin.guard';
import { ConsultAdminComponent } from './components/consult-admin/consult-admin.component';
import { ConsultDetailsComponent } from './components/consult-details/consult-details.component';
import { ConsultFormComponent } from './components/consult-form/consult-form.component';
import { ConsultResolver } from './resolvers/consult.resolver';

const routes: Routes = [
  {
    path: 'contact',
    component: ConsultFormComponent,
  },

  {
    path: 'admin',
    component: ConsultAdminComponent,
    canActivate: [AuthGuard, IsAdminGuard],
  },

  {
    path: 'details/:id',
    component: ConsultDetailsComponent,
    canActivate: [AuthGuard, IsAdminGuard],
    resolve: { consult: ConsultResolver },
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultRoutingModule {}
