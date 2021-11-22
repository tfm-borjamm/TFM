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
import { ShareButtonsComponent } from './components/share-buttons/share-buttons.component';
import { ContactButtonsComponent } from './components/contact-buttons/contact-buttons.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SocialButtonsBottomSheetComponent } from './components/social-buttons-bottom-sheet/social-buttons-bottom-sheet.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LoadingComponent,
    NoResultsComponent,
    SidenavComponent,
    MenuTabsComponent,
    PageNotFoundComponent,
    ShareButtonsComponent,
    ContactButtonsComponent,
    ConfirmationDialogComponent,
    SocialButtonsBottomSheetComponent,
  ],
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule, ReactiveFormsModule], // No Translate Module
  exports: [
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    NoResultsComponent,
    LoadingComponent,
    MenuTabsComponent,
    ShareButtonsComponent,
    ContactButtonsComponent,
    ConfirmationDialogComponent,
    SocialButtonsBottomSheetComponent,
  ],
})
export class SharedModule {}
