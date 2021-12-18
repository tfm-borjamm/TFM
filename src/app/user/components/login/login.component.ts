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
        .then((userAuth) => {
          // this.loginForm.reset();
          console.log('Inicio de sesión correcto');
          // this.router.navigate(['/publication/list']);
          this.routeNavigateHome(userAuth.user.uid);
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
    console.log('Usuario logueado:', userAuth);
    const isNewUser = userAuth?.additionalUserInfo?.isNewUser;
    if (isNewUser) {
      console.info('El usuario es nuevo en la plataforma');
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
          console.log('Se ha creado el usuario correctamente');
          this.router.navigate(['user/register-social']);
        })
        .catch((e) => {
          this.utilsService.errorHandling(e);
          this.setBlockedBtnSocial(provider, false);
        });
    } else {
      console.info('El usuario ya se había registrado');
      // const user = await this.userService.getUserById(userAuth.user.uid);
      // if (user?.role === Role.admin) {
      //   this.router.navigate(['/publication/admin']);
      // } else {
      // this.router.navigate(['/publication/list']);
      // }
      this.routeNavigateHome(userAuth.user.uid);
    }
  }

  setBlockedBtnSocial(provider: string, disabled: boolean) {
    if (provider.includes('google')) this.btnFormGoogle.disabled = disabled;
    else this.btnFormFacebook.disabled = disabled;
  }

  async routeNavigateHome(uid: string) {
    // const user = await this.userService.getUserById(uid);
    // if (user?.role === Role.admin) {
    //   this.router.navigate(['/dashboard']);
    // } else {
    //   this.router.navigate(['/publication/list']);
    // }
    this.router.navigate(['/publication/list']);
  }

  // async onLoginGoogle() {
  //   // const user = await this.authService.loginWithGoogle();
  //   const user = await this.authService.loginWithProvider('google.com');
  //   console.log('Usuario logueado:', user);

  //   const isNewUser = user?.additionalUserInfo?.isNewUser;
  //   if (isNewUser) {
  //     console.info('El usuario es nuevo en la plataforma');
  //   } else {
  //     console.info('El usuario ya se había registrado');
  //     this.router.navigate(['/publication/list']);
  //   }
  // }

  // async onLoginFacebook() {
  //   const user = await this.authService.loginWithProvider('facebook.com');
  //   console.log('Usuario logueado:', user);
  //   const isNewUser = user?.additionalUserInfo?.isNewUser;
  //   if (isNewUser) {
  //     console.info('El usuario es nuevo en la plataforma');
  //   } else {
  //     console.info('El usuario ya se había registrado');
  //     this.router.navigate(['/publication/list']);
  //   }
  // }
}
