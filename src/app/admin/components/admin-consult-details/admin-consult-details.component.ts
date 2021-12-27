import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CapitalizePipe } from 'src/app/shared/pipes/capitalize.pipe';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ConsultState } from '../../../shared/enums/consult-state.enum';
import { Consult } from '../../../shared/models/consult.model';
import { ConsultService } from '../../../shared/services/consult.service';

@Component({
  selector: 'app-admin-consult-details',
  templateUrl: './admin-consult-details.component.html',
  styleUrls: ['./admin-consult-details.component.scss'],
})
export class AdminConsultDetailsComponent implements OnInit {
  public replyForm: FormGroup;
  public message: FormControl;
  public noReplyMessage: FormControl;

  public id: string;
  public consult: Consult;

  public showForm: boolean;
  public btnSubmitted: boolean;

  public suscriptionLanguage: Subscription;
  constructor(
    // private router: Router,
    private activatedRoute: ActivatedRoute,
    private consultService: ConsultService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private location: Location,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private capitalizePipe: CapitalizePipe,
    private dialogService: DialogService
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
    this.showForm = Boolean(this.consult.reply);
  }

  loadForm() {
    this.message = new FormControl(
      this.consult.reply ? { value: this.capitalizePipe.transform(this.consult.reply.message), disabled: true } : '',
      [Validators.required, Validators.minLength(50), Validators.maxLength(500)]
    );
    this.noReplyMessage = new FormControl({ value: '', disabled: true });
    this.replyForm = this.createForm();
  }

  createForm(): FormGroup {
    this.onTranslateText();
    return (this.replyForm = this.formBuilder.group({
      message: this.message,
      noReplyMessage: this.noReplyMessage,
    }));
  }

  onTranslateText() {
    this.suscriptionLanguage = this.translateService.onLangChange.subscribe((lang) => {
      console.log(lang);
      this.noReplyMessage.setValue(this.translateService.instant('no_reply_message_description'));
    });
    this.noReplyMessage.setValue(this.translateService.instant('no_reply_message_description'));
  }

  onPreviousPage() {
    this.location.back();
  }

  async onDeleteConsult(id: string): Promise<void> {
    // '¿Está seguro que desea eliminar la consulta? Esta acción no se puede deshacer'
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.consultService
        .deleteConsult(id)
        .then(() => {
          this.notificationService.successNotification('success.consult_deleted');
          this.consult = null;
          this.location.back();
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  async onReplyConsult(): Promise<void> {
    if (this.replyForm.valid) {
      // this.btnForm.nativeElement.disabled = true;
      this.btnSubmitted = true;
      const consult: Consult = {
        ...this.consult,
        state: ConsultState.answered,
        reply: {
          message: this.replyForm.value.message,
          reply_date: null,
        },
      };

      const servertime = await this.utilsService.getServerTimeStamp().catch((e) => this.utilsService.errorHandling(e));
      if (servertime) {
        const date = servertime.timestamp;
        consult.reply.reply_date = date;
        this.consultService
          .updateConsult(consult)
          .then((res) => {
            // Mostramos el mensaje traducido res[1].message!
            // console.log('Respuesta del servidor: ', res[1].message);
            this.consult = consult;
            this.replyForm.controls['message'].disable();
            this.btnSubmitted = false;
            this.notificationService.successNotification(res[1].message);
          })
          .catch((e) => {
            // console.log('Respuesta de error del servidor: ', e);
            // this.btnForm.nativeElement.disabled = false;
            this.btnSubmitted = false;
            this.utilsService.errorHandling(e[1].message);
          });
      } else {
        this.btnSubmitted = false;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.consult && this.consult.state === ConsultState.unread) {
      this.consultService.setState(this.consult.id, ConsultState.read).catch((e) => this.utilsService.errorHandling(e));
    }

    if (!this.suscriptionLanguage.closed) {
      this.suscriptionLanguage.unsubscribe();
    }
  }
}
