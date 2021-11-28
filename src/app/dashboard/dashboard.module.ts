import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PublicationModule } from '../publication/publication.module';
import { ConsultModule } from '../consult/consult.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, ChartsModule, SharedModule, FormsModule],
})
export class DashboardModule {}
