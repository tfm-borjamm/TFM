import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { Role } from '../../../shared/enums/role.enum';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('btnFormGoogle') btnFormGoogle: MatButton;
  @ViewChild('btnFormFacebook') btnFormFacebook: MatButton;
  public loginForm: FormGroup;
  public email: FormControl;
  public password: FormControl;

  public FACEBOOK_ICON = '../../../../assets/images/facebook.svg';
  public GOOGLE_ICON = '../../../../assets/images/google.svg';

  public hide = true;
  public btnSubmitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private utilsService: UtilsService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.addIcons();
  }

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.loginForm = this.createForm();
  }

  addIcons() {
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl(this.FACEBOOK_ICON));
    this.matIconRegistry.addSvgIcon('google', this.domSanitizer.bypassSecurityTrustResourceUrl(this.GOOGLE_ICON));
  }

  createForm(): FormGroup {
    return (this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    }));
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.btnSubmitted = true;
      const email = this.loginForm.value.email.toLowerCase();
      const password = this.loginForm.value.password;
      this.authService
        .login(email, password)
        .then(() => {
          this.router.navigate(['/home']);
        })
        .catch((e) => {
          this.btnSubmitted = false;
          this.utilsService.errorHandling(e);
        });
    }
  }

  async onLoginProvider(provider: string) {
    this.setBlockedBtnSocial(provider, true);
    const userAuth = await this.authService.loginWithProvider(provider);
    if (!userAuth) {
      this.setBlockedBtnSocial(provider, false);
      return;
    }
    const isNewUser = userAuth?.additionalUserInfo?.isNewUser;
    if (isNewUser) {
      const date: string = userAuth.user.metadata.creationTime;

      const user: any = {
        id: userAuth.user.uid,
        email: userAuth.user.email.toLowerCase(),
        name: userAuth.user.displayName.toLowerCase(),
        added_date: new Date(date).getTime(),
      };
      this.userService
        .createUser(user)
        .then(() => {
          this.router.navigate(['access/register-social']);
        })
        .catch((e) => {
          this.utilsService.errorHandling(e);
          this.setBlockedBtnSocial(provider, false);
        });
    } else {
      this.router.navigate(['/home']);
    }
  }

  setBlockedBtnSocial(provider: string, disabled: boolean) {
    provider.includes('google') ? (this.btnFormGoogle.disabled = disabled) : (this.btnFormFacebook.disabled = disabled);
  }
}
