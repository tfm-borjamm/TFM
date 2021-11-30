import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { ConsultState } from '../../../shared/enums/consult-state.enum';
import { Consult } from '../../../shared/models/consult.model';
import { ConsultService } from '../../../services/consult.service';

@Component({
  selector: 'app-consult-admin',
  templateUrl: './consult-admin.component.html',
  styleUrls: ['./consult-admin.component.scss'],
})
export class ConsultAdminComponent implements OnInit, OnDestroy {
  public consults: Consult[];

  public defaultTab = ConsultState.unread;
  public tabs = Object.values(ConsultState).splice(1); // Admin not

  constructor(private consultService: ConsultService, private router: Router, private utilsService: UtilsService) {}

  ngOnInit(): void {}

  async loadConsults(filter: string): Promise<void> {
    console.log('Se cargan las consultas!');
    this.consults = await this.consultService.getConsults(filter);
    // Pagination is comming soon!
  }

  onDetailsConsult(id: string) {
    this.router.navigate([`/dashboard/consult/details/${id}`]);
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

  onMarkAsRead(id: string) {
    console.log('Marcar como leído: ', id);
    this.consultService
      .setState(id, ConsultState.read)
      .then(() => {
        this.consults.find((consult) => consult.id === id).state = ConsultState.read;
        // this.loadConsults(this.tabValue); // Hacerlo local
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  ngOnDestroy(): void {}
}
