import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { codes } from 'src/app/shared/helpers/codes';
import { provinces } from 'src/app/shared/helpers/provinces';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { Location, TitleCasePipe } from '@angular/common';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Role } from 'src/app/shared/enums/role.enum';
import { CapitalizePipe } from 'src/app/shared/pipes/capitalize.pipe';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
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
  public btnSubmitted: boolean;
  public roles: Role[] = Object.values(Role);

  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private titleCasePipe: TitleCasePipe,
    private capitalizePipe: CapitalizePipe
  ) {
    this.user = this.activatedRoute.snapshot.data.user;
  }

  async ngOnInit(): Promise<void> {
    this.codes = this.utilsService.setFormatPhonesCodes(codes);
    const numbersValidator = /^[0-9]*$/;
    const nameValidator = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

    this.name = new FormControl(this.titleCasePipe.transform(this.user.name), [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(55),
      Validators.pattern(nameValidator),
    ]);
    this.email = new FormControl({ value: this.capitalizePipe.transform(this.user.email), disabled: true }, [
      Validators.required,
      Validators.email,
      checkEmail(),
    ]);
    this.role = new FormControl({ value: this.user.role, disabled: true }, [Validators.required]);
    this.street = new FormControl(this.titleCasePipe.transform(this.user.street), [Validators.required]);
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

  async onDeleteUser(): Promise<void> {
    // Método para eliminar un usuario
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.userService
        .deleteUser(this.user)
        .then(async () => {
          const response = await this.utilsService
            .deleteUser(this.user.id)
            .catch((e) => this.utilsService.errorHandling(e));

          this.notificationService.successNotification('success.user_deleted');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  onEdit(): void {
    // Actualizar los campos del usuario en la base de datos
    if (this.editForm.valid) {
      this.btnSubmitted = true;
      const user: User = {
        id: this.user.id,
        email: this.user.email,
        name: this.editForm.value.name.toLowerCase(),
        street: this.editForm.value.street.toLowerCase(),
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
          this.notificationService.successNotification('success.user_updated');
          this.location.back();
        })
        .catch((e) => {
          this.btnSubmitted = false;
          this.utilsService.errorHandling(e);
        });
    }
  }
}
