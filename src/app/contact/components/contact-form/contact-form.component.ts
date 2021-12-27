import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { checkEmail } from 'src/app/shared/validations/checkEmail.validator';
import { ConsultState } from '../../../shared/enums/consult-state.enum';
import { Consult } from '../../../shared/models/consult.model';
import { ConsultService } from '../../../shared/services/consult.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  // @ViewChild('btnForm') btnForm: ElementRef;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  public contactForm: FormGroup;
  public name: FormControl;
  public email: FormControl;
  public subject: FormControl;
  public message: FormControl;

  public btnSubmitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private consultService: ConsultService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(55),
      Validators.pattern(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    ]);
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.subject = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.message = new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]);
    this.contactForm = this.createForm();
  }

  createForm(): FormGroup {
    return (this.contactForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
    }));
  }

  async onContact() {
    if (this.contactForm.valid) {
      // this.btnForm.nativeElement.disabled = true;
      this.btnSubmitted = true;
      const servertime = await this.utilsService.getServerTimeStamp().catch((e) => this.utilsService.errorHandling(e));
      if (servertime) {
        const consult: Consult = {
          id: this.utilsService.generateID(),
          name: this.contactForm.value.name.toLowerCase(),
          email: this.contactForm.value.email.toLowerCase(),
          subject: this.contactForm.value.subject.toLowerCase(),
          message: this.contactForm.value.message,
          language: this.translateService.currentLang.toLowerCase(),
          state: ConsultState.unread,
          creation_date: servertime.timestamp,
        };

        this.consultService
          .createConsult(consult)
          .then(() => {
            // console.log('Consulta enviada correctamente');
            this.notificationService.successNotification('success.consult_created');
            this.btnSubmitted = false;
            this.formDirective.resetForm();
          })
          .catch((e) => {
            // this.btnForm.nativeElement.disabled = false;
            this.btnSubmitted = false;
            this.utilsService.errorHandling(e);
          });
      }
    }
  }
}
