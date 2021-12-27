import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

const routes: Routes = [
  {
    path: '',
    component: ContactFormComponent,
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
