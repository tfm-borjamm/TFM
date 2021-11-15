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
  public tabValue: string = null;
  public tab$: BehaviorSubject<string> = new BehaviorSubject(this.tabValue);
  public subscriptionTab: Subscription;
  public consults: Consult[];

  constructor(private consultService: ConsultService, private router: Router, private utilsService: UtilsService) {
    const menu = this.utilsService.getLocalStorage('menu');
    if (menu?.tab) {
      const isValueCorrect = Object.values(State).includes(menu?.tab);
      this.tabValue = isValueCorrect ? menu?.tab : State.unread;
      if (!isValueCorrect) this.utilsService.setLocalStorage('menu', { tab: this.tabValue });
    }

    // this.tabValue = menu?.tab ?? State.unread;

    // this.activatedRoute.queryParams.subscribe((params) => {
    //   // Params de las rutas url
    //   console.log('params', params);
    //   this.tabValue = params.tab ?? State.unread;
    // });
  }

  ngOnInit(): void {
    // this.consults = await this.consultService.getAllConsults();
    this.subscriptionTab = this.tab$.subscribe((tab) => {
      console.log('Se ha cambiado el filter a: ', tab);
      if (tab && tab !== this.tabValue) {
        this.utilsService.setLocalStorage('menu', { tab: tab });
        this.loadConsults(tab);
        this.tabValue = tab;
        // this.router.navigate([], {
        //   relativeTo: this.activatedRoute,
        //   queryParams: { tab: this.tabValue },
        // });
      }
    });
    this.loadConsults(this.tabValue); // Sólo se ejecuta inicialmente!
  }

  async loadConsults(filter: string): Promise<void> {
    console.log('Se cargan las consultas!');
    this.consults = await this.consultService.getConsults(filter);
    // Pagination is comming soon!
  }

  ngOnDestroy(): void {
    if (!this.subscriptionTab.closed) {
      console.log('Destruimos el subscribe');
      this.subscriptionTab.unsubscribe();
    }
  }
}
