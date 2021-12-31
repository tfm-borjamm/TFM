import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from 'src/app/shared/enums/role.enum';
import { User } from 'src/app/shared/models/user.model';
import { PublicationState } from '../../../shared/enums/publication-state';
import { Publication } from '../../../shared/models/publication.model';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { PublicationService } from '../../../shared/services/publication.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-publication-item',
  templateUrl: './publication-item.component.html',
  styleUrls: ['./publication-item.component.scss'],
})
export class PublicationItemComponent implements OnInit, OnDestroy {
  @Input() public publication: Publication;
  @Input() public currentUser: User;
  @Output() public onChangePublication = new EventEmitter();
  public isAuthor: boolean = false;
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
    private favoriteService: FavoriteService,
    private dialogService: DialogService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.currentUser) {
      this.isAuthor = this.currentUser.id === this.publication.idAuthor;
      this.isAdmin = this.currentUser.role === Role.admin;
      this.isClient = this.currentUser.role === Role.client;
      this.isAdopted = this.publication.state === PublicationState.adopted;
      if (this.isClient) {
        const favorites = this.utilsService.getArrayFromObject(this.currentUser.myFavorites);
        this.isFavorite = favorites.map((favorite) => favorite.id).includes(this.publication.id);
        this.detectedChangeFavorite = this.isFavorite;
      }
    }

    this.carrouselImages = this.utilsService.getArrayFromObject(this.publication?.images) ?? [];
    this.image = this.carrouselImages[0]?.url;
  }

  isPageFavorites(): boolean {
    return this.router.url === '/favorites';
  }

  isPageMyPublications(): boolean {
    return this.router.url === '/publications';
  }

  onChangeFavorite() {
    this.isFavorite = !this.isFavorite;
    this.notificationService.successNotification(
      this.isFavorite ? 'success.favorites_added' : 'success.favorites_deleted'
    );
  }

  onEditPublication() {
    this.router.navigate(['publication', this.publication.id]);
  }

  async onDeleteFavorite(): Promise<void> {
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.favoriteService
        .removeFavorite(this.currentUser.id, this.publication.id)
        .then(() => {
          this.notificationService.successNotification('success.favorites_deleted');
          this.onChangePublication.emit(this.publication.id);
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  async onMarkAsAdopted(): Promise<void> {
    const confirm = await this.dialogService.confirm('info.confirm.adopted');
    if (confirm) {
      this.publicationService
        .updatePublicationState(this.publication)
        .then(() => {
          this.notificationService.successNotification('success.publication_adopted');
          this.onChangePublication.emit(this.publication.id);
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  onSharePublication(): void {
    const options: { name: string; shareLink: string } = {
      name: 'share',
      shareLink: `publication/${this.publication.state}/details/${this.publication.id}`,
    };
    this.dialogService.openButtonsDialog(options);
  }

  async onDeletePublication(): Promise<void> {
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.publicationService
        .deletePublication(this.publication)
        .then(() => {
          this.notificationService.successNotification('success.publication_deleted');
          this.onChangePublication.emit(this.publication.id);
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  ngOnDestroy() {
    const isChangeFavorite = this.isFavorite !== this.detectedChangeFavorite;
    if (this.isClient && isChangeFavorite) {
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
}
