import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ConsultState } from '../../../shared/enums/consult-state.enum';
import { Consult } from '../../../shared/models/consult.model';
import { ConsultService } from '../../../shared/services/consult.service';

@Component({
  selector: 'app-consult-admin',
  templateUrl: './consult-admin.component.html',
  styleUrls: ['./consult-admin.component.scss'],
})
export class ConsultAdminComponent implements OnInit, OnDestroy {
  public consults: Consult[];
  public consult: Consult;

  // public defaultLink = ConsultState.unread;
  public links = Object.values(ConsultState).splice(1); // Admin not

  displayedColumns: string[] = ['name', 'email', 'subject', 'message', 'date', 'star'];
  dataSource: any = new MatTableDataSource<Consult>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public showFilter: boolean = false;
  public subscriptionTranslate: Subscription;

  public itemsLoaded: Promise<boolean>;

  constructor(
    private consultService: ConsultService,
    private router: Router,
    private utilsService: UtilsService,
    private translateService: TranslateService,
    private notificationService: NotificationService
  ) {
    // const search = this.utilsService.getLocalStorage('search');
    // const params = search;
    // if (params) {
    //   this.dataSource.filter = params.search;
    //   // this.showFilter = true;
    // }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      this.itemsLoaded = null;
      const wordFilter =
        data.name.toLowerCase() + data.email.toLowerCase() + data.subject.toLowerCase() + data.message.toLowerCase();
      // console.log('--->', data);
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

  async loadConsults(link: string): Promise<void> {
    this.consults = await this.consultService.getConsults(link);
    this.dataSource.data = this.consults.sort((a, b) => b.creation_date - a.creation_date); // Más recientes primero
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.itemsLoaded = Promise.resolve(true);
  }

  async onDetailsConsult(id: string) {
    this.router.navigate([`/dashboard/consult/details/${id}`]);
  }

  applyFilter(event: Event): void {
    // Filter name search
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    // this.utilsService.setLocalStorage('search', {
    //   search: this.dataSource.filter,
    // });

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

    // this.name = filterValue.toLowerCase();
    // this.users = this.name ? this.usersV0.filter((user) => this.isEqualNames(user.name, this.name)) : this.usersV0;
  }

  resetFilter() {
    this.dataSource.filter = '';
    // this.utilsService.removeLocalStorage('search');
  }

  onDeleteConsult(id: string) {
    console.log('Eliminar: ', id);
    this.consultService
      .deleteConsult(id)
      .then(() => {
        this.dataSource.data = this.dataSource.data.filter((consult: Consult) => consult.id !== id);
        this.notificationService.successNotification('consult.delete');
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  onMarkAsRead(id: string) {
    console.log('Marcar como leído: ', id);
    this.consultService
      .setState(id, ConsultState.read)
      .then(() => {
        // this.consults.find((consult) => consult.id === id).state = ConsultState.read;
        // this.loadConsults(this.tabValue); // Hacerlo local
        this.dataSource.data = this.dataSource.data.find((consult: Consult) => consult.id === id).state = ConsultState.read;
        this.notificationService.successNotification('consult.answered');
      })
      .catch((e) => this.utilsService.errorHandling(e));
  }

  ngOnDestroy(): void {
    if (!this.subscriptionTranslate.closed) this.subscriptionTranslate.unsubscribe();
  }
}
