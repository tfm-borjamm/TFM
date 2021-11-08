import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { codes, provinces } from 'src/assets/mocks/variables';
import { Role } from '../../enums/role.enum';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { confirmPassword } from '../../validations/confirmPassword.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public user: User = new User();
  public registerForm: FormGroup;
  public name: FormControl;
  public email: FormControl;
  public street: FormControl;
  public province: FormControl;
  public role: FormControl;
  public telephone: FormControl;
  public cp: FormControl;
  public password: FormControl;
  public repeat_password: FormControl;
  public code: FormControl;
  public url: string;

  public roles: any;
  public provinces: string[] = provinces;
  public codes: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.codes = this.utilsService.setFormatPhonesCodes(codes);

    this.url = this.router.url;
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(55),
      Validators.pattern(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    ]);
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.street = new FormControl('', [Validators.required]);
    this.province = new FormControl('', [Validators.required]);
    this.role = new FormControl('', [Validators.required]);
    this.code = new FormControl('', [Validators.required]);
    this.telephone = new FormControl('', [Validators.required, Validators.maxLength(12)]);
    this.cp = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.repeat_password = new FormControl('', [Validators.required, Validators.minLength(8)]);

    // this.roles = Object.entries(Role).map((entry) => {
    //   const [key, value] = entry;
    //   return { key, value };
    // });

    this.roles = Object.values(Role);

    // this.roles = Object.keys(rol).map((key: string) => {
    //   return {
    //     code: key,
    //     value: rol[key],
    //   };
    // });

    this.registerForm = this.createForm();
  }

  createForm(): FormGroup {
    return (this.registerForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      street: this.street,
      province: this.province,
      role: this.role,
      code: this.code,
      telephone: this.telephone,
      cp: this.cp,
      passwords: this.formBuilder.group(
        {
          password: this.password,
          repeat_password: this.repeat_password,
        },
        { validator: confirmPassword }
      ),
    }));
  }

  onRegister() {
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email.toLowerCase();
      const password = this.registerForm.value.passwords.password;
      this.authService
        .register(email, password)
        .then((res) => {
          this.user.id = res.user.uid;
          this.user.name = this.registerForm.value.name;
          this.user.email = email;
          this.user.street = this.registerForm.value.street;
          this.user.role = this.registerForm.value.role;
          this.user.province = this.registerForm.value.province;
          this.user.code = this.registerForm.value.code;
          this.user.telephone = this.registerForm.value.telephone;
          this.user.cp = this.registerForm.value.cp;

          this.userService
            .createUser(this.user)
            .then(() => {
              this.registerForm.reset();
              console.log('Registrado correctamente');
              this.router.navigate(['publication/list']);
            })
            .catch((e) => this.utilsService.errorHandling(e));
        })
        .catch((e) => this.utilsService.errorHandling(e));
    }
  }

  // ngOnDestroy() {
  //   // this.subscriptionStateUsers.unsubscribe();
  // }
}
