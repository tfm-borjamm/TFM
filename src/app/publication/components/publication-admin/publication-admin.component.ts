import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { State } from '../../enums/state.enum';
import { Publication } from '../../models/publication.model';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-publication-admin',
  templateUrl: './publication-admin.component.html',
  styleUrls: ['./publication-admin.component.scss'],
})
export class PublicationAdminComponent implements OnInit, OnDestroy {
  public tabValue: string = null;
  public tab$: BehaviorSubject<string> = new BehaviorSubject(this.tabValue);
  public subscriptionTab: Subscription;
  public publications: Publication[];

  constructor(
    private publicationService: PublicationService,
    // private router: Router,
    // private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    const menu = this.utilsService.getLocalStorage('menu');
    if (menu?.tab) {
      const isValueCorrect = Object.values(State).includes(menu?.tab);
      this.tabValue = isValueCorrect ? menu?.tab : State.available;
      if (!isValueCorrect) this.utilsService.setLocalStorage('menu', { tab: this.tabValue });
    }

    // this.tabValue = menu?.tab ?? State.available;
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   console.log('PARAMS DE LA URL');
    //   this.tabValue = params.tab ?? State.available;
    // });
  }

  ngOnInit(): void {
    this.subscriptionTab = this.tab$.subscribe((tab) => {
      console.log('Se ha cambiado el TAB a: ', tab);
      if (tab && tab !== this.tabValue) {
        console.log('SE CARGAN NUEVAS PUBLICACIONES!');
        this.utilsService.setLocalStorage('menu', { tab: tab });
        this.loadPublications(tab);
        this.tabValue = tab;
        // this.router.navigate([], {
        //   relativeTo: this.activatedRoute,
        //   queryParams: { tab: this.tabValue },
        // });
      }
    });
    this.loadPublications(this.tabValue); // Sólo se ejecuta inicialmente!
  }

  async loadPublications(tabMenu: string): Promise<void> {
    this.publications = await this.publicationService.getPublicationsAdmin(tabMenu);
  }

  ngOnDestroy(): void {
    if (!this.subscriptionTab.closed) {
      console.log('Destruimos el subscribe');
      this.subscriptionTab.unsubscribe();
    }
  }
}
