import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/enums/role.enum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilsService } from '../../shared/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      const uid = await this.authService.getCurrentUserUID();
      if (uid) {
        const role = await this.userService.getRoleUserById(uid);
        return role === Role.admin ? true : this.router.navigate(['page_not_found']);
      }
      this.router.navigate(['page_not_found']);
      return false;
    } catch (e) {
      this.utilsService.errorHandling(e);
      this.router.navigate(['page-not-found']);
      return false;
    }
  }
}
