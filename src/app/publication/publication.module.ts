import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicationRoutingModule } from './publication-routing.module';
import { PublicationDetailsComponent } from './components/publication-details/publication-details.component';
import { PublicationFormComponent } from './components/publication-form/publication-form.component';
import { PublicationItemComponent } from './components/publication-item/publication-item.component';
import { PublicationListComponent } from './components/publication-list/publication-list.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ImagePublicationPipe } from './pipes/image-publication.pipe';

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
    PublicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InfiniteScrollModule,
  ],
})
export class PublicationModule {}
