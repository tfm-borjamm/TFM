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
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
})
export class UserAdminComponent implements OnInit, OnDestroy {
  public users: User[];
  // public usersV0: User[];
  // public name: string = null;

  // public defaultTab = Role.client;
  // public tabs = Object.values(Role).splice(1);
  // public defaultLink = 'clients';
  public links = ['clients', 'professionals'];

  // public currentUserID: string;

  public link: string;

  displayedColumns: string[] = ['name', 'email', 'telephone', 'province', 'star'];
  dataSource: any = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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
    // this.currentUserID = await this.authService.getCurrentUserUID();

    // this.users = this.users.filter((user) => {
    //   if (user.role === Role.client) {
    //     const numberFavorites = this.utilsService.getArrayFromObject(user?.myFavorites ?? {}).length;
    //     user.myFavorites = numberFavorites;
    //   } else {
    //     const numberPublications = this.utilsService.getArrayFromObject(user?.myPublications ?? {}).length;
    //     user.myPublications = numberPublications;
    //   }
    //   return user;
    // });

    // this.usersV0 = this.users;
    // this.name = '';

    this.link = link.substring(0, link.length - 1); // delete plural 's' letter
    this.users = await this.userService.getUsersAdmin(this.link);
    this.dataSource.data = this.users;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.itemsLoaded = Promise.resolve(true);
  }

  // filterAdmin(user: User) {
  //   console.log('El usuario es: ', user);
  //   return user.id !== 'YXq9Kyyoa6dMAyacb9EIO5OY88g1';
  // }

  applyFilter(event: Event): void {
    // Filter name search
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();

    // this.utilsService.setLocalStorage('search', {
    //   search: this.dataSource.filter,
    // });

    // this.name = filterValue.toLowerCase();
    // this.users = this.name ? this.usersV0.filter((user) => this.isEqualNames(user.name, this.name)) : this.usersV0;
  }

  resetFilter() {
    this.dataSource.filter = '';
    // this.utilsService.removeLocalStorage('search');
  }

  // isEqualNames(name1: string, name2: string): boolean {
  //   return name1.includes(name2);
  // }

  async onDeleteUser(user: User) {
    // Método para eliminar un usuario
    const confirmation = await this.dialogService.confirm(
      '¿Esta seguro de que desea eliminar el usuario? Esta acción no se puede deshacer'
    );
    if (confirmation) {
      this.userService
        .deleteUser(user)
        .then(async (a) => {
          // console.log('Se ha eliminado correctamente el usuario', a);
          // this.users = this.users.filter((x) => x.id !== user.id); // Localmente!
          await this.utilsService.deleteUser(user.id).catch((e) => this.utilsService.errorHandling(e));
          this.dataSource.data = this.dataSource.data.filter((user: User) => user.id !== user.id);
          this.notificationService.successNotification('publication.delete');
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      this.notificationService.infoNotification('Se ha cancelado la operación');
    }
  }

  onEditUser(id: string) {
    // Método para editar un usuario
    this.router.navigate([`user/profile-form/${id}`]);
  }

  onCreateUser() {
    // Método para crear un usuario
    this.router.navigate(['user/register/admin']);
  }

  onDetailsProfile(id: string) {
    this.router.navigate(['user', 'profile', id]);
  }

  ngOnDestroy(): void {
    // if (!this.subscriptionTab.closed) {
    //   console.log('Destruimos el subscribe');
    //   this.subscriptionTab.unsubscribe();
    // }
    if (!this.subscriptionTranslate.closed) this.subscriptionTranslate.unsubscribe();
  }
}
