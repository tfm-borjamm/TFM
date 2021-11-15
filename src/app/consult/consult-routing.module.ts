import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoResultsComponent } from '../shared/components/no-results/no-results.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ConsultAdminComponent } from './components/consult-admin/consult-admin.component';
import { ConsultDetailsComponent } from './components/consult-details/consult-details.component';
import { ConsultFormComponent } from './components/consult-form/consult-form.component';

const routes: Routes = [
  {
    path: 'contact',
    component: ConsultFormComponent,
  },

  {
    path: 'admin',
    component: ConsultAdminComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'details/:id',
    component: ConsultDetailsComponent,
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    component: NoResultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultRoutingModule {}
