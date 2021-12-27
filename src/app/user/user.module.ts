import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserFormComponent } from './components/user-form/user-form.component';
import { CountPipe } from './pipes/count.pipe';

// Angular material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ProfileComponent, UserFormComponent, CountPipe],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
  ],
})
export class UserModule {}
