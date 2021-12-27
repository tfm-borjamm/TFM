import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AuthService } from '../../../shared/services/auth.service';
import { checkEmail } from '../../../shared/validations/checkEmail.validator';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('btnForm') public btnForm: ElementRef;
  @ViewChild(FormGroupDirective) public formDirective: FormGroupDirective;
  public forgotForm: FormGroup;
  public email: FormControl;
  public btnSubmitted: boolean;
  public SEND_ICON = '../../../../assets/images/send.svg';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private notificationService: NotificationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon('send', this.domSanitizer.bypassSecurityTrustResourceUrl(this.SEND_ICON));
  }

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.forgotForm = this.createForm();
  }

  createForm(): FormGroup {
    return (this.forgotForm = this.formBuilder.group({
      email: this.email,
    }));
  }

  onForgot(): void {
    if (this.forgotForm.valid) {
      // this.btnForm.nativeElement.disabled = true;
      this.btnSubmitted = true;
      const email = this.forgotForm.value.email.toLowerCase();
      this.authService
        .resetPassword(email)
        .then(() => {
          // this.forgotForm.reset();
          this.notificationService.successNotification('success.forgot_password');
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
