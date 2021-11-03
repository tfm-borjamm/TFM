import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { provinces } from 'src/assets/mocks/variables';
import { Role } from '../../enums/role.enum';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-social',
  templateUrl: './register-social.component.html',
  styleUrls: ['./register-social.component.scss'],
})
export class RegisterSocialComponent implements OnInit {
  public registerForm: FormGroup;
  public street: FormControl;
  public province: FormControl;
  public role: FormControl;
  public telephone: FormControl;
  public cp: FormControl;
  public password: FormControl;
  public repeat_password: FormControl;
  public provinces: string[] = provinces;
  public roles: any;
  public user: User;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.street = new FormControl('', [Validators.required]);
    this.province = new FormControl('', [Validators.required]);
    this.role = new FormControl('', [Validators.required]);
    this.telephone = new FormControl('', [Validators.required, Validators.maxLength(12)]);
    this.cp = new FormControl('', [Validators.required]);

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
      telephone: this.telephone,
      cp: this.cp,
    }));
  }

  async onRegister() {
    if (this.registerForm.valid) {
      const user: User = {
        ...this.user,
        street: this.registerForm.value.street,
        province: this.registerForm.value.province,
        role: this.registerForm.value.role,
        telephone: this.registerForm.value.telephone,
        cp: this.registerForm.value.cp,
      };

      this.userService
        .updateUser(user)
        .then(() => {
          console.log('Registrado correctamente');
          this.registerForm.reset();
          this.router.navigate(['publication/list']);
        })
        .catch((e) => this.utilsService.errorHandling(e));
    }
  }
}
