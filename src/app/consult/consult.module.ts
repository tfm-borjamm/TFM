import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultRoutingModule } from './consult-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultAdminComponent } from './components/consult-admin/consult-admin.component';
import { ConsultDetailsComponent } from './components/consult-details/consult-details.component';
import { ConsultFormComponent } from './components/consult-form/consult-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ConsultFormComponent, ConsultAdminComponent, ConsultDetailsComponent, ConsultFormComponent],
  imports: [CommonModule, ConsultRoutingModule, ReactiveFormsModule, FormsModule, SharedModule],
})
export class ConsultModule {}
