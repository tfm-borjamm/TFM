import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { provinces } from 'src/app/shared/helpers/provinces';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PublicationState } from '../../../shared/enums/publication-state';
import { Type } from '../../../shared/enums/type.enum';
import { PublicationService } from '../../../shared/services/publication.service';
import { Publication } from 'src/app/shared/models/publication.model';

interface filterSelected {
  filter: string;
  value: string;
}

interface settings {
  start: boolean;
}

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss'],
})
export class PublicationListComponent implements OnInit {
  public idLastItem: string = null;
  public limitItems: number = 6;

  public filterPublication: FormGroup;
  public province: FormControl;
  public type: FormControl;

  public publications: any[] = [];

  public finished: boolean = false;
  public types: string[] = Object.values(Type);
  public provinces: string[] = provinces;

  public currentURL: string;
  public queryDB: string;

  public paramType: string = null;
  public paramProvince: string = null;

  public user: User;

  public links = ['available', 'adopteds'];

  public showFilter: boolean;

  public itemsLoaded: Promise<boolean>;

  constructor(
    private publicationService: PublicationService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const filterPublications = this.utilsService.getLocalStorage('filterPublications');
    const params = filterPublications;
    if (params) {
      const isTypeOK = Object.values(Type).includes(params?.type);
      const isProvinceOK = provinces.includes(params?.province);
      this.paramType = isTypeOK ? params?.type : null;
      this.paramProvince = isProvinceOK ? params?.province : null;
    }
    console.log('PARAMS: ', this.paramProvince, this.paramType);
  }

  async ngOnInit(): Promise<void> {
    this.currentURL = this.router.url;

    if (this.currentURL.includes('/publication/list')) {
      this.loadForm();
      if (this.paramType || this.paramProvince) this.onChangeFilter();
    }
    this.user = await this.authService.getCurrentUserLogged();
    if (!this.currentURL.includes('/publication/my-publications')) this.getPublications();
  }

  loadForm() {
    this.type = new FormControl(this.paramType ?? '');
    this.province = new FormControl(this.paramProvince ?? '');
    this.filterPublication = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      type: this.type,
      province: this.province,
    });
  }

  onChangePublication(id: string) {
    this.publications = this.publications.filter((x) => x.id !== id);
  }

  resetFilter() {
    this.resetSearch();
    this.type.setValue('');
    this.province.setValue('');
    this.utilsService.removeLocalStorage('filterPublications');
    this.getPublications();
  }

  resetSearch(): void {
    this.idLastItem = null;
    this.finished = false;
  }

  resetLoading(): void {
    let promise: Promise<boolean>;
    this.itemsLoaded = promise;
  }

  async onChangeFilter(selected?: filterSelected) {
    this.resetSearch();
    this.resetLoading();

    const search: any = {
      type: this.filterPublication.value.type,
      province: this.filterPublication.value.province,
    };

    if (selected) {
      const { filter, value } = selected;
      search[filter] = value;
    }

    console.log('Search: ', search);

    if (search.type && search.province) {
      const query = {
        type: search.type,
        province: search.province,
      };
      this.utilsService.setLocalStorage('filterPublications', query);
    } else if (search.type) {
      const query = {
        type: search.type,
      };
      this.utilsService.setLocalStorage('filterPublications', query);
    } else if (search.province) {
      const query = {
        province: search.province,
      };
      this.utilsService.setLocalStorage('filterPublications', query);
    } else {
      this.utilsService.removeLocalStorage('filterPublications');
    }

    if (selected) this.getPublications();
  }

  onScroll() {
    console.log('SCROLLED');
    if (this.finished) return;
    console.log('Sigue habiendo articulos');
    this.getPublications({ start: false });
  }

  async getPublications(settings: settings = { start: true }) {
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
    console.log('Valores: ', filterKey, filterValue);

    if (this.currentURL.includes('/publication/list')) {
      options = {
        filterKey: filterKey,
        filterValue: filterValue,
        idLastItem: this.idLastItem,
        limitItems: this.limitItems,
      };
      nextPublications = await this.publicationService.getPublications(options);
      this.publications = settings.start ? nextPublications : this.publications.concat(nextPublications);
    } else if (
      this.currentURL.includes('/publication/favorites') ||
      this.currentURL.includes('/publication/my-publications')
    ) {
      this.queryDB = this.queryDB ?? `users/${this.user.id}/myPublications`;
      options = {
        idLastItem: this.idLastItem,
        limitItems: this.limitItems,
        url: this.currentURL.includes('/publication/favorites') ? `users/${this.user.id}/myFavorites` : this.queryDB, // Favoritos: users/${id_user}/myFavorites
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
    console.log('this.finished', this.finished);
    this.itemsLoaded = Promise.resolve(true);
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

  onCreatePublication() {
    this.router.navigate(['publication', 'item']);
  }

  onChange(link: string) {
    this.resetLoading();
    // const checked = (event.target as HTMLInputElement).checked;
    // this.queryDB = checked ? 'users/myHistory' : 'users/myPublications';

    if (link === 'adopteds') link = link.substring(0, link.length - 1); // delete plural 's' letter

    console.log('Filtra:', link);
    this.publications = [];
    this.queryDB =
      link === PublicationState.adopted ? `users/${this.user.id}/myHistory` : `users/${this.user.id}/myPublications`;
    this.resetSearch();
    this.getPublications();
  }

  // trackByFn(index: number) {
  //   return index;
  // }

  trackByFn(index: number, item: Publication) {
    return item.id;
  }

  ngOnDestroy(): void {
    console.log('Nos vamos del componente padre');
  }
}
