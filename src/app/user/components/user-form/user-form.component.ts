import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { codes } from 'src/app/user/helpers/codes';
import { provinces } from 'src/app/shared/helpers/provinces';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @ViewChild('btnForm') btnForm: ElementRef;
  public user: User;
  public editForm: FormGroup;
  public id: string;

  public role: FormControl;
  public email: FormControl;
  public name: FormControl;
  public street: FormControl;
  public cp: FormControl;
  public code: FormControl;
  public telephone: FormControl;
  public province: FormControl;

  public codes: string[] = [];
  public provinces: string[] = provinces;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.user = this.activatedRoute.snapshot.data.user;
    // this.activatedRoute.params.forEach((params) => {
    //   this.id = params.id;
    // });
  }

  async ngOnInit(): Promise<void> {
    // this.user = await this.getUser(); // Proteger que nadie pueda editar un usuario si no es el administrador
    // if (!this.user) {
    //   this.router.navigate(['user-not-found']);
    //   return;
    // }

    this.codes = this.utilsService.setFormatPhonesCodes(codes);
    const numbersValidator = /^[0-9]*$/;
    const fullnameValidator = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

    this.name = new FormControl(this.user.name, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(55),
      Validators.pattern(fullnameValidator),
    ]);
    this.email = new FormControl({ value: this.user.email, disabled: true }, [
      Validators.required,
      Validators.email,
      checkEmail(),
    ]);
    this.role = new FormControl({ value: this.user.role, disabled: true }, [Validators.required]);
    this.street = new FormControl(this.user.street, [Validators.required]);
    this.province = new FormControl(this.user.province, [Validators.required]);
    this.code = new FormControl(this.user.code ?? '', [Validators.required]);
    this.telephone = new FormControl(this.user.telephone, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern(numbersValidator),
    ]);
    this.cp = new FormControl(this.user.cp, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
      Validators.pattern(numbersValidator),
    ]);
    this.editForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      email: this.email,
      role: this.role,
      name: this.name,
      street: this.street,
      cp: this.cp,
      code: this.code,
      telephone: this.telephone,
      province: this.province,
    });
  }

  // async getUser(): Promise<User> {
  //   const id = this.id ?? (await this.authService.getCurrentUserUID());
  //   const user = await this.userService.getUserById(id);
  //   if (!user) return null;
  //   return user;
  // }

  onDeleteUser() {
    // Método para eliminar un usuario
    this.userService
      .deleteUser(this.user)
      .then(async (a) => {
        console.log('Se ha eliminado correctamente el usuario', a);
        const response = await this.utilsService
          .deleteUser(this.user.id)
          .catch((e) => this.utilsService.errorHandling(e));
        if (response) {
          console.log('Respuesta: ', response);
        }
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onEdit() {
    // Actualizar los campos del usuario en la base de datos
    if (this.editForm.valid) {
      // email: this.id ? this.user.email : this.editForm.value.email,
      this.btnForm.nativeElement.disabled = true;
      const user: User = {
        id: this.user.id,
        email: this.user.email,
        name: this.editForm.value.name,
        street: this.editForm.value.street,
        cp: this.editForm.value.cp,
        code: this.editForm.value.code,
        telephone: this.editForm.value.telephone,
        province: this.editForm.value.province,
        role: this.user.role,
        added_date: this.user.added_date,
      };

      this.userService
        .updateUser(user)
        .then(() => {
          console.log('Información guardada correctamente');
          this.btnForm.nativeElement.disabled = false;
          this.location.back();
        })
        .catch((e) => {
          this.btnForm.nativeElement.disabled = false;
          this.utilsService.errorHandling(e);
        });
    }
  }
}
