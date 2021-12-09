import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { provinces } from 'src/app/shared/helpers/provinces';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationState } from '../../../shared/enums/publication-state';
import { Publication } from '../../../shared/models/publication.model';
import { PublicationService } from '../../../shared/services/publication.service';
import { Type } from '../../../shared/enums/type.enum';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-publication-admin',
  templateUrl: './publication-admin.component.html',
  styleUrls: ['./publication-admin.component.scss'],
})
export class PublicationAdminComponent implements OnInit, OnDestroy {
  public publications: Publication[];
  public publicationsCopy: Publication[];

  public showFilter: boolean = false;

  public defaultTab = PublicationState.available;
  public tabs = Object.values(PublicationState);

  public filterPublication: FormGroup;
  public province: FormControl;
  public type: FormControl;

  public paramType: string = null;
  public paramProvince: string = null;

  public types: string[] = Object.values(Type);
  public provinces: string[] = provinces;

  displayedColumns: string[] = ['professional', 'type', 'province', 'date', 'star'];
  dataSource: any = new MatTableDataSource<Publication>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  public selectedType: any = '';
  public selectedProvince: any = '';

  constructor(
    private publicationService: PublicationService,
    private router: Router,
    private utilsService: UtilsService,
    private userService: UserService,
    private translateService: TranslateService
  ) {
    const filterPublications = this.utilsService.getLocalStorage('filterPublications');
    const params = filterPublications;
    if (params) {
      const isTypeOK = Object.values(Type).includes(params?.type);
      const isProvinceOK = provinces.includes(params?.province);
      this.selectedType = isTypeOK ? params?.type : '';
      this.selectedProvince = isProvinceOK ? params?.province : '';
    }
  }

  ngOnInit(): void {
    // this.loadForm();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const wordFilter =
        data.nameAuthor.toLowerCase() +
        this.translateService.instant(data.type).toLowerCase() +
        data.province.toLowerCase();
      console.log('--->', wordFilter);

      return wordFilter.indexOf(filter) != -1;
    };
    // this.translateService.onLangChange.subscribe((a) => {
    //   console.log('-----AAAA', a);
    //   this.paginator._intl.itemsPerPageLabel = this.translateService.instant('ITEMS_PER_PAGE');
    //   this.paginator._intl.nextPageLabel = this.translateService.instant('NEXT_PAGE');
    //   this.paginator._intl.previousPageLabel = this.translateService.instant('PREV_PAGE');
    //   this.paginator._intl.firstPageLabel = this.translateService.instant('FIRST_PAGE');
    //   this.paginator._intl.lastPageLabel = this.translateService.instant('LAST_PAGE');
    // });
  }

  async loadPublications(tabMenu: string): Promise<void> {
    const publications = await this.publicationService.getPublicationsAdmin(tabMenu);
    this.publications = await this.replaceIdsToNameAuthor(publications);
    this.publicationsCopy = this.publications;
    this.onChangeFilter();
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    // Filter name search
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.utilsService.setLocalStorage('searchUsers', {
      search: this.dataSource.filter,
    });

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

    // this.name = filterValue.toLowerCase();
    // this.users = this.name ? this.usersV0.filter((user) => this.isEqualNames(user.name, this.name)) : this.usersV0;
  }

  resetFilter() {
    this.dataSource.filter = '';
    this.utilsService.removeLocalStorage('searchUsers');
  }

  onChangeFilter(selected?: any) {
    const search: any = {
      type: this.selectedType,
      province: this.selectedProvince,
    };

    if (selected) {
      const { filter, value } = selected;
      search[filter] = value;
    }

    console.log(search);

    if (search.type && search.province) {
      this.dataSource.data = this.publicationsCopy.filter(
        ({ type, province }) => type.includes(search.type) && province.includes(search.province)
      );
      this.utilsService.setLocalStorage('filterPublications', {
        type: search.type,
        province: search.province,
      });
    } else if (search.type) {
      this.dataSource.data = this.publicationsCopy.filter(({ type }) => type.includes(search.type));
      this.utilsService.setLocalStorage('filterPublications', {
        type: search.type,
      });
    } else if (search.province) {
      this.dataSource.data = this.publicationsCopy.filter(({ province }) => province.includes(search.province));
      this.utilsService.setLocalStorage('filterPublications', {
        province: search.province,
      });
    } else {
      this.dataSource.data = this.publicationsCopy;
      this.utilsService.removeLocalStorage('filterPublications');
    }

    console.log('this.data', this.dataSource);
  }

  // loadForm() {
  //   this.type = new FormControl(this.paramType ?? '', [Validators.required]);
  //   this.province = new FormControl(this.paramProvince ?? '', [Validators.required]);
  //   this.filterPublication = this.createForm();
  // }

  // createForm(): FormGroup {
  //   return this.formBuilder.group({
  //     type: this.type,
  //     province: this.province,
  //   });
  // }

  onCreatePublication() {
    console.log('Crear publicación');
    this.router.navigate([`/publication/item`]);
  }

  onEditPublication(id: string) {
    console.log('Editar la publicación: ', id);
    this.router.navigate([`/publication/item/${id}`]);
  }

  onDetailsPublication(publication: Publication) {
    this.router.navigate([`publication/${publication.state}/details/${publication.id}`]);
  }

  onDeletePublication(publication: Publication): void {
    console.log('Eliminar publicación: ', publication.id);
    this.publicationService
      .deletePublication(publication)
      .then((a) => {
        console.log('Se ha eliminado la publicación correctamente', a);
        this.publications = this.publications.filter((x) => x.id !== publication.id);
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onSharePublication(publication: Publication): void {
    // Compartir
    const shareLink = `publication/${publication.state}/details/${publication.id}`;
    window.alert('Link a compartir: ' + shareLink);
  }

  onMarkAsAdopted(publication: Publication) {
    if (window.confirm('¿Estas seguro?')) {
      this.publicationService
        .updatePublicationState(publication)
        .then((p) => {
          console.log('Marcado como adoptado', p);
          this.publications = this.publications.filter((x) => x.id !== publication.id);
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      console.log('Cancelado por el usuario');
    }
  }

  ngOnDestroy(): void {
    // if (!this.subscriptionTab.closed) {
    //   console.log('Destruimos el subscribe');
    //   this.subscriptionTab.unsubscribe();
    // }
  }

  async replaceIdsToNameAuthor(publications: Publication[]): Promise<any[]> {
    const idsDuplicates = publications.map((publication) => publication.idAuthor);
    const ids = this.removeDuplicates(idsDuplicates);
    const promisesUsers = ids.map((id) => this.userService.getUserById(id));
    const users = await Promise.all(promisesUsers);
    publications = publications.map((publication: any) => {
      const user = users.find((user) => publication.idAuthor === user.id);
      if (!user) return publication;
      publication['nameAuthor'] = user.name;
      return publication;
    });
    return publications;
  }

  removeDuplicates(array: string[]): string[] {
    return array.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });
  }
}
