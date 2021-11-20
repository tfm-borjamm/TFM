import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { PublicationAdminComponent } from './components/publication-admin/publication-admin.component';
import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { PublicationFormComponent } from './components/publication-form/publication-form.component';
import { PublicationListComponent } from './components/publication-list/publication-list.component';
import { ExistPublicationGuard } from './guards/exist-publication.guard';

const routes: Routes = [
  // Rutas públicas de todos los usuarios:
  { path: 'list', component: PublicationListComponent },
  { path: ':state/details/:id', component: PublicationDetailsComponent, canActivate: [ExistPublicationGuard] },
  {
    path: 'item',
    component: PublicationFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'item/:id',
    component: PublicationFormComponent,
    canActivate: [AuthGuard, ExistPublicationGuard],
  },
  {
    path: 'favorites',
    component: PublicationListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-publications',
    component: PublicationListComponent,
    canActivate: [AuthGuard],
  },

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
