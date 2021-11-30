import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('btnForm') btnForm: ElementRef;
  public forgotForm: FormGroup;
  public email: FormControl;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private utilsService: UtilsService) {}

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
      this.btnForm.nativeElement.disabled = true;
      const email = this.forgotForm.value.email.toLowerCase();
      this.authService
        .resetPassword(email)
        .then(() => {
          this.forgotForm.reset();
          console.log('Correo enviado para restablecer la contraseña');
        })
        .catch((e) => {
          this.btnForm.nativeElement.disabled = false;
          this.utilsService.errorHandling(e);
        });
    }
  }
}
