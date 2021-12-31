import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from './shared/models/user.model';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';
import { Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TFM';

  mobileQuery: MediaQueryList;

  public user: User;
  public loadInformation: boolean = false;
  public firstTime: boolean;

  public subscriptionCurrentUser: Subscription;
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    private media: MediaMatcher
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 960px)');
  }

  ngOnInit() {
    this.initializeApp();
  }

  async initializeApp() {
    this.translate.setDefaultLang('es');
    this.translate.use(this.translate.getBrowserLang());

    this.subscriptionCurrentUser = this.authService.getCurrentUser().subscribe(async (user: firebase.default.User) => {
      this.loadInformation = false;
      if (user) {
        this.user = await this.userService.getUserById(user.uid);
      } else {
        this.user = null;
      }
      this.loadInformation = true;
    });
  }

  ngOnDestroy(): void {
    if (!this.subscriptionCurrentUser.closed) {
      this.subscriptionCurrentUser.unsubscribe();
    }
  }
}
