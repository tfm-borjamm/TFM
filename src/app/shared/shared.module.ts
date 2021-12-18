import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
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
import { CapitalizePipe } from './pipes/capitalize.pipe';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SocialDialogComponent } from './components/social-dialog/social-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';

import { FlexLayoutModule } from '@angular/flex-layout';

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
    CapitalizePipe,
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
    MatSelectModule,
    MatDividerModule,
    MatToolbarModule,
    MatMenuModule,
    FlexLayoutModule,
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
    CapitalizePipe,
  ],
  providers: [CapitalizePipe, TitleCasePipe],
})
export class SharedModule {}
