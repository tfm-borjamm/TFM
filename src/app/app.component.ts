import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { User } from './user/models/user.model';
import { AuthService } from './user/services/auth.service';
import { UserService } from './user/services/user.service';
import { Role } from './user/enums/role.enum';
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
        // if (this.user.role) {
        //   if (this.user.role === Role.admin) {
        //     // this.router.navigate(['user/admin']);
        //   } else {
        //     // this.router.navigate(['publication/list']);
        //   }
        // } else {
        //   // this.router.navigate(['user/register-social']);
        // }
      } else {
        this.user = null;
        // if (!this.firstTime)
        //   this.router
        //     .navigateByUrl('/user/login', { skipLocationChange: true })
        //     .then(() => this.router.navigate(['/']));
      }
      this.loadInfomation = true;
      // this.firstTime = false;
    });
  }

  ngOnDestroy(): void {
    if (!this.subscriptionCurrentUser.closed) {
      console.log('Esta abierto el subscribe!');
      this.subscriptionCurrentUser.unsubscribe();
    }
  }
}
