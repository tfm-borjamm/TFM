import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from 'src/app/user/enums/role.enum';
import { User } from 'src/app/user/models/user.model';
import { State } from '../../enums/state.enum';
import { Publication } from '../../models/publication.model';
import { FavoriteService } from '../../services/favorite.service';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-publication-item',
  templateUrl: './publication-item.component.html',
  styleUrls: ['./publication-item.component.scss'],
})
export class PublicationItemComponent implements OnInit, OnDestroy {
  @Input() public publication: Publication;
  @Input() public currentUser: User;
  @Output() public onChangePublication = new EventEmitter();

  public isAutor: boolean = false;
  public isClient: boolean = false;
  public isFavorite: boolean = false;
  public isAdmin: boolean = false;
  public isAdopted: boolean = false;

  public detectedChangeFavorite: boolean = false;

  public carrouselImages: { id: string; url: string }[] = [];
  public image: string;
  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private publicationService: PublicationService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    if (this.currentUser) {
      this.isAutor = this.currentUser.id === this.publication.idAutor;
      this.isAdmin = this.currentUser.role === Role.admin;
      this.isClient = this.currentUser.role === Role.client;
      this.isAdopted = this.publication.state === State.adopted;
      if (this.isClient) {
        const favorites = this.utilsService.getArrayFromObject(this.currentUser.myFavorites);
        this.isFavorite = favorites.map((favorite) => favorite.id).includes(this.publication.id);
        this.detectedChangeFavorite = this.isFavorite;
      }
    }

    // Primera imagen!
    this.carrouselImages = this.utilsService.getArrayFromObject(this.publication?.images) ?? [];
    this.image = this.carrouselImages[0]?.url;
  }

  isPageFavorites(): boolean {
    return this.router.url === '/publication/favorites';
  }

  isPageMyPublications(): boolean {
    return this.router.url === '/publication/my-publications';
  }

  onChangeFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  onEditPublication() {
    this.router.navigate([`publication/item/${this.publication.id}`]);
  }

  onDetailsPublication() {
    this.router.navigate([`publication/${this.publication.state}/details/${this.publication.id}`]);
  }

  onDeleteFavorite(): void {
    // Eliminamos de favoritos si o si !
    this.favoriteService
      .removeFavorite(this.currentUser.id, this.publication.id)
      .then(() => {
        console.log('Se ha eliminado correctamente!');
        this.onChangePublication.emit(this.publication.id);
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onMarkToAdopted() {
    // this.publication = null;
    if (window.confirm('¿Estas seguro?')) {
      this.publicationService
        .updatePublicationState(this.publication)
        .then(() => {
          console.log('Marcado como adoptado');
          this.onChangePublication.emit(this.publication.id);
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      console.log('Cancelado por el usuario');
    }
  }

  onSharePublication(): void {
    // Compartir publicación
    // Open the dialog
    const shareLink = `publication/${this.publication.state}/details/${this.publication.id}`;
    console.log('Link a compartir: ', shareLink);
  }

  onDeletePublication(): void {
    console.log('Eliminar publicación: ', this.publication.id);
    this.publicationService
      .deletePublication(this.publication)
      .then((a) => {
        console.log('Se ha eliminado la publicación correctamente', a);
        this.onChangePublication.emit(this.publication.id);
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  ngOnDestroy() {
    console.log('Se destruye el item!');
    const isChangeFavorite = this.isFavorite !== this.detectedChangeFavorite;
    if (this.isClient && isChangeFavorite) {
      console.log('Petición real a la base de datos');
      if (this.isFavorite) {
        // Se añade a favoritos
        this.favoriteService
          .setFavorite(this.currentUser.id, this.publication)
          .then((a) => {
            console.log('Se ha añadido a favoritos', a);
          })
          .catch((e) => this.utilsService.errorHandling(e));
      } else {
        // Se quita de favoritos
        this.favoriteService
          .removeFavorite(this.currentUser.id, this.publication.id)
          .then((a) => {
            console.log('Se ha eliminado de favoritos', a);
            // this.onChangePublication.emit(this.publication.id);
          })
          .catch((e) => this.utilsService.errorHandling(e));
      }
    }
  }
}
