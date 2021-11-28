import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('btnForm') btnForm: ElementRef;

  public replyForm: FormGroup;
  public reply: FormControl;

  public id: string;
  public consult: Consult;

  public showForm: boolean;
  constructor(
    // private router: Router,
    private activatedRoute: ActivatedRoute,
    private consultService: ConsultService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.consult = this.activatedRoute.snapshot.data.consult;
    // this.activatedRoute.params.forEach((params) => {
    //   // Params desde el routing
    //   console.log('params', params);
    //   this.id = params.id;
    // });
  }

  async ngOnInit(): Promise<void> {
    // this.consult = await this.consultService.getConsultById(this.id ?? '');
    // if (!this.consult) {
    //   this.router.navigate(['page-not-found']);
    //   return;
    // }

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

  onPreviousPage() {
    this.location.back();
  }

  onDeleteConsult(id: string) {
    console.log('Eliminar: ', id);
    this.consultService
      .deleteConsult(id)
      .then((a) => {
        console.log('Consulta eliminada correctamente', a);
        this.location.back();
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  async onReplyConsult() {
    console.log('Button: ', this.btnForm);
    if (this.replyForm.valid) {
      this.btnForm.nativeElement.disabled = true;
      const consult: Consult = {
        ...this.consult,
        state: State.answered,
        admin: {
          reply: this.replyForm.value.reply,
          reply_date: null,
        },
      };

      const servertime = await this.utilsService.getServerTimeStamp().catch((e) => this.utilsService.errorHandling(e));
      if (servertime) {
        const date = servertime.timestamp;
        consult.admin.reply_date = date;
        this.consultService
          .updateConsult(consult)
          .then((res) => {
            // Mostramos el mensaje traducido res[1].message!
            console.log('Respuesta del servidor: ', res[1].message);
            this.consult = consult;
            this.replyForm.controls['reply'].disable();
          })
          .catch((e) => {
            console.log('Respuesta de error del servidor: ', e[1].message);
            this.btnForm.nativeElement.disabled = false;
            this.utilsService.errorHandling(e[0]);
          });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.consult.state === State.unread) {
      this.consultService.setState(this.id, State.read).catch((e) => this.utilsService.errorHandling(e));
    }
  }
}
