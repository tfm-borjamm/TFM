import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { provinces } from 'src/app/shared/helpers/provinces';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { User } from 'src/app/user/models/user.model';
import { AuthService } from 'src/app/user/services/auth.service';
import { State } from '../../enums/state.enum';
import { Type } from '../../enums/type.enum';
import { PublicationService } from '../../services/publication.service';

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
  public limitItems: number = 5;
  // public filterKey: string = null;
  // public filterValue: string = null;

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
  public defaultTab = State.available;
  public tabs = Object.values(State);

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
    // console.log('CReando inittttt', this.publications);
    // this.idLastItem = null;
    // this.finished = false;

    this.currentURL = this.router.url;

    if (this.currentURL.includes('/publication/list')) {
      this.loadForm();
      if (this.paramType || this.paramProvince) this.onChangeFilter();
    }
    this.user = await this.authService.getCurrentUserLogged();
    if (!this.currentURL.includes('/publication/my-publications')) this.getPublications();
  }

  loadForm() {
    this.type = new FormControl(this.paramType ?? '', [Validators.required]);
    this.province = new FormControl(this.paramProvince ?? '', [Validators.required]);
    this.filterPublication = this.createForm();
  }

  public createForm(): FormGroup {
    return this.formBuilder.group({
      type: this.type,
      province: this.province,
    });
  }

  onChangePublication(id: string) {
    this.publications = this.publications.filter((x) => x.id !== id);
  }

  async onChangeFilter(selected?: filterSelected) {
    this.idLastItem = null;
    this.finished = false;

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

  private async getPublications(settings: settings = { start: true }) {
    console.log('LOG GET-PUBLICATIONS', settings);

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
      // this.queryDB = this.queryDB ?? `users/myPublications`;
      options = {
        // query : {
        //   idLastItem: this.idLastItem,
        //   limitItems: this.limitItems,
        // },
        // url: this.currentURL === '/publication/favorites' ? `users/${id_user}/myFavorites` : this.queryDB,
        idLastItem: this.idLastItem,
        limitItems: this.limitItems,
        url: this.currentURL.includes('/publication/favorites') ? `users/${this.user.id}/myFavorites` : this.queryDB, // Favoritos: users/${id_user}/myFavorites
      };
      const idPublications = await this.publicationService.getPublicationsID(options); // [{id: '', state: null | ''}, ... ]
      console.log('IDs', idPublications, this.queryDB);
      let queryDB: string = null;
      if (this.queryDB.includes('myHistory')) {
        queryDB = 'history';
      } else {
        queryDB = 'publications';
      }

      const promisesPublications = idPublications.map((idx) => {
        if (typeof idx === 'string') return this.publicationService.getPublicationById(idx, queryDB);
        const { id, state } = idx;
        console.log('Estamos en favorito porque no es una string', id, state);
        const url = state === State.adopted ? 'history' : 'publications';
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
    this.router.navigate(['publication/item']);
  }

  onChange(tab: string) {
    // const checked = (event.target as HTMLInputElement).checked;
    // this.queryDB = checked ? 'users/myHistory' : 'users/myPublications';
    this.publications = [];
    this.queryDB = tab === State.adopted ? `users/${this.user.id}/myHistory` : `users/${this.user.id}/myPublications`;
    this.idLastItem = null;
    this.finished = false;
    this.getPublications();
  }

  trackByFn(index: number) {
    return index;
  }

  ngOnDestroy(): void {
    console.log('Nos vamos del componente padre');
  }
}
