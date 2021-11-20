import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { State } from '../../enums/state.enum';
import { Consult } from '../../models/consult.model';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-consult-admin',
  templateUrl: './consult-admin.component.html',
  styleUrls: ['./consult-admin.component.scss'],
})
export class ConsultAdminComponent implements OnInit, OnDestroy {
  public consults: Consult[];

  public defaultTab = State.unread;
  public tabs = Object.values(State).splice(1); // Admin not

  constructor(private consultService: ConsultService, private router: Router, private utilsService: UtilsService) {}

  ngOnInit(): void {}

  async loadConsults(filter: string): Promise<void> {
    console.log('Se cargan las consultas!');
    this.consults = await this.consultService.getConsults(filter);
    // Pagination is comming soon!
  }

  onDetailsConsult(id: string) {
    this.router.navigate([`/consult/details/${id}`]);
  }

  onDeleteConsult(id: string) {
    console.log('Eliminar: ', id);
    this.consultService
      .deleteConsult(id)
      .then(() => {
        this.consults = this.consults.filter((consult) => consult.id !== id);
        // this.loadConsults(this.tabValue) // Hacerlo local
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onMarkToRead(id: string) {
    console.log('Marcar como leído: ', id);
    this.consultService
      .setState(id, State.read)
      .then(() => {
        this.consults.find((consult) => consult.id === id).state = State.read;
        // this.loadConsults(this.tabValue); // Hacerlo local
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  ngOnDestroy(): void {}
}
