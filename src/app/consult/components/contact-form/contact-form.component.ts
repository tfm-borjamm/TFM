import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { checkEmail } from 'src/app/shared/validations/checkEmail.validator';
import { ConsultState } from '../../enums/consult-state.enum';
import { Consult } from '../../models/consult.model';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  public contactForm: FormGroup;
  public name: FormControl;
  public email: FormControl;
  public subject: FormControl;
  public message: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private consultService: ConsultService
  ) {}

  ngOnInit(): void {
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(55),
      Validators.pattern(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/),
    ]);
    this.email = new FormControl('', [Validators.required, Validators.email, checkEmail()]);
    this.subject = new FormControl('', [Validators.required, Validators.maxLength(55)]);
    this.message = new FormControl('', [Validators.required, Validators.maxLength(500)]);
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

  contact() {
    if (this.contactForm.valid) {
      const consult: Consult = {
        id: this.utilsService.generateID(),
        name: this.contactForm.value.name.toLowerCase(),
        email: this.contactForm.value.email.toLowerCase(),
        subject: this.contactForm.value.subject.toLowerCase(),
        message: this.contactForm.value.message.toLowerCase(),
        state: ConsultState.unread,
        creation_date: null,
      };

      this.consultService
        .createConsult(consult)
        .then(() => {
          console.log('Consulta enviada correctamente');
          this.contactForm.reset();
        })
        .catch((e) => {
          this.utilsService.errorHandling(e);
        });
    }
  }
}
