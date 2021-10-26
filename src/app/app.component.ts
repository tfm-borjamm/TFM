import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TFM';
  publications: Observable<any[]>;

  constructor(
    private translate: TranslateService,
    private db: AngularFireDatabase
  ) {
    this.publications = this.db.list('/publications').valueChanges();
  }

  ngOnInit() {
    this.initializeApp();
  }

  async initializeApp() {
    this.translate.setDefaultLang('es');
    this.translate.use(this.translate.getBrowserLang());
    console.log('Idioma: ', this.translate.getDefaultLang());
  }
}
