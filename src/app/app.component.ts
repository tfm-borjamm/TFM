import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { User } from './shared/models/user.model';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';
import { Role } from './shared/enums/role.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TFM';

  public user: User;
  public loadInfomation: boolean = false;
  public firstTime: boolean;

  public subscriptionCurrentUser: Subscription;
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.firstTime = true;
    this.initializeApp();
  }

  async initializeApp() {
    this.translate.setDefaultLang('es');
    this.translate.use(this.translate.getBrowserLang());
    console.log('Idioma: ', this.translate.getDefaultLang());

    this.subscriptionCurrentUser = this.authService.getCurrentUser().subscribe(async (user: firebase.default.User) => {
      this.loadInfomation = false;
      if (user) {
        this.user = await this.userService.getUserById(user.uid);
      } else {
        this.user = null;
      }
      this.loadInfomation = true;
    });
  }

  ngOnDestroy(): void {
    if (!this.subscriptionCurrentUser.closed) {
      console.log('Esta abierto el subscribe!');
      this.subscriptionCurrentUser.unsubscribe();
    }
  }
}
