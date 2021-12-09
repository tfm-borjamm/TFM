import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuTabsComponent } from './components/menu-tabs/menu-tabs.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MomentModule } from 'ngx-moment';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SocialDialogComponent } from './components/social-dialog/social-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LoadingComponent,
    NoResultsComponent,
    SidenavComponent,
    MenuTabsComponent,
    PageNotFoundComponent,
    ConfirmDialogComponent,
    SocialDialogComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
  ], // No Translate Module
  exports: [
    TranslateModule,
    MomentModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    NoResultsComponent,
    LoadingComponent,
    MenuTabsComponent,
  ],
})
export class SharedModule {}
