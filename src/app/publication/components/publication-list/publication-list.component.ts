import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { provinces } from 'src/assets/mocks/variables';
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
  public filterKey: string = null;
  public filterValue: string = null;

  public filterPublication: FormGroup;
  public province: FormControl;
  public type: FormControl;

  public publications: any[] = [];

  public finished: boolean = false;
  public types: string[] = Object.values(Type);
  public provinces: string[] = provinces;

  public currentURL: string;
  public queryDB: string;

  constructor(
    private publicationService: PublicationService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentURL = this.router.url;
    if (this.currentURL === '/publication/list') this.loadForm();
    this.getPublications();
  }

  loadForm() {
    this.type = new FormControl('', [Validators.required]);
    this.province = new FormControl('', [Validators.required]);
    this.filterPublication = this.createForm();
  }

  public createForm(): FormGroup {
    return this.formBuilder.group({
      type: this.type,
      province: this.province,
    });
  }

  async onChangeFilter(selected: filterSelected) {
    this.idLastItem = null;
    this.finished = false;

    const { filter, value } = selected;

    const search: any = {
      type: this.filterPublication.value.type,
      province: this.filterPublication.value.province,
    };

    search[filter] = value;

    if (search.type && search.province) {
      search.province = search.province.replaceAll(' ', '');
      this.filterKey = 'filter';
      this.filterValue = search.type + '+' + search.province;
    } else if (search.type) {
      this.filterKey = 'type';
      this.filterValue = search.type;
    } else if (search.province) {
      this.filterKey = 'province';
      this.filterValue = search.province;
    } else {
      this.filterKey = null;
      this.filterValue = null;
    }
    this.getPublications();
  }

  onScroll() {
    console.log('Cargando...');
    if (this.finished) return;
    this.getPublications({ start: false });
  }

  private async getPublications(settings: settings = { start: true }) {
    let options;
    let nextPublications;
    if (this.currentURL === '/publication/list') {
      options = {
        filterKey: this.filterKey,
        filterValue: this.filterValue,
        idLastItem: this.idLastItem,
        limitItems: this.limitItems,
      };
      nextPublications = await this.publicationService.getPublications(options);
      this.publications = settings.start ? nextPublications : this.publications.concat(nextPublications);
    } else if (this.currentURL === '/publication/favorites' || this.currentURL === '/publication/my-publications') {
      // this.queryDB = this.queryDB ?? `users/${id_user}/myPublications`;
      this.queryDB = this.queryDB ?? `users/myPublications`;
      options = {
        // query : {
        //   idLastItem: this.idLastItem,
        //   limitItems: this.limitItems,
        // },
        // url: this.currentURL === '/publication/favorites' ? `users/${id_user}/myFavorites` : this.queryDB,
        idLastItem: this.idLastItem,
        limitItems: this.limitItems,
        url: this.currentURL === '/publication/favorites' ? 'users/myFavorites' : this.queryDB,
      };
      const idPublications = await this.publicationService.getPublicationsID(options);
      const promisesPublications = idPublications.map((id) => this.publicationService.getPublicationById(id));
      nextPublications = await Promise.all(promisesPublications);
      this.publications = settings.start
        ? nextPublications.filter((item) => item) // Evitar el null index
        : this.publications.concat(nextPublications).filter((item) => item);
    }
    this.finished = nextPublications.length < this.limitItems;
    this.setLastItemID();
    // Comprobamos si no hay más publicaciones
    // if (this.finished) return;
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

  onChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.queryDB = checked ? 'users/myHistory' : 'users/myPublications';
    //this.queryDB = checked ? `users/${id_user}/myHistory` : `users/${id_user}/myPublications`;
    this.idLastItem = null;
    this.finished = false;
    this.getPublications();
  }

  trackByFn(index: number) {
    return index;
  }
}
