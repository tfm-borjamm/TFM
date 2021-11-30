import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { checkEmail } from 'src/app/shared/validations/checkEmail.validator';
import { ConsultState } from '../../../shared/enums/consult-state.enum';
import { Consult } from '../../../shared/models/consult.model';
import { ConsultService } from '../../../services/consult.service';

@Component({
  selector: 'app-consult-form',
  templateUrl: './consult-form.component.html',
  styleUrls: ['./consult-form.component.scss'],
})
export class ConsultFormComponent implements OnInit {
  @ViewChild('btnForm') btnForm: ElementRef;

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
    this.subject = new FormControl('', [Validators.required, Validators.maxLength(50)]);
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

  async onContact() {
    if (this.contactForm.valid) {
      this.btnForm.nativeElement.disabled = true;
      const servertime = await this.utilsService.getServerTimeStamp().catch((e) => this.utilsService.errorHandling(e));
      if (servertime) {
        const consult: Consult = {
          id: this.utilsService.generateID(),
          name: this.contactForm.value.name,
          email: this.contactForm.value.email.toLowerCase(),
          subject: this.contactForm.value.subject,
          message: this.contactForm.value.message,
          state: ConsultState.unread,
          creation_date: servertime.timestamp,
        };

        this.consultService
          .createConsult(consult)
          .then(() => {
            console.log('Consulta enviada correctamente');
            this.contactForm.reset();
          })
          .catch((e) => {
            this.btnForm.nativeElement.disabled = false;
            this.utilsService.errorHandling(e);
          });
      }
    }
  }
}
