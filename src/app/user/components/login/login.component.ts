import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { Role } from '../../../shared/enums/role.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('btnForm') btnForm: ElementRef;
  public loginForm: FormGroup;
  public email: FormControl;
  public password: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.password = new FormControl('', [Validators.required]);
    this.loginForm = this.createForm();
  }

  createForm(): FormGroup {
    return (this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    }));
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.btnForm.nativeElement.disabled = true;
      const email = this.loginForm.value.email.toLowerCase();
      const password = this.loginForm.value.password;
      this.authService
        .login(email, password)
        .then(() => {
          this.loginForm.reset();
          console.log('Inicio de sesión correcto');
          this.router.navigate(['/publication/list']);
        })
        .catch((e) => {
          this.btnForm.nativeElement.disabled = false;
          this.utilsService.errorHandling(e);
        });
    }
  }

  async onLoginProvider(provider: string) {
    const userAuth = await this.authService.loginWithProvider(provider);
    if (!userAuth) return;
    console.log('Usuario logueado:', userAuth);
    const isNewUser = userAuth?.additionalUserInfo?.isNewUser;
    if (isNewUser) {
      console.info('El usuario es nuevo en la plataforma');
      const date: string = userAuth.user.metadata.creationTime;

      const user: any = {
        id: userAuth.user.uid,
        email: userAuth.user.email,
        name: userAuth.user.displayName,
        added_date: new Date(date).getTime(),
      };
      this.userService
        .createUser(user)
        .then(() => {
          console.log('Se ha creado el usuario correctamente');
          this.router.navigate(['user/register-social']);
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      console.info('El usuario ya se había registrado');
      // const user = await this.userService.getUserById(userAuth.user.uid);
      // if (user?.role === Role.admin) {
      //   this.router.navigate(['/publication/admin']);
      // } else {
      this.router.navigate(['/publication/list']);
      // }
    }
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
