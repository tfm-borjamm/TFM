import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from 'src/app/user/enums/role.enum';
import { User } from 'src/app/user/models/user.model';
import { AuthService } from 'src/app/user/services/auth.service';
import { UserService } from 'src/app/user/services/user.service';
import { State } from '../../enums/state.enum';
import { Publication } from '../../models/publication.model';
import { FavoriteService } from '../../services/favorite.service';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-publication-details',
  templateUrl: './publication-details.component.html',
  styleUrls: ['./publication-details.component.scss'],
})
export class PublicationDetailsComponent implements OnInit, OnDestroy {
  public shareLink: string;

  public publication: Publication;
  public id: string;

  public autor: User;
  public currentUser: User;

  public isFavorite: boolean = false;
  public isAuthor: boolean = false;
  public isCopyFavorite: boolean = false;
  public isAdmin: boolean = false;
  public isClient: boolean = false;
  public isAdopted: boolean = false;

  public state: string;

  public countFavorites: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private publicationService: PublicationService,
    private favoriteService: FavoriteService,
    private utilsService: UtilsService,
    private location: Location,
    private userService: UserService, // User service
    private authService: AuthService // Auth service
  ) {
    this.activatedRoute.params.forEach((params) => {
      this.id = params.id ?? '';
      this.state = params.state ?? '';
    });
  }

  async ngOnInit(): Promise<void> {
    // this.shareLink = encodeURI(document.location.href);
    // console.log(
    //   `Location Href : ${document.location.href} \n Location path: ${document.location.origin} Route url: ${this.router.url}`
    // );

    const url = this.state === State.adopted ? 'history' : 'publications';

    this.publication = await this.publicationService.getPublicationById(this.id, url);

    // if (!this.publication) {
    //   this.router.navigate(['no-results']);
    //   return;
    // }

    this.shareLink = `publication/${this.publication.state}/details/${this.publication.id}`;

    this.publication.images = this.utilsService.getArrayFromObject(this.publication.images);
    this.isAdopted = this.publication.state === State.adopted;

    this.autor = await this.userService.getUserById(this.publication.idAutor);
    this.currentUser = await this.authService.getCurrentUserLogged();

    // Usuario actual:
    // const id = (await this.authService.getCurrentUserUID()) ?? '';
    // this.currentUser = await this.userService.getUserById(id);

    if (this.currentUser && this.autor) {
      this.isAdmin = this.currentUser.role === Role.admin;
      this.isAuthor = this.autor.id === this.currentUser.id;
      this.isClient = this.currentUser.role === Role.client;
    } else {
      this.isAuthor = false;
      this.isAdmin = false;
    }

    if (this.currentUser && !this.isAuthor) {
      const favoritesCurrentUser = this.utilsService.getArrayFromObject(this.currentUser?.myFavorites);
      this.isFavorite = favoritesCurrentUser.map((favorite) => favorite.id).includes(this.publication.id);
      this.isCopyFavorite = this.isFavorite;
      this.countFavorites = (await this.favoriteService.getFavorites(this.id)).length;
    }
  }

  onChangeFavorite(count: number) {
    this.countFavorites += count;
    this.isFavorite = !this.isFavorite;
  }

  onEditPublication() {
    this.router.navigate([`/publication/item/${this.publication.id}`]);
  }

  onDeletePublication() {
    // Eliminar publicación
    this.publicationService
      .deletePublication(this.publication)
      .then(() => {
        console.log('Publicación eliminada correctamente');
        this.location.back();
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onMarkToAdopted() {
    if (window.confirm('¿Estas seguro?')) {
      this.publicationService
        .updatePublicationState(this.publication)
        .then((p) => {
          console.log('Marcado como adoptado', p);
          this.publication.state = State.adopted;
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      console.log('Cancelado por el usuario');
    }
  }

  onSharePublication(): void {
    console.log('Compartir publicación');
  }

  onProfileAuthor(id: string): void {
    this.router.navigate(['user', 'profile', id]);
  }

  onContactAuthor() {
    // Open to dialog
    console.log('Contactar con el autor', this.autor);
  }

  // encode(message: string): string {
  //   return encodeURI(message);
  // }

  // copyLinkToClipboard(): void {
  //   navigator.clipboard
  //     .writeText(this.actualURL)
  //     .then(() => console.log('Se ha copiado correctamente'))
  //     .catch((e) => this.utilsService.errorHandling(e));
  // }

  // encodeShareLink() : string {
  //   // this.router.navigate([`publication/${this.publication.state}/details/${this.publication.id}`]);
  //   return encodeURI('')
  // }

  ngOnDestroy() {
    console.log('Se destruye el componente');
    const isClientCurrentUser = this.currentUser && this.currentUser.role === Role.client;
    const isChangeFavorite = this.isFavorite !== this.isCopyFavorite;
    if (isClientCurrentUser && isChangeFavorite) {
      console.log('Se procede a cambiar favorito');
      if (this.isFavorite) {
        this.favoriteService
          .setFavorite(this.currentUser.id, this.publication)
          .then((a) => {
            console.log('Se ha añadido a favoritos', a);
          })
          .catch((e) => this.utilsService.errorHandling(e));
      } else {
        this.favoriteService
          .removeFavorite(this.currentUser.id, this.publication.id)
          .then((a) => {
            console.log('Se ha eliminado de favoritos', a);
          })
          .catch((e) => this.utilsService.errorHandling(e));
      }
    }
  }

  // Este método tiene pinta de que se irá a utilsService
  // getTranslate(code: string): Promise<string> {
  //   return this.translate
  //     .get(code)
  //     .pipe(take(1))
  //     .toPromise()
  //     .catch((e) => this.utilsService.errorHandling(e));
  // }
}
