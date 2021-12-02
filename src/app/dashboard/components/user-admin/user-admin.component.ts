import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public usersV0: User[];

  public name: string = null;

  public defaultTab = Role.client;
  public tabs = Object.values(Role).splice(1);

  // public currentUserID: string;

  public tab: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private utilsService: UtilsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  async loadUsers(tabMenu: string): Promise<void> {
    this.tab = tabMenu;
    // this.currentUserID = await this.authService.getCurrentUserUID();
    this.users = await this.userService.getUsersAdmin(tabMenu);

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

    this.usersV0 = this.users;
    this.name = '';
  }

  // filterAdmin(user: User) {
  //   console.log('El usuario es: ', user);
  //   return user.id !== 'YXq9Kyyoa6dMAyacb9EIO5OY88g1';
  // }

  onSearchName(searchName: string): void {
    // Filter name search
    this.name = searchName.toLowerCase();
    this.users = this.name ? this.usersV0.filter((user) => this.isEqualNames(user.name, this.name)) : this.usersV0;
  }

  isEqualNames(name1: string, name2: string): boolean {
    return name1.toLowerCase().includes(name2);
  }

  onDeleteUser(user: User) {
    // Método para eliminar un usuario
    if (window.confirm('¿Está seguro de que desea eliminar el usuario?')) {
      this.userService
        .deleteUser(user)
        .then(async (a) => {
          console.log('Se ha eliminado correctamente el usuario', a);
          this.users = this.users.filter((x) => x.id !== user.id); // Localmente!
          const response = await this.utilsService.deleteUser(user.id).catch((e) => this.utilsService.errorHandling(e));
          if (response) {
            console.log('Respuesta: ', response);
          }
        })
        .catch((e) => this.utilsService.errorHandling(e));
    } else {
      console.log('El usuario ha cancelado');
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

  onViewProfile(id: string) {
    this.router.navigate(['user', 'profile', id]);
  }

  ngOnDestroy(): void {
    // if (!this.subscriptionTab.closed) {
    //   console.log('Destruimos el subscribe');
    //   this.subscriptionTab.unsubscribe();
    // }
  }
}
