import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { languages } from '../../helpers/languages';
import { UtilsService } from '../../services/utils.service';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() public user: User;
  @Output() snavStateOnChange = new EventEmitter();

  public languagesForm: FormGroup;
  public language: FormControl;
  public languages: string[] = languages;

  public ES_ICON = '../../../../assets/images/es.svg';
  public EN_ICON = '../../../../assets/images/en.svg';
  public LOGO_ICON = '../../../../assets/images/logo.svg';

  constructor(
    private authService: AuthService,
    public router: Router,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private utilsService: UtilsService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.addIcons();
  }

  ngOnInit(): void {
    console.log('HEADER');
    this.languagesForm = this.createForm();
  }

  addIcons() {
    this.matIconRegistry.addSvgIcon('es', this.domSanitizer.bypassSecurityTrustResourceUrl(this.ES_ICON));
    this.matIconRegistry.addSvgIcon('en', this.domSanitizer.bypassSecurityTrustResourceUrl(this.EN_ICON));
    this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl(this.LOGO_ICON));
  }

  createForm(): FormGroup {
    // console.log(this.translateService);
    const lang = this.translateService.store.currentLang;
    // const langValue = this.languages.includes(lang) ? lang : 'ES';
    this.language = new FormControl(lang, [Validators.required]);
    return (this.languagesForm = this.formBuilder.group({
      language: this.language,
    }));
  }

  onLanguage(event: MatSelectChange) {
    const language = event.value.trim();
    console.log('LANGUAGE: ', language);
    this.translateService.use(language);
    console.log('Idioma cambiado satisfactoriamente');
  }

  resetMenuTabs() {
    this.utilsService.removeLocalStorage('menu');
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    // this.utilsService.clearLocalStorage();
    this.authService.logout();
    // this.router.navigate(['publication']);
    // if (this.router.url == '/home') {
    //   // window.location.reload();
    // } else {
    this.router.navigate(['home']);
    // }
  }
}
