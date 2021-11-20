import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/user/models/user.model';
import { AuthService } from 'src/app/user/services/auth.service';
import { languages } from '../../helpers/languages';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() public user: User;

  public languagesForm: FormGroup;
  public language: FormControl;
  public languages: string[] = languages;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    console.log('HEADER');
    this.languagesForm = this.createForm();
  }

  createForm(): FormGroup {
    // console.log(this.translateService);
    const lang = this.translateService.store.currentLang.toUpperCase();
    // const langValue = this.languages.includes(lang) ? lang : 'ES';
    this.language = new FormControl(lang, [Validators.required]);
    return (this.languagesForm = this.formBuilder.group({
      language: this.language,
    }));
  }

  onLanguage(language: string) {
    console.log('LANGUAGE: ', language);
    this.translateService.use(language.toLowerCase());
    console.log('Idioma cambiado satisfactoriamente');
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    // this.utilsService.clearLocalStorage();
    this.authService.logout();
    // this.router.navigate(['publication']);
    // if (this.router.url == '/publication/list') {
    //   // window.location.reload();
    // } else {
    this.router.navigate(['publication/list']);
    // }
  }
}
