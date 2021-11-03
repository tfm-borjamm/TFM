import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoResultsComponent } from './shared/components/no-results/no-results.component';

const routes: Routes = [
  { path: '', redirectTo: 'publication/list', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  // {
  //   path: 'publication',
  //   loadChildren: () => import('./publication/publication.module').then((m) => m.PublicationModule),
  // },
  // {
  //   path: 'contact',
  //   component: ContactComponent,
  // },
  { path: '**', component: NoResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
