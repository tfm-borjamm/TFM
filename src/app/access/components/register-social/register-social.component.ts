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
import { Location } from '@angular/common';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-register-social',
  templateUrl: './register-social.component.html',
  styleUrls: ['./register-social.component.scss'],
})
export class RegisterSocialComponent implements OnInit {
  @ViewChild('btnForm') btnForm: ElementRef;
  public registerForm: FormGroup;
  public street: FormControl;
  public province: FormControl;
  public role: FormControl;
  public code: FormControl;
  public telephone: FormControl;
  public cp: FormControl;
  public password: FormControl;
  public repeat_password: FormControl;

  public codes: any[];
  public provinces: string[] = provinces;
  public roles: any;

  public user: User;
  public btnSubmitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private userService: UserService,
    private notificationService: NotificationService,
    private location: Location,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.codes = this.utilsService.setFormatPhonesCodes(codes);
    const numbersValidator = /^[0-9]*$/;

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

    // this.roles = Object.entries(Role).map((entry) => {
    //   const [key, value] = entry;
    //   return { key, value };
    // });

    this.roles = Object.values(Role);

    // this.roles = Object.keys(rol).map((key) => {
    //   return {
    //     code: key,
    //     value: rol[key],
    //   };
    // });

    this.registerForm = this.createForm();

    const id = await this.authService.getCurrentUserUID();
    this.user = await this.userService.getUserById(id);
  }

  createForm(): FormGroup {
    return (this.registerForm = this.formBuilder.group({
      street: this.street,
      province: this.province,
      role: this.role,
      code: this.code,
      telephone: this.telephone,
      cp: this.cp,
    }));
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      // this.btnForm.nativeElement.disabled = true;
      this.btnSubmitted = true;
      const user: User = {
        ...this.user,
        street: this.registerForm.value.street.toLowerCase(),
        province: this.registerForm.value.province,
        role: this.registerForm.value.role,
        code: this.registerForm.value.code,
        telephone: this.registerForm.value.telephone,
        cp: this.registerForm.value.cp,
      };

      this.userService
        .updateUser(user)
        .then(() => {
          // console.log('Registrado correctamente');
          this.notificationService.successNotification('success.user_registered_social');
          // this.registerForm.reset();
          this.authService.logout();
          this.router.navigate(['access', 'login']);

          // if (user.role === Role.admin) {
          //   // this.router.navigate(['/admin']);
          //   window.location.replace(window.location.origin + '/admin');
          // } else {
          //   // this.router.navigate(['/home']);
          //   window.location.replace(window.location.origin + '/home');
          // }
        })
        .catch((e) => {
          // this.btnForm.nativeElement.disabled = false;
          this.btnSubmitted = false;
          this.utilsService.errorHandling(e);
        });
    }
  }
}

// code.split(" ")[1].replace(/[{()}]/g, ''); // Numbercode
