import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { codes } from 'src/app/user/helpers/codes';
import { provinces } from 'src/app/shared/helpers/provinces';
import { Role } from '../../enums/role.enum';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { confirmPassword } from '../../validations/confirmPassword.validator';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('btnForm') btnForm: ElementRef;
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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
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
    this.currentUserId = await this.authService.getCurrentUserUID();
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

  async onRegister() {
    if (this.registerForm.valid) {
      this.btnForm.nativeElement.disabled = true;
      const email = this.registerForm.value.email.toLowerCase();
      const password = this.registerForm.value.passwords.password;

      let response;
      let id;
      let added_date;

      if (this.currentUserId) {
        console.log('Administrador...');
        response = await this.utilsService
          .createUser({ email, password })
          .catch((e) => this.utilsService.errorHandling(e));

        if (response) {
          id = response.user.uid;
          added_date = new Date(response.user.metadata.creationTime).getTime();
        }
      } else {
        console.log('No registrado...');
        response = await this.authService.register(email, password).catch((e) => this.utilsService.errorHandling(e));
        if (response) {
          id = response.user.uid;
          added_date = parseInt(response.user.metadata.createdAt);
        }
      }

      if (id) {
        this.user.id = id;
        this.user.name = this.registerForm.value.name;
        this.user.email = email;
        this.user.street = this.registerForm.value.street;
        this.user.role = this.registerForm.value.role;
        this.user.province = this.registerForm.value.province;
        this.user.code = this.registerForm.value.code;
        this.user.telephone = this.registerForm.value.telephone;
        this.user.cp = this.registerForm.value.cp;
        this.user.added_date = added_date;

        this.userService
          .createUser(this.user)
          .then(() => {
            console.log('Registrado correctamente');
            this.registerForm.reset();
            if (this.currentUserId) {
              // is admin adding user
              this.location.back();
            } else {
              // is a normal user
              this.router.navigate(['publication/list']);
            }
          })
          .catch((e) => {
            this.btnForm.nativeElement.disabled = false;
            this.utilsService.errorHandling(e);
          });
      }
    }
  }
}
