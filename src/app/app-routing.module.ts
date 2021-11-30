import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from './dashboard/guards/is-admin.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';

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
    path: 'contact',
    loadChildren: () => import('./consult/consult.module').then((m) => m.ConsultModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    canLoad: [IsAdminGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
