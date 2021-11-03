import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { provinces } from 'src/assets/mocks/variables';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { checkEmail } from '../../validations/checkEmail.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user: User;
  public editForm: FormGroup;
  public id: string;

  public role: FormControl;
  public email: FormControl;
  public name: FormControl;
  public street: FormControl;
  public cp: FormControl;
  public telephone: FormControl;
  public province: FormControl;

  public provinces: string[] = provinces;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.ActivatedRoute.params.forEach((params) => {
      this.id = params.id;
    });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.getUser();
    if (!this.user) {
      this.router.navigate(['user-not-found']);
      return;
    }

    this.name = new FormControl(this.user.name, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(55),
      Validators.pattern(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    ]);
    this.email = new FormControl({ value: this.user.email, disabled: true }, [
      Validators.required,
      Validators.email,
      checkEmail(),
    ]);
    this.role = new FormControl({ value: this.user.role, disabled: true }, [Validators.required]);
    this.street = new FormControl(this.user.street, [Validators.required]);
    this.province = new FormControl(this.user.province, [Validators.required]);
    this.telephone = new FormControl(this.user.telephone, [Validators.required, Validators.maxLength(12)]);
    this.cp = new FormControl(this.user.cp, [Validators.required]);
    this.editForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      email: this.email,
      role: this.role,
      name: this.name,
      street: this.street,
      cp: this.cp,
      telephone: this.telephone,
      province: this.province,
    });
  }

  async getUser(): Promise<User> {
    const id = this.id ?? (await this.authService.getCurrentUserUID());
    const user = await this.userService.getUserById(id);
    if (!user) return null;
    return user;
  }

  async onEdit() {
    // Actualizar los campos del usuario en la base de datos
    if (this.editForm.valid) {
      const user: User = {
        id: this.user.id,
        name: this.editForm.value.name,
        // email: this.id ? this.user.email : this.editForm.value.email,
        email: this.user.email,
        street: this.editForm.value.street,
        cp: this.editForm.value.cp,
        telephone: this.editForm.value.telephone,
        province: this.editForm.value.province,
        role: this.user.role,
      };

      this.userService
        .updateUser(user, this.user.email === this.editForm.value.email)
        .then(() => {
          console.log('Información guardada correctamente');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    }
  }
}
