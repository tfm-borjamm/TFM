import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from './guards/is-admin.guard';
import { PublicationDetailsComponent } from './publication/components/publication-details/publication-details.component';
import { PublicationFormComponent } from './publication/components/publication-form/publication-form.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { Role } from './shared/enums/role.enum';
import { RoleGuard } from './shared/guards/role.guard';
import { PublicationResolver } from './resolvers/publication.resolver';
import { IsOwnerGuard } from './guards/is-owner.guard';
import { HomeComponent } from './components/home/home.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { PublicationsComponent } from './components/publications/publications.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },

  {
    path: 'publication/:state/details/:id',
    component: PublicationDetailsComponent,
    resolve: { publication: PublicationResolver },
  },

  {
    path: 'favorites',
    component: FavoritesComponent,
    data: { role: Role.client },
    canActivate: [AuthGuard, RoleGuard],
  },

  {
    path: 'publications',
    component: PublicationsComponent,
    data: { role: Role.professional },
    canActivate: [AuthGuard, RoleGuard],
  },

  {
    path: 'publication',
    component: PublicationFormComponent,
    data: { role: [Role.professional, Role.admin] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'publication/:id',
    component: PublicationFormComponent,
    canActivate: [AuthGuard, IsOwnerGuard],
    resolve: { publication: PublicationResolver },
  },

  { path: 'access', loadChildren: () => import('./access/access.module').then((m) => m.AccessModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then((m) => m.UserModule) },
  { path: 'contact', loadChildren: () => import('./contact/contact.module').then((m) => m.ContactModule) },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    canLoad: [IsAdminGuard],
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
