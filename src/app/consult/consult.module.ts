import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultRoutingModule } from './consult-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ConsultAdminComponent } from './components/consult-admin/consult-admin.component';
import { ConsultDetailsComponent } from './components/consult-details/consult-details.component';

@NgModule({
  declarations: [ContactFormComponent, ConsultAdminComponent, ConsultDetailsComponent],
  imports: [CommonModule, ConsultRoutingModule, ReactiveFormsModule, FormsModule],
})
export class ConsultModule {}
