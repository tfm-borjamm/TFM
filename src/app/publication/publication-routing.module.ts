import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { Role } from '../shared/enums/role.enum';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { PublicationFormComponent } from './components/publication-form/publication-form.component';
import { PublicationListComponent } from './components/publication-list/publication-list.component';
import { IsOwnerGuard } from './guards/is-owner.guard';
import { PublicationResolver } from './resolvers/publication.resolver';

const routes: Routes = [
  // Rutas públicas de todos los usuarios:
  { path: 'list', component: PublicationListComponent },
  { path: ':state/details/:id', component: PublicationDetailsComponent, resolve: { publication: PublicationResolver } },
  {
    path: 'item',
    component: PublicationFormComponent,
    data: { role: [Role.professional, Role.admin] },
    canActivate: [AuthGuard, RoleGuard],
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
    data: { role: Role.client },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'my-publications',
    component: PublicationListComponent,
    data: { role: Role.professional },
    canActivate: [AuthGuard, RoleGuard],
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
