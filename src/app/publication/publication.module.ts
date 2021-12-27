import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { PublicationFormComponent } from './components/publication-form/publication-form.component';
import { PublicationItemComponent } from './components/publication-item/publication-item.component';
import { PublicationListComponent } from './components/publication-list/publication-list.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ImagePublicationPipe } from './pipes/image-publication.pipe';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { MatListModule } from '@angular/material/list';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PublicationDetailsComponent,
    PublicationFormComponent,
    PublicationItemComponent,
    PublicationListComponent,
    ImagePublicationPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InfiniteScrollModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    MatCarouselModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexLayoutModule,
    MatListModule,
    RouterModule,
  ],
  exports: [PublicationListComponent],
})
export class PublicationModule {}
