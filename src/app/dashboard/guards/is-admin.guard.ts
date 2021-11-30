import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { Role } from '../../shared/enums/role.enum';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const uid = await this.authService.getCurrentUserUID();
    if (uid) {
      const role = await this.userService.getRoleUserById(uid).catch((e) => {
        this.router.navigate(['page-not-found']);
        this.utilsService.errorHandling(e);
      });
      return role === Role.admin ? true : this.router.navigate(['page_not_found']);
    }
    this.router.navigate(['page_not_found']);
    return false;
  }
}
