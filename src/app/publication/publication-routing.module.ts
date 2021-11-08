import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { PublicationFormComponent } from './components/publication-form/publication-form.component';
import { PublicationListComponent } from './components/publication-list/publication-list.component';

const routes: Routes = [
  // Rutas públicas de todos los usuarios:
  { path: 'list', component: PublicationListComponent },
  { path: 'details/:id', component: PublicationDetailsComponent },
  {
    path: 'item',
    component: PublicationFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'item/:id',
    component: PublicationFormComponent,
    canActivate: [AuthGuard],
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

  // {
  //   path: 'admin',
  //   component: PublicationAdminComponent,
  //   canActivate: [AuthGuard],
  // },
  { path: '**', redirectTo: '/list' },

  // { path: '', component: ProductListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  // { path: 'list', component: ProductListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicationRoutingModule {}
