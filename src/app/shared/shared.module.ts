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

@NgModule({
  declarations: [FooterComponent, HeaderComponent, LoadingComponent, NoResultsComponent, SidenavComponent],
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule, ReactiveFormsModule], // No Translate Module
  exports: [TranslateModule, HeaderComponent, FooterComponent, SidenavComponent, NoResultsComponent, LoadingComponent],
})
export class SharedModule {}
