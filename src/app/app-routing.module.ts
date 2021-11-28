import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { IsAdminGuard } from './shared/guards/is-admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'publication/list', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'publication',
    loadChildren: () => import('./publication/publication.module').then((m) => m.PublicationModule),
  },
  {
    path: 'consult',
    loadChildren: () => import('./consult/consult.module').then((m) => m.ConsultModule),
  },
  {
    path: 'admin',
    canActivate: [IsAdminGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
