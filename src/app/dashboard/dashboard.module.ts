import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicationModule } from '../publication/publication.module';
import { ConsultModule } from '../consult/consult.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultAdminComponent } from './components/consult-admin/consult-admin.component';
import { ConsultDetailsComponent } from './components/consult-details/consult-details.component';
import { PublicationAdminComponent } from './components/publication-admin/publication-admin.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ConsultAdminComponent,
    ConsultDetailsComponent,
    PublicationAdminComponent,
    UserAdminComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, ChartsModule, SharedModule, ReactiveFormsModule, FormsModule],
})
export class DashboardModule {}
