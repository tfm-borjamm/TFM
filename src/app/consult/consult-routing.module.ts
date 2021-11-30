import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { ConsultFormComponent } from './components/consult-form/consult-form.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultFormComponent,
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultRoutingModule {}
