import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { codes } from 'src/app/shared/helpers/codes';
import { provinces } from 'src/app/shared/helpers/provinces';
import { Role } from '../../../shared/enums/role.enum';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { confirmPassword } from '../../validations/confirmPassword.validator';
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/shared/services/notification.service';

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

  public currentUserId: string;

  public hideConfirmPassword: boolean = true;
  public hidePassword: boolean = true;
  public btnSubmitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.codes = this.utilsService.setFormatPhonesCodes(codes);
    const numbersValidator = /^[0-9]*$/;
    const nameValidator = /^[\w'\-,.][^0-9_!????????/\\+=@#$%??&*(){}|~<>;:[\]]{2,}$/;

    this.url = this.router.url;
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(55),
      Validators.pattern(nameValidator),
    ]);
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.street = new FormControl('', [Validators.required]);
    this.province = new FormControl('', [Validators.required]);
    this.role = new FormControl('', [Validators.required]);
    this.code = new FormControl('', [Validators.required]);
    this.telephone = new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern(numbersValidator),
    ]);
    this.cp = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
      Validators.pattern(numbersValidator),
    ]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.repeat_password = new FormControl('', [Validators.required]);
    this.roles = Object.values(Role).filter((role) => role !== Role.admin);
    this.registerForm = this.createForm();
    this.currentUserId = await this.authService.getCurrentUserUID();
  }

  createForm(): FormGroup {
    return (this.registerForm = this.formBuilder.group(
      {
        name: this.name,
        email: this.email,
        street: this.street,
        province: this.province,
        role: this.role,
        code: this.code,
        telephone: this.telephone,
        cp: this.cp,
        password: this.password,
        repeat_password: this.repeat_password,
      },
      { validator: confirmPassword('password', 'repeat_password') }
    ));
  }

  passwordOnInput() {
    if (this.registerForm.hasError('equalValue')) {
      this.repeat_password.setErrors({
        required: this.registerForm.get('repeat_password').errors?.required,
        equalValue: true,
      });
    } else {
      this.repeat_password.setErrors(null);
    }
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.btnSubmitted = true;
      const email = this.registerForm.value.email.toLowerCase();
      const password = this.registerForm.value.passwords.password;

      let response;
      let id;
      let added_date;

      if (this.currentUserId) {
        response = await this.utilsService
          .createUser({ email, password })
          .catch((e) => this.utilsService.errorHandling(e));

        if (response) {
          id = response.user.uid;
          added_date = new Date(response.user.metadata.creationTime).getTime();
        }
      } else {
        response = await this.authService.register(email, password).catch((e) => this.utilsService.errorHandling(e));
        if (response) {
          id = response.user.uid;
          added_date = parseInt(response.user.metadata.createdAt);
        }
      }

      if (id) {
        this.user.id = id;
        this.user.name = this.registerForm.value.name.toLowerCase();
        this.user.email = email;
        this.user.street = this.registerForm.value.street.toLowerCase();
        this.user.role = this.registerForm.value.role;
        this.user.province = this.registerForm.value.province;
        this.user.code = this.registerForm.value.code;
        this.user.telephone = this.registerForm.value.telephone;
        this.user.cp = this.registerForm.value.cp;
        this.user.added_date = added_date;

        this.userService
          .createUser(this.user)
          .then(() => {
            if (this.currentUserId) {
              this.notificationService.successNotification('success.user_created');
              this.location.back();
            } else {
              this.notificationService.successNotification('success.user_registered');
              this.router.navigate(['home']);
            }
          })
          .catch((e) => {
            this.btnSubmitted = false;
            this.utilsService.errorHandling(e);
          });
      }
    }
  }
}
