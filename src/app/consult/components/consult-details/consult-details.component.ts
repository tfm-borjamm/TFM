import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { State } from '../../enums/state.enum';
import { Consult } from '../../models/consult.model';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-consult-details',
  templateUrl: './consult-details.component.html',
  styleUrls: ['./consult-details.component.scss'],
})
export class ConsultDetailsComponent implements OnInit {
  public replyForm: FormGroup;
  public reply: FormControl;

  public id: string;
  public consult: Consult;

  public showForm: boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consultService: ConsultService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder
  ) {
    this.activatedRoute.params.forEach((params) => {
      // Params desde el routing
      console.log('params', params);
      this.id = params.id;
    });
  }

  async ngOnInit(): Promise<void> {
    this.consult = await this.consultService.getConsultById(this.id ?? '');
    if (!this.consult) {
      this.router.navigate(['no-results']);
      return;
    }

    this.loadForm();

    this.showForm = Boolean(this.consult.admin);
  }

  loadForm() {
    this.reply = new FormControl(this.consult.admin ? { value: this.consult.admin.reply, disabled: true } : '', [
      Validators.required,
    ]);
    this.replyForm = this.createForm();
  }

  createForm(): FormGroup {
    return (this.replyForm = this.formBuilder.group({
      reply: this.reply,
    }));
  }

  async onReplyConsult() {
    // const consult; // Normalizamos campos recogidos en el formulario!
    const consult: Consult = {
      ...this.consult,
      state: State.answered,
      admin: {
        reply: this.replyForm.value.reply,
        reply_date: null,
      },
    };

    let date;
    try {
      date = (await this.utilsService.getServerTimeStamp()).timestamp;
    } catch (e) {
      this.utilsService.errorHandling(e);
    }

    if (date) {
      consult.admin.reply_date = date;
      this.consultService
        .updateConsult(consult)
        .then((res) => {
          console.log('Respuesta del servidor: ', res[1].message);
          this.consult = consult;
          this.replyForm.controls['reply'].disable();
        })
        .catch((e) => this.utilsService.errorHandling(e));
    }

    // console.log('Consulta finalizada', consult);
  }

  ngOnDestroy(): void {
    if (this.consult.state === State.unread) {
      this.consultService.setState(this.id, State.read).catch((e) => this.utilsService.errorHandling(e));
    }
  }
}
