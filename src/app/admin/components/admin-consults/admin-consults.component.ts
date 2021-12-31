import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ConsultState } from '../../../shared/enums/consult-state.enum';
import { Consult } from '../../../shared/models/consult.model';
import { ConsultService } from '../../../shared/services/consult.service';

@Component({
  selector: 'app-admin-consults',
  templateUrl: './admin-consults.component.html',
  styleUrls: ['./admin-consults.component.scss'],
})
export class AdminConsultsComponent implements OnInit {
  public consults: Consult[];
  public consult: Consult;
  public links = Object.values(ConsultState).splice(1);
  public displayedColumns: string[] = ['name', 'email', 'subject', 'message', 'date', 'star'];
  public dataSource: any = new MatTableDataSource<Consult>([]);
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;
  public showFilter: boolean = false;
  public subscriptionTranslate: Subscription;
  public itemsLoaded: Promise<boolean>;

  constructor(
    private consultService: ConsultService,
    private router: Router,
    private utilsService: UtilsService,
    public translateService: TranslateService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      this.itemsLoaded = null;
      const wordFilter =
        data.name.toLowerCase() + data.email.toLowerCase() + data.subject.toLowerCase() + data.message.toLowerCase();
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
    this.router.navigate(['admin', 'consult', 'details', id]);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  resetFilter() {
    this.dataSource.filter = '';
  }

  async onDeleteConsult(id: string): Promise<void> {
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.consultService
        .deleteConsult(id)
        .then(() => {
          this.dataSource.data = this.dataSource.data.filter((consult: Consult) => consult.id !== id);
          this.notificationService.successNotification('success.consult_deleted');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  async onMarkAsRead(id: string): Promise<void> {
    const confirm = await this.dialogService.confirm('info.confirm.read');
    if (confirm) {
      this.consultService
        .setState(id, ConsultState.read)
        .then(() => {
          this.dataSource.data = this.dataSource.data.map((consult: Consult) => {
            if (consult.id === id) consult.state = ConsultState.read;
            return consult;
          });
          this.notificationService.successNotification('success.consult_answered');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  ngOnDestroy(): void {
    if (!this.subscriptionTranslate.closed) this.subscriptionTranslate.unsubscribe();
  }
}
