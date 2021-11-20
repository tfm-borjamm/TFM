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

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LoadingComponent,
    NoResultsComponent,
    SidenavComponent,
    MenuTabsComponent,
    PageNotFoundComponent,
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
  ],
})
export class SharedModule {}
