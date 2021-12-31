import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Role } from '../../../shared/enums/role.enum';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  public users: User[];
  public links = ['clients', 'professionals'];
  public link: string;
  public displayedColumns: string[] = ['name', 'email', 'telephone', 'province', 'star'];
  public dataSource: any = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;
  public subscriptionTranslate: Subscription;
  public showFilter: boolean = false;
  public itemsLoaded: Promise<boolean>;

  constructor(
    private userService: UserService,
    private router: Router,
    private utilsService: UtilsService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      this.itemsLoaded = null;
      const wordFilter =
        data.name.toLowerCase() + data.email.toLowerCase() + data.telephone.toLowerCase() + data.province.toLowerCase();
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

  async loadUsers(link: string): Promise<void> {
    this.link = link.substring(0, link.length - 1); // delete plural 's' letter
    this.users = await this.userService.getUsersAdmin(this.link);
    this.dataSource.data = this.users;
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

  async onDeleteUser(user: User) {
    const confirm = await this.dialogService.confirm('info.confirm.delete');
    if (confirm) {
      this.userService
        .deleteUser(user)
        .then(async () => {
          await this.utilsService.deleteUser(user.id).catch((e) => this.utilsService.errorHandling(e));
          this.dataSource.data = this.dataSource.data.filter((user: User) => user.id !== user.id);
          this.notificationService.successNotification('success.user_deleted');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('info.cancelled');
    }
  }

  onEditUser(id: string) {
    this.router.navigate(['user', 'profile-form', id]);
  }

  onCreateUser() {
    this.router.navigate(['access', 'register', 'admin']);
  }

  onDetailsProfile(id: string) {
    this.router.navigate(['user', 'profile', id]);
  }

  ngOnDestroy(): void {
    if (!this.subscriptionTranslate.closed) this.subscriptionTranslate.unsubscribe();
  }
}
