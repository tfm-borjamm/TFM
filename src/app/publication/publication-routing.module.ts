import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { PublicationAdminComponent } from './components/publication-admin/publication-admin.component';
import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { PublicationFormComponent } from './components/publication-form/publication-form.component';
import { PublicationListComponent } from './components/publication-list/publication-list.component';
import { HavePermissionsGuard } from './guards/have-permissions.guard';
import { IsClientGuard } from './guards/is-client.guard';
import { IsOwnerGuard } from './guards/is-owner.guard';
import { IsProfessionalGuard } from './guards/is-professional.guard';
import { PublicationResolver } from './resolvers/publication.resolver';

const routes: Routes = [
  // Rutas públicas de todos los usuarios:
  { path: 'list', component: PublicationListComponent },
  { path: ':state/details/:id', component: PublicationDetailsComponent, resolve: { publication: PublicationResolver } },
  {
    path: 'item',
    component: PublicationFormComponent,
    canActivate: [AuthGuard, HavePermissionsGuard],
  },
  {
    path: 'item/:id',
    component: PublicationFormComponent,
    canActivate: [AuthGuard, IsOwnerGuard],
    resolve: { publication: PublicationResolver },
  },
  {
    path: 'favorites',
    component: PublicationListComponent,
    canActivate: [AuthGuard, IsClientGuard],
  },
  {
    path: 'my-publications',
    component: PublicationListComponent,
    canActivate: [AuthGuard, IsProfessionalGuard],
  },

  // Pasar al módulo de dashboard!
  {
    path: 'admin',
    component: PublicationAdminComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', component: PageNotFoundComponent },

  // { path: '', component: ProductListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  // { path: 'list', component: ProductListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicationRoutingModule {}
