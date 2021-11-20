import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { UserService } from 'src/app/user/services/user.service';
import { State } from '../../enums/state.enum';
import { Publication } from '../../models/publication.model';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-publication-admin',
  templateUrl: './publication-admin.component.html',
  styleUrls: ['./publication-admin.component.scss'],
})
export class PublicationAdminComponent implements OnInit, OnDestroy {
  public publications: Publication[];

  public showFilter: boolean = false;

  public defaultTab = State.available;
  public tabs = Object.values(State);

  constructor(
    private publicationService: PublicationService,
    private router: Router,
    private utilsService: UtilsService,
    private userService: UserService // private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  async loadPublications(tabMenu: string): Promise<void> {
    console.log('tabMenu', tabMenu);

    const publications = await this.publicationService.getPublicationsAdmin(tabMenu);
    this.publications = await this.replaceIdsToNameAutor(publications);
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

  onSharePublication(): void {
    // Compartir
  }

  onMarkToAdopted(publication: Publication) {
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
    const idsDuplicates = publications.map((publication) => publication.idAutor);
    const ids = this.removeDuplicates(idsDuplicates);
    const promisesUsers = ids.map((id) => this.userService.getUserById(id));
    const users = await Promise.all(promisesUsers);
    publications = publications.map((publication: any) => {
      const user = users.find((user) => publication.idAutor === user.id);
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
