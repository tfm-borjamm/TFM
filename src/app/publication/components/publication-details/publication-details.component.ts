import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from 'src/app/shared/enums/role.enum';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PublicationState } from '../../../shared/enums/publication-state';
import { Publication } from '../../../shared/models/publication.model';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { PublicationService } from '../../../shared/services/publication.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-publication-details',
  templateUrl: './publication-details.component.html',
  styleUrls: ['./publication-details.component.scss'],
})
export class PublicationDetailsComponent implements OnInit, OnDestroy {
  public shareLink: string;

  public publication: Publication;
  public id: string;

  public author: User;
  public currentUser: User;

  public isFavorite: boolean = false;
  public isAuthor: boolean = false;
  public isCopyFavorite: boolean = false;
  public isAdmin: boolean = false;
  public isClient: boolean = false;
  public isAdopted: boolean = false;

  public state: string;

  public countFavorites: number = 0;

  public CHIP_ICON = '../../../../assets/images/chip.svg';
  public AGE_ICON = '../../../../assets/images/age.svg';
  public SEX_ICON = '../../../../assets/images/sex.svg';
  public SIZE_ICON = '../../../../assets/images/size.svg';
  public VACCINATE_ICON = '../../../../assets/images/vaccinate.svg';
  public DISPATCH_ICON = '../../../../assets/images/dispatch.svg';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private publicationService: PublicationService,
    private favoriteService: FavoriteService,
    private utilsService: UtilsService,
    private location: Location,
    private userService: UserService,
    private authService: AuthService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    public translateService: TranslateService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.addIcons();
    console.log(this.activatedRoute.snapshot.data);

    this.publication = this.activatedRoute.snapshot.data.publication;
    this.id = this.publication.id;
    // this.activatedRoute.params.forEach((params) => {
    //   // this.id = params.id ?? '';
    //   // this.state = params.state ?? '';
    //   this.publication = params.publication;
    //   console.log('--->', params);
    // });
  }

  async ngOnInit(): Promise<void> {
    // this.shareLink = encodeURI(document.location.href);
    // console.log(
    //   `Location Href : ${document.location.href} \n Location path: ${document.location.origin} Route url: ${this.router.url}`
    // );

    // const url = this.state === State.adopted ? 'history' : 'publications';

    // this.publication = await this.publicationService.getPublicationById(this.id, url);

    // if (!this.publication) {
    //   this.router.navigate(['no-results']);
    //   return;
    // }

    this.shareLink = `publication/${this.publication.state}/details/${this.publication.id}`;

    this.publication.images = this.utilsService.getArrayFromObject(this.publication.images);
    this.isAdopted = this.publication.state === PublicationState.adopted;

    this.author = await this.userService.getUserById(this.publication.idAuthor);

    this.currentUser = await this.authService.getCurrentUserLogged();

    // Usuario actual:
    // const id = (await this.authService.getCurrentUserUID()) ?? '';
    // this.currentUser = await this.userService.getUserById(id);

    if (this.currentUser && this.author) {
      this.isAdmin = this.currentUser.role === Role.admin;
      this.isAuthor = this.author.id === this.currentUser.id;
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
      // console.log('-->', this.countFavorites, this.id);
    }
  }

  addIcons() {
    this.matIconRegistry.addSvgIcon('chip', this.domSanitizer.bypassSecurityTrustResourceUrl(this.CHIP_ICON));
    this.matIconRegistry.addSvgIcon('age', this.domSanitizer.bypassSecurityTrustResourceUrl(this.AGE_ICON));
    this.matIconRegistry.addSvgIcon('sex', this.domSanitizer.bypassSecurityTrustResourceUrl(this.SEX_ICON));
    this.matIconRegistry.addSvgIcon('size', this.domSanitizer.bypassSecurityTrustResourceUrl(this.SIZE_ICON));
    this.matIconRegistry.addSvgIcon('vaccinate', this.domSanitizer.bypassSecurityTrustResourceUrl(this.VACCINATE_ICON));
    this.matIconRegistry.addSvgIcon('dispatch', this.domSanitizer.bypassSecurityTrustResourceUrl(this.DISPATCH_ICON));
  }

  onChangeFavorite(count: number) {
    this.countFavorites += count;
    if (this.countFavorites < 0) this.countFavorites = 0;
    this.isFavorite = !this.isFavorite;
  }

  onEditPublication() {
    this.router.navigate(['publication', this.publication.id]);
  }

  async onDeletePublication() {
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.publicationService
        .deletePublication(this.publication)
        .then(() => {
          this.notificationService.successNotification('success.publication_deleted');
          this.publication = null;
          this.location.back();
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  async onMarkAsAdopted() {
    const confirm = await this.dialogService.confirm('info.confirm.adopted');
    if (confirm) {
      this.publicationService
        .updatePublicationState(this.publication)
        .then(() => {
          this.publication.state = PublicationState.adopted;
          this.notificationService.successNotification('success.publication_adopted');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  onSharePublication(): void {
    const shareLink = `publication/${this.publication.state}/details/${this.publication.id}`;
    const options: { name: string; shareLink: string } = {
      name: 'share',
      shareLink: shareLink,
    };
    this.dialogService.openButtonsDialog(options);
  }

  onProfileAuthor(id: string): void {
    this.router.navigate(['user', 'profile', id]);
  }

  onContactAuthor(): void {
    const options: { name: string; author: User } = {
      name: 'contact',
      author: this.author,
    };
    this.dialogService.openButtonsDialog(options);
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
    if (!this.publication) return;
    const isClientCurrentUser = this.currentUser && this.currentUser.role === Role.client;
    const isChangeFavorite = this.isFavorite !== this.isCopyFavorite;
    if (isClientCurrentUser && isChangeFavorite) {
      // console.log('Se procede a cambiar favorito');
      if (this.isFavorite) {
        this.favoriteService
          .setFavorite(this.currentUser.id, this.publication)
          .catch((e) => this.utilsService.errorHandling(e));
      } else {
        this.favoriteService
          .removeFavorite(this.currentUser.id, this.publication.id)
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
