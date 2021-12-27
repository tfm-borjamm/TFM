import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminConsultsComponent } from './components/admin-consults/admin-consults.component';
import { AdminPublicationsComponent } from './components/admin-publications/admin-publications.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminConsultDetailsComponent } from './components/admin-consult-details/admin-consult-details.component';

import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AdminUsersComponent,
    AdminConsultsComponent,
    AdminPublicationsComponent,
    AdminDashboardComponent,
    AdminConsultDetailsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ChartsModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    MatSortModule,
    MatListModule,
    FlexLayoutModule,
  ],
})
export class AdminModule {}
