import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

@NgModule({
  declarations: [ContactFormComponent],
  imports: [
    CommonModule,
    ContactRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
  ],
})
export class ContactModule {}
