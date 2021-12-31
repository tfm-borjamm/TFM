import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { provinces } from 'src/app/shared/helpers/provinces';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PublicationState } from '../../../shared/enums/publication-state';
import { Type } from '../../../shared/enums/type.enum';
import { PublicationService } from '../../../shared/services/publication.service';
import { Publication } from 'src/app/shared/models/publication.model';
import { Observable, Subscription } from 'rxjs';

interface filterSelected {
  filter: string;
  value: string;
}

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss'],
})
export class PublicationListComponent implements OnInit, OnDestroy {
  @Input() public changeTabs: Observable<string>;
  @Input() public changeFilters: Observable<void>;
  public subscriptionTabs: Subscription;
  public subscriptionFilters: Subscription;
  public idLastItem: string = null;
  public limitItems: number = 9;
  public publications: any[] = [];
  public finished: boolean = false;
  public currentURL: string;
  public queryDB: string;
  public user: User;
  public itemsLoaded: Promise<boolean>;
  public onLoadingNextItems: boolean;

  constructor(
    private publicationService: PublicationService,
    private utilsService: UtilsService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentURL = this.router.url;
    this.user = await this.authService.getCurrentUserLogged();
    if (this.currentURL === '/home')
      this.subscriptionFilters = this.changeFilters.subscribe(() => this.onChangeFilter());

    if (this.currentURL === '/publications')
      this.subscriptionTabs = this.changeTabs.subscribe((link) => this.onChangeTab(link));

    if (this.currentURL !== '/publications') this.getPublications();
  }

  onChangePublication(id: string) {
    this.publications = this.publications.filter((x) => x.id !== id);
  }

  resetSearch(): void {
    this.idLastItem = null;
    this.finished = false;
  }

  resetLoading(): void {
    let promise: Promise<boolean>;
    this.itemsLoaded = promise;
  }

  onChangeFilter() {
    this.resetLoading();
    this.resetSearch();
    this.getPublications();
  }

  onChangeTab(link: string) {
    this.resetLoading();
    this.resetSearch();
    this.publications = [];
    this.queryDB =
      link === PublicationState.adopted ? `users/${this.user.id}/myHistory` : `users/${this.user.id}/myPublications`;
    this.getPublications();
  }

  onScroll() {
    if (this.finished) return;
    this.onLoadingNextItems = true;
    this.getPublications({ start: false });
  }

  async getPublications(settings: any = { start: true }) {
    let options;
    let nextPublications;

    const filterPublications = this.utilsService.getLocalStorage('filterPublications');
    let filterKey = null;
    let filterValue = null;
    const params = filterPublications;
    if (params) {
      const { type, province } = params;
      if (type && province) {
        const isTypeOK = Object.values(Type).includes(type);
        const isProvinceOK = provinces.includes(province);
        if (isTypeOK && isProvinceOK) {
          filterKey = 'filter';
          filterValue = type + '+' + province.replaceAll(' ', '');
        }
      } else if (type) {
        const isTypeOK = Object.values(Type).includes(type);
        if (isTypeOK) {
          filterKey = 'type';
          filterValue = type;
        }
      } else if (province) {
        const isProvinceOK = provinces.includes(province);
        if (isProvinceOK) {
          filterKey = 'province';
          filterValue = province;
        }
      }
    }

    if (this.currentURL.includes('/home')) {
      options = {
        filterKey: filterKey,
        filterValue: filterValue,
        idLastItem: this.idLastItem,
        limitItems: this.limitItems,
      };
      nextPublications = await this.publicationService.getPublications(options);
      this.publications = settings.start ? nextPublications : this.publications.concat(...nextPublications);
      // debugger;
    } else if (this.currentURL.includes('/favorites') || this.currentURL.includes('/publications')) {
      this.queryDB = this.queryDB ?? `users/${this.user.id}/myPublications`;
      options = {
        idLastItem: this.idLastItem,
        limitItems: this.limitItems,
        url: this.currentURL.includes('/favorites') ? `users/${this.user.id}/myFavorites` : this.queryDB, // Favoritos: users/${id_user}/myFavorites
      };
      const idPublications = await this.publicationService.getPublicationsID(options); // [{id: '', state: null | ''}, ... ]
      let queryDB: string = null;
      if (this.queryDB.includes('myHistory')) {
        queryDB = 'history';
      } else {
        queryDB = 'publications';
      }

      const promisesPublications = idPublications.map((idx) => {
        if (typeof idx === 'string') return this.publicationService.getPublicationById(idx, queryDB);
        const { id, state } = idx;
        const url = state === PublicationState.adopted ? 'history' : 'publications';
        return this.publicationService.getPublicationById(id, url);
      });

      nextPublications = await Promise.all(promisesPublications);
      this.publications = settings.start
        ? nextPublications.filter((item) => item) // Evitar el null index
        : this.publications.concat(nextPublications).filter((item) => item);
    }
    this.finished = nextPublications.length < this.limitItems;
    this.setLastItemID();
    this.itemsLoaded = Promise.resolve(true);
    this.onLoadingNextItems = false;
  }

  setLastItemID() {
    const isEmpty: boolean = this.publications.length === 0;
    if (isEmpty) {
      this.finished = isEmpty;
      return;
    }
    const positionLastItem = this.publications.length - 1;
    const lastPublication = this.publications[positionLastItem];
    if (!lastPublication) return;

    const isTheSameId = this.idLastItem === lastPublication.id;
    if (isTheSameId) {
      this.finished = isTheSameId;
      return;
    }
    this.idLastItem = lastPublication.id;
  }

  trackByFn(index: number, item: Publication) {
    return item ? item.id : undefined;
  }

  ngOnDestroy(): void {
    if (this.currentURL === '/home' && this.subscriptionFilters && !this.subscriptionFilters.closed)
      this.subscriptionFilters.unsubscribe();
    if (this.currentURL === '/publications' && this.subscriptionTabs && !this.subscriptionTabs.closed)
      this.subscriptionTabs.unsubscribe();
  }
}
