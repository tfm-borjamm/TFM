import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private router: Router
  ) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // return true;
    const roleParam = route.data.role;
    const uid = await this.authService.getCurrentUserUID();

    if (uid && roleParam) {
      const role = await this.userService.getRoleUserById(uid).catch((e) => {
        this.router.navigate(['page-not-found']);
        this.utilsService.errorHandling(e);
        return false;
      });
      return roleParam.includes(role) ? true : this.router.navigate(['page-not-found']);
    }

    if (!roleParam) {
      const role = await this.userService.getRoleUserById(uid).catch((e) => {
        this.router.navigate(['page-not-found']);
        this.utilsService.errorHandling(e);
        return false;
      });
      return !role ? true : this.router.navigate(['page-not-found']);
    }

    this.router.navigate(['page-not-found']);
    return false;
  }
}
