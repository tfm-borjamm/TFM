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
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-admin-publications',
  templateUrl: './admin-publications.component.html',
  styleUrls: ['./admin-publications.component.scss'],
})
export class AdminPublicationsComponent implements OnInit {
  public publications: Publication[];
  public publicationsCopy: Publication[];
  public showFilter: boolean = false;
  public links = ['available', 'adopteds'];
  public filterPublication: FormGroup;
  public province: FormControl;
  public type: FormControl;
  public paramType: string = null;
  public paramProvince: string = null;
  public types: string[] = Object.values(Type);
  public provinces: string[] = provinces;
  public displayedColumns: string[] = ['professional', 'type', 'province', 'date', 'star'];
  public dataSource: any = new MatTableDataSource<Publication>([]);
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;
  public subscriptionTranslate: Subscription;
  public selectedType: any = '';
  public selectedProvince: any = '';
  public itemsLoaded: Promise<boolean>;

  constructor(
    private publicationService: PublicationService,
    private router: Router,
    private utilsService: UtilsService,
    private userService: UserService,
    public translateService: TranslateService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      this.itemsLoaded = null;
      const wordFilter =
        data.nameAuthor.toLowerCase() +
        this.translateService.instant(data.type).toLowerCase() +
        data.province.toLowerCase();
      this.itemsLoaded = Promise.resolve(true);
      return wordFilter.indexOf(filter) != -1;
    };

    this.subscriptionTranslate = this.translateService.onLangChange.subscribe(() => this.translatePagination());
    this.translatePagination();
  }

  translatePagination() {
    this.paginator._intl.itemsPerPageLabel = this.translateService.instant('ITEMS_PER_PAGE');
    this.paginator._intl.nextPageLabel = this.translateService.instant('NEXT_PAGE');
    this.paginator._intl.previousPageLabel = this.translateService.instant('PREV_PAGE');
    this.paginator._intl.firstPageLabel = this.translateService.instant('FIRST_PAGE');
    this.paginator._intl.lastPageLabel = this.translateService.instant('LAST_PAGE');
    const originalGetRangeLabel = this.paginator._intl.getRangeLabel;
    this.paginator._intl.getRangeLabel = (page: number, size: number, len: number) => {
      return originalGetRangeLabel(page, size, len).replace(
        this.translateService.currentLang === 'es' ? 'of' : 'de',
        this.translateService.instant('of')
      );
    };
    this.dataSource.paginator = this.paginator;
  }

  async loadPublications(link: string): Promise<void> {
    if (link === 'adopteds') link = link.substring(0, link.length - 1); // delete plural 's' letter
    const publications = await this.publicationService.getPublicationsAdmin(link);
    this.publications = await this.replaceIdsToNameAuthor(publications);
    this.publicationsCopy = this.publications;
    this.dataSource.data = this.publications;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.itemsLoaded = Promise.resolve(true);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  resetFilter() {
    this.dataSource.filter = '';
  }

  onCreatePublication() {
    this.router.navigate(['publication']);
  }

  onEditPublication(id: string) {
    this.router.navigate(['publication', id]);
  }

  onDetailsPublication(publication: Publication) {
    this.router.navigate(['publication', publication.state, 'details', publication.id]);
  }

  async onDeletePublication(publication: Publication): Promise<void> {
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.publicationService
        .deletePublication(publication)
        .then(() => {
          this.dataSource.data = this.dataSource.data.filter(
            (publication: Publication) => publication.id !== publication.id
          );
          this.notificationService.successNotification('success.publication_deleted');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  onSharePublication(publication: Publication): void {
    const shareLink = `publication/${publication.state}/details/${publication.id}`;
    const options: any = {
      name: 'share',
      shareLink: shareLink,
    };
    this.dialogService.openButtonsDialog(options);
  }

  async onMarkAsAdopted(publication: Publication) {
    const confirm = await this.dialogService.confirm('info.confirm.adopted');
    if (confirm) {
      this.publicationService
        .updatePublicationState(publication)
        .then(() => {
          this.dataSource.data = this.dataSource.data.filter(
            (publication: Publication) => publication.id !== publication.id
          );
          this.notificationService.successNotification('success.publication_adopted');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
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

  ngOnDestroy(): void {
    if (!this.subscriptionTranslate.closed) this.subscriptionTranslate.unsubscribe();
  }
}
