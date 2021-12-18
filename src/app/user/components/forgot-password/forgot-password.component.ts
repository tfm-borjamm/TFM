import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AuthService } from '../../../shared/services/auth.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('btnForm') btnForm: ElementRef;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  public forgotForm: FormGroup;
  public email: FormControl;
  public btnSubmitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.forgotForm = this.createForm();
  }

  createForm(): FormGroup {
    return (this.forgotForm = this.formBuilder.group({
      email: this.email,
    }));
  }

  onForgot() {
    if (this.forgotForm.valid) {
      // this.btnForm.nativeElement.disabled = true;
      this.btnSubmitted = true;
      const email = this.forgotForm.value.email.toLowerCase();
      this.authService
        .resetPassword(email)
        .then(() => {
          // this.forgotForm.reset();
          this.notificationService.successNotification(
            'Si ha introducido correctamente la dirección de correo electrónico, se le ha enviado un mensaje para restablecer la contraseña de su cuenta'
          );
          this.formDirective.resetForm();
          this.btnSubmitted = false;
        })
        .catch((e) => {
          // this.btnForm.nativeElement.disabled = false;
          this.btnSubmitted = false;
          this.utilsService.errorHandling(e);
        });
    }
  }
}
