import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { provinces } from 'src/app/shared/helpers/provinces';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from 'src/app/services/user.service';
import { PublicationState } from '../../../shared/enums/publication-state';
import { Publication } from '../../../shared/models/publication.model';
import { PublicationService } from '../../../services/publication.service';
import { Type } from '../../../shared/enums/type.enum';

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

  constructor(
    private publicationService: PublicationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private userService: UserService
  ) {
    const filterPublications = this.utilsService.getLocalStorage('filterPublications');
    const params = filterPublications;
    if (params) {
      const isTypeOK = Object.values(Type).includes(params?.type);
      const isProvinceOK = provinces.includes(params?.province);
      this.paramType = isTypeOK ? params?.type : '';
      this.paramProvince = isProvinceOK ? params?.province : '';
    }
  }

  ngOnInit(): void {
    this.loadForm();
  }

  async loadPublications(tabMenu: string): Promise<void> {
    const publications = await this.publicationService.getPublicationsAdmin(tabMenu);
    this.publications = await this.replaceIdsToNameAutor(publications);
    this.publicationsCopy = this.publications;
    this.onChangeFilter();
  }

  onChangeFilter(selected?: any) {
    const search: any = {
      type: this.filterPublication.value.type,
      province: this.filterPublication.value.province,
    };

    if (selected) {
      const { filter, value } = selected;
      search[filter] = value;
    }

    console.log(search, this.paramProvince, this.paramType);

    if (search.type && search.province) {
      this.publications = this.publicationsCopy.filter(
        ({ type, province }) => type.includes(search.type) && province.includes(search.province)
      );
      this.utilsService.setLocalStorage('filterPublications', {
        type: search.type,
        province: search.province,
      });
    } else if (search.type) {
      this.publications = this.publicationsCopy.filter(({ type }) => type.includes(search.type));
      this.utilsService.setLocalStorage('filterPublications', {
        type: search.type,
      });
    } else if (search.province) {
      this.publications = this.publicationsCopy.filter(({ province }) => province.includes(search.province));
      this.utilsService.setLocalStorage('filterPublications', {
        province: search.province,
      });
    } else {
      this.publications = this.publicationsCopy;
      this.utilsService.removeLocalStorage('filterPublications');
    }
  }

  loadForm() {
    this.type = new FormControl(this.paramType ?? '', [Validators.required]);
    this.province = new FormControl(this.paramProvince ?? '', [Validators.required]);
    this.filterPublication = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      type: this.type,
      province: this.province,
    });
  }

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

  async replaceIdsToNameAutor(publications: Publication[]): Promise<any[]> {
    const idsDuplicates = publications.map((publication) => publication.idAuthor);
    const ids = this.removeDuplicates(idsDuplicates);
    const promisesUsers = ids.map((id) => this.userService.getUserById(id));
    const users = await Promise.all(promisesUsers);
    publications = publications.map((publication: any) => {
      const user = users.find((user) => publication.idAuthor === user.id);
      if (!user) return publication;
      publication['nameAutor'] = user.name;
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
